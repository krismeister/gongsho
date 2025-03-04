import { AnthropicProvider, createAnthropic } from '@ai-sdk/anthropic';
import { AgentModelConfigs, AgentModels } from '@gongsho/types';
import { generateText, streamText, ToolSet } from 'ai';
import { Observable, Subject } from 'rxjs';
import { gongshoConfig } from '../config/config';
import { AgentFragment, AgentMessage, AgentResponse, FinishPart, isError, isFinish, isReasoning, isSource, isStepFinish, isStepStart, isTextDelta, isToolCall, isToolCallDelta, isToolCallStreamingStart, isToolResult } from './agent-types';
// import { Anthropic } from '@anthropic-ai/sdk';
export class AnthropicAgent {
  private anthropic: AnthropicProvider;
  private textStream$ = new Subject<AgentFragment>();

  constructor() {
    this.anthropic = createAnthropic({
      apiKey: gongshoConfig.anthropicApiKey,
    });
  }

  async sendMessages(
    system: string,
    messages: AgentMessage[],
    model: AgentModels
  ): Promise<AgentResponse> {

    if (!Object.values(AgentModels).includes(model)) {
      throw new Error(`Unsupported model: ${model}`);
    }

    const response = await generateText({
      model: this.anthropic(model),
      maxTokens: AgentModelConfigs[model].maxOutputTokens,
      messages: [
        {
          role: 'system',
          content: system,
        },
        ...messages.map(m => ({ role: m.role, content: m.content.text })),
      ],
    });

    // console.log('AGENT RESPONSE', response);

    return {
      ...response,
      model: response.response.modelId,
      id: response.response.id,
      requestId: response.response.headers?.['request-id']
    }
  }

  get stream$(): Observable<AgentFragment> {
    // TODO if we decide to make classes for each Agent instance.
    // we don't need to reset thi, by completing, and starting a new stream.

    this.textStream$.complete();
    this.textStream$ = new Subject<AgentFragment>();
    return this.textStream$.asObservable();
  }

  async sendStreamedMessages(
    system: string,
    messages: AgentMessage[],
    model: AgentModels
  ): Promise<AgentResponse> {

    if (!Object.values(AgentModels).includes(model)) {
      throw new Error(`Unsupported model: ${model}`);
    }

    let response: AgentResponse | undefined;

    const result = streamText({
      model: this.anthropic(model),
      maxTokens: AgentModelConfigs[model].maxOutputTokens,
      messages: [
        {
          role: 'system',
          content: system,
        },
        ...messages.map(m => ({ role: m.role, content: m.content.text })),
      ],
      onFinish: () => {
        console.log('onFinish met');
        // response = this.convertFinishToAgentResponse2(result as FinishPart<ToolSet>);
      }
    })

    // this.runningStreams.set(runningStreamId, result);
    let accumulatedText = ''
    let messageId = ''
    for await (const part of result.fullStream) {

      if (isStepStart(part)) {
        console.log('Step Start:', part.messageId);
        messageId = part.messageId;
      } else if (isTextDelta(part)) {
        accumulatedText += part.textDelta;
        this.textStream$.next({
          id: messageId,
          text: part.textDelta
        });
      } else if (isFinish(part)) {
        console.log('Finish:', part.finishReason);
        this.textStream$.complete();
        response = await this.convertFinishToAgentResponse(part, accumulatedText, messageId);
        break;
      } else if (isReasoning(part)) {
        console.log('Reasoning:', part.textDelta);
      } else if (isSource(part)) {
        console.log('Source:', part.source);
      } else if (isToolCall(part)) {
        console.log('Tool Call:', part);
      } else if (isToolCallStreamingStart(part)) {
        console.log('Tool Call Streaming Start:', part);
      } else if (isToolCallDelta(part)) {
        console.log('Tool Call Delta:', part);
      } else if (isToolResult(part)) {
        console.log('Tool Result:', part);
      } else if (isStepFinish(part)) {
        console.log('Step Finish:', part.finishReason);
      } else if (isError(part)) {
        console.log('Error:', part.error);
        throw new Error(`Error during streaming: ${part.error}`);
      } else {
        console.log('Unknown type:', part);
      }
    }

    if (!response) {
      throw new Error('No response from stream');
    }

    return response;
  }

  private async convertFinishToAgentResponse(result: FinishPart<ToolSet>, accumulatedText: string, messageId: string): Promise<AgentResponse> {
    const cacheCreationInputTokens = result.providerMetadata ? (result.providerMetadata['anthropic'] as { cacheCreationInputTokens?: number, cacheReadInputTokens?: number })?.cacheCreationInputTokens : undefined
    const cacheReadInputTokens = result.providerMetadata ? (result.providerMetadata['anthropic'] as { cacheCreationInputTokens?: number, cacheReadInputTokens?: number })?.cacheReadInputTokens : undefined

    return {
      id: messageId,
      finishReason: result.finishReason,
      text: accumulatedText,
      usage: {
        promptTokens: result.usage.promptTokens,
        completionTokens: result.usage.completionTokens,
        ...(cacheCreationInputTokens ? { cacheCreationInputTokens } : {}),
        ...(cacheReadInputTokens ? { cacheReadInputTokens } : {})
      },
      model: result.response.modelId,
      requestId: result.response.headers?.['request-id']
    };
  }
}

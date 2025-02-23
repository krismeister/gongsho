import { AnthropicProvider, createAnthropic } from '@ai-sdk/anthropic';
import { AgentModelConfigs, AgentModels } from '@gongsho/types';
import { generateText } from 'ai';
import { gongshoConfig } from '../config/config';
import { AgentMessage, AgentResponse } from './abstract-agent';
// import { Anthropic } from '@anthropic-ai/sdk';

export class AnthropicAgent {
  private anthropic: AnthropicProvider;

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

    console.log('AGENT RESPONSE', response);

    return response;
  }
}

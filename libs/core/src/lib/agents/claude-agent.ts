import Anthropic from '@anthropic-ai/sdk';
import { gongshoConfig } from '../config/config';
import { AgentModelConfig } from '../models/model-configs';
import { AbstractAgent, AgentMessage, AgentResponse } from './abstract-agent';

export class ClaudeAgent extends AbstractAgent {
  private anthropic: Anthropic;

  constructor(modelConfig: AgentModelConfig) {
    super(modelConfig);
    this.anthropic = new Anthropic({
      apiKey: gongshoConfig.anthropicApiKey ?? '',
    });
  }

  async sendMessages(
    system: string,
    messages: AgentMessage[]
  ): Promise<AgentResponse> {
    console.log('sending messages', JSON.stringify(messages));

    const response = await this.anthropic.messages.create({
      model: this.modelConfig.model,
      max_tokens: this.modelConfig.maxTokens,
      temperature: 1,
      system: system,
      // TODO deal with tool reponses correctly.
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content.map(c => ({
          type: 'text',
          text: c.text,
        })),
      })),
    });

    console.log('AGENT response', response);

    return response as unknown as AgentResponse;
  }
}

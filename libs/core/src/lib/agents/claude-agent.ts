import Anthropic from '@anthropic-ai/sdk';
import { AgentModelConfigs, AgentModels, defaultAgentModel } from '@gongsho/types';
import { gongshoConfig } from '../config/config';
import { AbstractAgent, AgentMessage, AgentResponse } from './abstract-agent';

export class ClaudeAgent extends AbstractAgent {
  private anthropic: Anthropic;

  constructor() {
    super(AgentModelConfigs[defaultAgentModel]);
    this.anthropic = new Anthropic({
      apiKey: gongshoConfig.anthropicApiKey ?? '',
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

    console.log('sending messages', JSON.stringify(messages));

    const response = await this.anthropic.messages.create({
      model: model,
      max_tokens: AgentModelConfigs[model].maxOutputTokens,
      temperature: 1,
      system: system,
      // TODO deal with tool responses correctly.
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

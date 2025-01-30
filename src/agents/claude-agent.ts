import { Config } from '@/config/config';
import { AbstractAgent, AgentMessage, AgentResponse } from './abstract-agent';
import Anthropic from '@anthropic-ai/sdk';

export class ClaudeAgent extends AbstractAgent {
  private anthropic: Anthropic;

  constructor(config: Config) {
    super(config);
    this.anthropic = new Anthropic({
      apiKey: config.claude.apiKey,
    });
  }

  async sendMessages(
    system: string,
    messages: AgentMessage[]
  ): Promise<AgentResponse> {
    console.log('sending messages', JSON.stringify(messages));

    const response = await this.anthropic.messages.create({
      model: this.config.claude.model,
      max_tokens: this.config.claude.maxTokens,
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

    return response as unknown as AgentResponse;
  }
}

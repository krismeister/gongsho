import { AgentModelConfig, AgentModels } from '@gongsho/types';

export type AgentMessage = {
  role: 'user' | 'assistant';
  content: {
    type: string; // 'text' | 'tool';
    text: string;
    id?: string;
    input?: unknown;
    name?: string;
  }[];
};

export type Usage = {
  cache_creation_input_tokens: number | null;
  cache_read_input_tokens: number | null;
  input_tokens: number;
  output_tokens: number;
};

export type AgentResponse = {
  id: string;
  content: {
    type: string; // 'text' | 'tool';,
    text: string;
  }[];
  role: 'assistant' | 'user';
  stop_reason?: 'end_turn' | 'max_tokens' | 'stop_sequence' | 'tool_use' | null;
  stop_sequence?: string | null;
  type?: 'message';
  usage?: Usage;
};

export type AgentRequest = {
  model: string;
  max_tokens: number;
  temperature: number;
  messages: AgentMessage[];
};

export abstract class AbstractAgent {
  constructor(protected readonly modelConfig: AgentModelConfig) { }
  abstract sendMessages(
    system: string,
    messages: AgentMessage[],
    model: AgentModels
  ): Promise<AgentResponse>;
}

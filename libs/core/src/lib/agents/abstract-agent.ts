import { GenerateTextResult, ToolSet } from 'ai';
export type AgentMessage = {
  role: 'user' | 'assistant';
  content: {
    type: string; // 'text' | 'tool';
    text: string;
  }
};

export type AgentResponse = GenerateTextResult<ToolSet, never>;
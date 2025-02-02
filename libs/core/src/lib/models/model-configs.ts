export enum AgentModels {
  CLAUDE_3_SONNET = 'claude-3-5-sonnet-20241022',
  CLAUDE_3_OPUS = 'claude-3-opus-20240229',
}

export type AgentModelConfig = {
  model: AgentModels;
  maxTokens: number;
  // maxInputTokens: number;
  // temperature: number;
};

// TODO: Add max inputs later. 200k is the configuration from Aider, should verify.
// const MAX_INPUT_TOKENS = 200000;

export const AgentModelConfigs: Record<AgentModels, AgentModelConfig> = {
  [AgentModels.CLAUDE_3_SONNET]: {
    model: AgentModels.CLAUDE_3_SONNET,
    maxTokens: 8192,
    // temperature: 0.5,
  },
  [AgentModels.CLAUDE_3_OPUS]: {
    model: AgentModels.CLAUDE_3_OPUS,
    maxTokens: 8192,
    // temperature: 0.5,
  },
};

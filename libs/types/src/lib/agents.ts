
// list of anthropic models: https://docs.anthropic.com/en/docs/about-claude/models/all-models
export enum PreferredAgentModels {
  CLAUDE_3_7_SONNET = 'claude-3-7-sonnet-20250219',
  CLAUDE_3_7_HAIKU = 'claude-3-5-haiku-20241022',
  CLAUDE_3_OPUS = 'claude-3-opus-20240229',
}

export enum DeprecatedAgentModels {
  CLAUDE_3_5_SONNET_20241022 = 'claude-3-5-sonnet-20241022',
}

export const AgentModels = {
  ...PreferredAgentModels,
  ...DeprecatedAgentModels,
} as const;

export type AgentModels = (typeof AgentModels)[keyof typeof AgentModels];

export type AgentModelConfig = {
  model: AgentModels;
  friendlyName: string;
  maxOutputTokens: number;
  deprecated?: boolean;
  cost: {
    inputTokensCostPerMillion: number;
    outputTokensCostPerMillion: number;
  }
  // maxInputTokens: number;
  // temperature: number;
};


// TODO: Add max inputs later. 200k is the configuration from Aider, should verify.
// const MAX_INPUT_TOKENS = 200000;

export const AgentModelConfigs: Record<AgentModels, AgentModelConfig> = {
  [AgentModels.CLAUDE_3_7_SONNET]: {
    model: AgentModels.CLAUDE_3_7_SONNET,
    friendlyName: 'Claude 3.7 Sonnet',
    maxOutputTokens: 8192,
    cost: {
      inputTokensCostPerMillion: 3.0,
      outputTokensCostPerMillion: 15.0,
    },
  },
  [AgentModels.CLAUDE_3_OPUS]: {
    model: AgentModels.CLAUDE_3_OPUS,
    friendlyName: 'Claude 3 Opus',
    maxOutputTokens: 4096,
    cost: {
      inputTokensCostPerMillion: 15.0,
      outputTokensCostPerMillion: 75.0,
    },
  },
  [AgentModels.CLAUDE_3_7_HAIKU]: {
    model: AgentModels.CLAUDE_3_7_HAIKU,
    friendlyName: 'Claude 3.7 Haiku',
    maxOutputTokens: 2048,
    cost: {
      inputTokensCostPerMillion: 0.80,
      outputTokensCostPerMillion: 4.0,
    },
  },


  // deprecated models
  [AgentModels.CLAUDE_3_5_SONNET_20241022]: {
    model: AgentModels.CLAUDE_3_5_SONNET_20241022,
    friendlyName: 'Claude 3.5 Sonnet',
    maxOutputTokens: 8192,
    deprecated: true,
    cost: {
      inputTokensCostPerMillion: 3.0,
      outputTokensCostPerMillion: 15.0,
    },
  },
};

export const defaultAgentModel = AgentModels.CLAUDE_3_7_SONNET;

export type ConversationSummary = {
  id: string;
  title: string,
  createdAt: Date
}

export enum DialogRoles {
  USER = 'user',
  SYSTEM = 'system',
  INTERSTITIAL = 'interstitial',
  ASSISTANT = 'assistant',
}

export enum AgentMessageRoles {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export type DialogueData = {
  id: string;
  role: AgentMessageRoles;
  dialogueRole: DialogRoles;
  description: string;
  content: string;
  timestamp: Date;
};

export type ConversationDetails = {
  id: string,
  files: string[],
  dialogueData: DialogueData[];
}

export type ConversationData = {
  summary: ConversationSummary;
  details: ConversationDetails;
}
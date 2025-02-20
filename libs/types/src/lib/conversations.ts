import { AgentModels } from "./agents";

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
  CHANGELIST = 'changelist',
  INFO = 'info',
}

export enum AgentMessageRoles {
  USER = 'user',
  ASSISTANT = 'assistant',
  NONE = 'none',
}

export type DialogData = {
  id: string;
  role: AgentMessageRoles;
  dialogRole: DialogRoles;
  description: string;
  content: string;
  timestamp: Date;
  fileHashes: Record<string, string>;
  agent?: AgentModels;
};

export type ConversationDetails = {
  id: string,
  files: Record<string, string>,
  dialogData: DialogData[];
}

export type ConversationData = {
  summary: ConversationSummary;
  details: ConversationDetails;
}
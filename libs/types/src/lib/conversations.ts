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
  ASSISTANT_FRAGMENT = 'assistant-fragment',
  ASSISTANT_FRAGMENT_START = 'assistant-fragment-start',
  CHANGELIST = 'changelist',
  INFO = 'info',
}

export enum AgentMessageRoles {
  USER = 'user',
  ASSISTANT = 'assistant',
  NONE = 'none',
}

export type Usage = {
  input_tokens: number;
  output_tokens: number;
  // cache_creation_input_tokens: number;
  // cache_read_input_tokens: number;
}

export type DialogData = {
  id: string;
  requestId?: string;
  role: AgentMessageRoles;
  dialogRole: Exclude<DialogRoles, DialogRoles.ASSISTANT_FRAGMENT>;
  description: string;
  content: string;
  timestamp: Date;
  fileHashes: Record<string, string>;
  agent?: AgentModels;
  usage?: Usage;
};

export type DialogFragment = {
  id: string;
  role: DialogRoles;
  dialogRole: DialogRoles.ASSISTANT_FRAGMENT;
  description: string;
  content: string;
}

export type ConversationDetails = {
  id: string,
  files: Record<string, string>,
  dialogData: DialogData[];
}

export type ConversationData = {
  summary: ConversationSummary;
  details: ConversationDetails;
}
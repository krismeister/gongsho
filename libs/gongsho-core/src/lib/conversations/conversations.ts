import { loadGongshoStorage, saveGongshoStorage } from "../utils/storage";
import { Conversation } from "./conversation";

type ConversationSummary = {
  id: string;
  title: string,
  createdAt: Date
}

export class Conversations {
  public static instance: Conversations;
  private version: string;
  private conversations: ConversationSummary[] = [];

  private constructor() {
    this.version = '1';
  }

  public static getInstance() {
    if (!Conversations.instance) {
      Conversations.instance = new Conversations();
    }
    return Conversations.instance;
  }

  public async startConversation(input: string): Promise<Conversation> {
    const conversationId = `conversation-${Date.now()}`;
    const conversation = new Conversation(conversationId);
    await conversation.initConversation();
    await conversation.startConversation(input);
    this.conversations.push({
      id: conversationId,
      title: input,
      createdAt: new Date(),
    });
    await this.save();
    return conversation;
  }

  public async loadConversation(id: string): Promise<Conversation> {
    const conversation = new Conversation(id);
    await conversation.initFromProject(id);;
    return conversation;
  }

  public async load() {
    const storage = loadGongshoStorage();
    this.version = storage.version;
    this.conversations = storage.conversations;
  }

  public async save() {
    const storage = {
      version: this.version,
      conversations: this.conversations,
    }
    saveGongshoStorage(storage);
  }
}


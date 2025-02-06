import { ConversationSummary } from "@gongsho/types";
import { loadGongshoStorage, saveGongshoStorage } from "../utils/storage";
import { Conversation } from "./conversation";


export class Conversations {
  public static instance: Conversations;
  private version: string;
  private conversationsSummaries: ConversationSummary[] = [];
  private conversations: Conversation[] = [];

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
    this.conversationsSummaries.push({
      id: conversationId,
      title: input,
      createdAt: new Date(),
    });
    await this.save();
    return conversation;
  }


  public async loadConversation(id: string): Promise<Conversation> {
    // TODO: get conversation from memory
    const conversation = new Conversation(id);
    await conversation.initFromProject(id);
    return conversation;
  }

  public async load() {
    const storage = loadGongshoStorage();
    this.version = storage.version;
    this.conversationsSummaries = storage.conversations;
  }

  public async save() {
    const storage = {
      version: this.version,
      conversations: this.conversationsSummaries,
    }
    saveGongshoStorage(storage);
  }

  public async getConversationSummaries(): Promise<ConversationSummary[]> {
    if (this.conversationsSummaries.length === 0) {
      await this.load();
    }
    return this.conversationsSummaries;
  }

  public async getConversationSummary(id: string): Promise<ConversationSummary> {
    let conversation = this.conversationsSummaries.find(conversation => conversation.id === id);
    if (!conversation) {
      await this.load();
      conversation = this.conversationsSummaries.find(conversation => conversation.id === id);
    }
    if (!conversation) {
      throw new Error(`Conversation ${id} not found`);
    }
    return conversation;
  }
}


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
      Conversations.instance.load();
    }
    return Conversations.instance;
  }


  public async createConversation(input: string): Promise<ConversationSummary> {
    const conversationId = `${Date.now()}`;
    const conversation = new Conversation(conversationId, input);
    await conversation.loadRepoMap();

    const summary: ConversationSummary = {
      id: conversationId,
      title: input,
      createdAt: new Date(),
    }
    this.conversationsSummaries.push(summary);
    await this.save();
    return summary;
  }

  public async startConversation(input: string): Promise<Conversation> {
    const conversationId = `${Date.now()}`;
    const conversation = new Conversation(conversationId, input);
    await conversation.loadRepoMap();
    await conversation.startConversation(input);
    this.conversationsSummaries.push({
      id: conversationId,
      title: input,
      createdAt: new Date(),
    });
    await this.save();
    return conversation;
  }


  public async getConversation(id: string): Promise<Conversation> {
    let conversation = this.conversations.find(conversation => conversation.id === id);
    if (!conversation) {
      const conversationSummary = this.conversationsSummaries.find(conversation => conversation.id === id);
      if (conversationSummary) {
        conversation = new Conversation(id, '');
        await conversation.loadRepoMap();
        await conversation.load();
        this.conversations.push(conversation);
      }
    }
    if (!conversation) {
      throw new Error(`Conversation ${id} not found`);
    }
    return conversation;
  }

  public load() {
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


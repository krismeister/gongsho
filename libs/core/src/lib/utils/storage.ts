import { ConversationDetails, ConversationSummary } from "@gongsho/types";
import fs from 'fs';
import path from "path";
import YAML from 'yaml';
import { gongshoConfig } from "../config/config";

type GongshoStorage = {
  version: string,
  conversations: ConversationSummary[],
}

export const conversationExists = (id: string) => {
  const filePath = path.resolve(gongshoConfig.GONGSHO_DIR, `./conversations/${id}.yml`);
  return fs.existsSync(filePath);
}

export const saveConversationDetails = (conversation: ConversationDetails) => {
  const filePath = path.resolve(gongshoConfig.GONGSHO_DIR, `./conversations/${conversation.id}.yml`);

  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(filePath, YAML.stringify(conversation, { lineWidth: 0 }));
}

export const loadConversation = (id: string): ConversationDetails => {
  const filePath = path.resolve(gongshoConfig.GONGSHO_DIR, `./conversations/${id}.yml`);
  const conversation = YAML.parse(fs.readFileSync(filePath, 'utf8'))
  return conversation as ConversationDetails;
}

export const loadGongshoStorage = (): GongshoStorage => {
  const filePath = path.resolve(gongshoConfig.GONGSHO_DIR, `./gongsho.yml`);
  if (!fs.existsSync(filePath)) {
    return {
      version: '0.0.1',
      conversations: [],
    }
  }
  const storage = YAML.parse(fs.readFileSync(filePath, 'utf8'))
  return storage as GongshoStorage;
}

export const saveGongshoStorage = (storage: GongshoStorage) => {
  const filePath = path.resolve(gongshoConfig.GONGSHO_DIR, `./gongsho.yml`);
  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(filePath, YAML.stringify(storage, { lineWidth: 0 }));
}
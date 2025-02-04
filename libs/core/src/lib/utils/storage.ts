import fs from 'fs';
import path from "path";
import YAML from 'yaml';
import { DialogueData } from "../dialogue/base-dialogue";
import { gongshoConfig } from "../core";

type ConversationData = {
  id: string;
  dialogueData: DialogueData[],
  includedFiles: string[],
}

type ConversationSummary = {
  id: string;
  title: string,
  createdAt: Date
}

type GongshoStorage = {
  version: string,
  conversations: ConversationSummary[],
}

export const saveConversation = (conversation: ConversationData) => {
  const filePath = path.resolve(gongshoConfig.GONGSHO_DIR, `./conversartions/${conversation.id}.yml`);

    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(filePath, YAML.stringify(conversation, { lineWidth: 0 }));
}

export const loadConversation = (id: string):ConversationData =>  {
  const filePath = path.resolve(gongshoConfig.GONGSHO_DIR, `./conversartions/${id}.yml`);
  const conversation = YAML.parse(fs.readFileSync(filePath, 'utf8'))
  return conversation as ConversationData;
}

export const loadGongshoStorage = ():GongshoStorage =>  {
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
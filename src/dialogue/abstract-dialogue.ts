import { fillDialogue } from '@/utils/fill-dialogue';
import { DialogRoles } from './conversation';

export type DialogueData = {
  role: 'user' | 'assistant';
  dialogueRole: DialogRoles;
  inputText: string;
  description: string;
  content: string;
  timestamp: Date;
};

export abstract class AbstractDialogue {
  protected abstract description: string;
  protected timestamp: Date;
  protected dialogueRole: DialogRoles = DialogRoles.SYSTEM;
  public role: 'user' | 'assistant' = 'assistant';
  public content: string = '';

  constructor(
    protected readonly inputText: string,
    protected readonly fillValues: Record<string, string>
  ) {
    this.content = fillDialogue(this.inputText, this.fillValues);
    this.timestamp = new Date();
  }

  public getDialogueData(): DialogueData {
    return {
      role: this.role,
      dialogueRole: this.dialogueRole,
      description: this.description,
      inputText: this.inputText,
      content: this.content,
      timestamp: this.timestamp,
    };
  }
}

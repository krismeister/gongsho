import { AgentMessageRoles, DialogRoles, DialogueData } from '@gongsho/types';
import { v4 as uuidv4 } from 'uuid';
import { fillDialogue } from '../utils/fill-dialogue';

export class BaseDialogue {
  protected description: string;
  protected timestamp: Date;
  public id: string;
  public dialogueRole: DialogRoles = DialogRoles.SYSTEM;
  public role: AgentMessageRoles = AgentMessageRoles.ASSISTANT;
  public content = '';

  constructor(
    protected readonly inputText: string,
    protected readonly fillValues: Record<string, string>
  ) {
    this.content = fillDialogue(this.inputText, this.fillValues);
    this.description = '';
    this.timestamp = new Date();
    this.id = uuidv4();
  }

  public getDialogueData(): DialogueData {
    return {
      id: this.id,
      role: this.role,
      dialogueRole: this.dialogueRole,
      description: this.description,
      content: this.content,
      timestamp: this.timestamp,
    };
  }

  public static fromDialogueData(data: DialogueData): BaseDialogue {
    const newDialogue = new BaseDialogue(data.content, {});
    newDialogue.description = data.description;
    newDialogue.timestamp = data.timestamp;
    newDialogue.id = data.id;
    newDialogue.dialogueRole = data.dialogueRole;
    newDialogue.role = data.role;
    return newDialogue;
  }
}

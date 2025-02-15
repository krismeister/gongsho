import { AgentMessageRoles, DialogData, DialogRoles } from '@gongsho/types';
import { v4 as uuidv4 } from 'uuid';
import { fillDialog } from '../utils/fill-dialog';

export class BaseDialog {
  protected description: string;
  protected timestamp: Date;
  public id: string;
  public dialogRole: DialogRoles = DialogRoles.SYSTEM;
  public role: AgentMessageRoles = AgentMessageRoles.ASSISTANT;
  public content = '';

  constructor(
    protected readonly inputText: string,
    protected readonly fillValues: Record<string, string>
  ) {
    this.content = fillDialog(this.inputText, this.fillValues);
    this.description = '';
    this.timestamp = new Date();
    this.id = uuidv4();
  }

  public getDialogData(): DialogData {
    return {
      id: this.id,
      role: this.role,
      dialogRole: this.dialogRole,
      description: this.description,
      content: this.content,
      timestamp: this.timestamp,
    };
  }

  public static fromDialogData(data: DialogData): BaseDialog {
    const newDialogue = new BaseDialog(data.content, {});
    newDialogue.description = data.description;
    newDialogue.timestamp = data.timestamp;
    newDialogue.id = data.id;
    newDialogue.dialogRole = data.dialogRole;
    newDialogue.role = data.role;
    return newDialogue;
  }
}


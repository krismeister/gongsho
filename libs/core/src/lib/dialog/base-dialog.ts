import { AgentMessageRoles, AgentModels, DialogData, DialogRoles, Usage } from '@gongsho/types';
import { v4 as uuidv4 } from 'uuid';
import { fillDialog } from '../utils/dialog';
export class BaseDialog {
  protected description: string;
  protected timestamp: Date;
  protected fileHashes: Record<string, string> = {};
  public id: string;
  public requestId?: string;

  public dialogRole: Exclude<DialogRoles, DialogRoles.ASSISTANT_FRAGMENT> = DialogRoles.SYSTEM;
  public role: AgentMessageRoles = AgentMessageRoles.ASSISTANT;
  public content = '';
  public usage?: Usage;

  constructor(
    protected readonly inputText: string,
    protected readonly fillValues: Record<string, string> = {},
    protected readonly agent?: AgentModels
  ) {
    this.content = fillDialog(this.inputText, this.fillValues);
    this.description = '';
    this.timestamp = new Date();
    this.id = uuidv4();
  }

  public getDialogData(): DialogData {
    return {
      id: this.id,
      ...(this.requestId ? { requestId: this.requestId } : {}),
      role: this.role,
      dialogRole: this.dialogRole,
      description: this.description,
      content: this.content,
      timestamp: this.timestamp,
      fileHashes: this.fileHashes,
      ...(this.agent ? { agent: this.agent } : {}),
      ...(this.usage ? { usage: this.usage } : {}),
    };
  }

  public static fromDialogData(data: DialogData): BaseDialog {
    if (data.agent as string === 'undefined') {
      data.agent = undefined;
    }
    const newDialog = new BaseDialog(data.content, {}, data.agent);
    newDialog.description = data.description;
    newDialog.timestamp = data.timestamp;
    newDialog.id = data.id;
    newDialog.requestId = data.requestId;
    newDialog.dialogRole = data.dialogRole;
    newDialog.role = data.role;
    newDialog.fileHashes = data.fileHashes;
    newDialog.usage = data.usage;
    return newDialog;
  }
}


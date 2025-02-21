import { AgentMessageRoles, AgentModels, DialogRoles, Usage } from '@gongsho/types';
import { BaseDialog } from '../base-dialog';

export class AssistantChangelistDialog extends BaseDialog {

  protected override description = 'Assistant Output';

  // TODO store agent specific meta data
  // tokens, stopReason ect..
  public model = '';
  public stopReason = '';
  public stopSequence = '';

  constructor(
    protected readonly text: string,
    protected override readonly fillValues: Record<string, string> = {},
    protected override readonly agent: AgentModels
  ) {
    super(text, fillValues, agent);
    this.description = 'Assistant Generated Changelist';
    this.role = AgentMessageRoles.ASSISTANT;
    this.dialogRole = DialogRoles.CHANGELIST;
  }

  public static create(text: string, agent: AgentModels, usage: Usage): AssistantChangelistDialog {
    const dialog = new AssistantChangelistDialog(text, {}, agent);
    dialog.usage = usage;
    return dialog;
  }
}
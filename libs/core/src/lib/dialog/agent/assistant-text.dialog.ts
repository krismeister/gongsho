import { AgentMessageRoles, AgentModels, DialogRoles, Usage } from '@gongsho/types';
import { BaseDialog } from '../base-dialog';

export class AssistantTextDialog extends BaseDialog {

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
    this.description = 'Assistant Output';
    this.role = AgentMessageRoles.ASSISTANT;
    this.dialogRole = DialogRoles.ASSISTANT;
  }

  public static create(text: string, agent: AgentModels, usage: Usage): AssistantTextDialog {
    const dialog = new AssistantTextDialog(text, {}, agent);
    dialog.usage = usage;
    return dialog;
  }
}

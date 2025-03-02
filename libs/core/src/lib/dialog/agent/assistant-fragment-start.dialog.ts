import { AgentMessageRoles, AgentModels, DialogRoles } from '@gongsho/types';
import { BaseDialog } from '../base-dialog';

export class AssistantFragmentStartDialog extends BaseDialog {

  protected override description = 'Assistant Output';

  // TODO store agent specific meta data
  // tokens, stopReason ect..
  public model = '';
  public stopReason = '';
  public stopSequence = '';

  constructor(
    protected readonly text: string,
    protected override readonly fillValues: Record<string, string> = {},
    protected override readonly agent: AgentModels,
  ) {
    super(text, fillValues, agent);
    this.description = 'Assistant Streaming Response';
    this.role = AgentMessageRoles.ASSISTANT;
    this.dialogRole = DialogRoles.ASSISTANT_FRAGMENT_START;
  }

  public static create(text: string, agent: AgentModels, id: string): AssistantFragmentStartDialog {
    const dialog = new AssistantFragmentStartDialog(text, {}, agent);
    dialog.id = id;
    return dialog;
  }
}
import { AgentMessageRoles, AgentModels, DialogRoles, Usage } from '@gongsho/types';
import { BaseDialog } from '../base-dialog';

export class AssistantAcknowledgedDialog extends BaseDialog {

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
    this.description = 'Assistant Acknowledged';
    this.role = AgentMessageRoles.ASSISTANT;
    this.dialogRole = DialogRoles.INTERSTITIAL;
  }

  public static create(text: string, agent: AgentModels, usage: Usage, id: string, requestId?: string): AssistantAcknowledgedDialog {
    const dialog = new AssistantAcknowledgedDialog(text, {}, agent);
    dialog.id = id;
    dialog.requestId = requestId;
    dialog.usage = usage;
    return dialog;
  }
}
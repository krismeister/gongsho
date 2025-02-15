import { AgentMessageRoles, DialogRoles } from '@gongsho/types';
import { BaseDialog } from '../base-dialog';

export class AssistantAcknowledgedDialog extends BaseDialog {

  protected override description = 'Assistant Output';

  // TODO store agent specific meta data
  // tokens, stopReason ect..
  public model = '';
  public stopReason = '';
  public stopSequence = '';
  public usage: Record<string, string> = {};

  constructor(
    protected readonly text: string,
    protected override readonly fillValues: Record<string, string> = {}
  ) {
    super(text, fillValues);
    this.description = 'Assistant Acknowledged';
    this.role = AgentMessageRoles.ASSISTANT;
    this.dialogRole = DialogRoles.INTERSTITIAL;
  }
}
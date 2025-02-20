import { AgentMessageRoles, AgentModels, DialogRoles } from '@gongsho/types';
import { BaseDialog } from './base-dialog';

export class UserInputDialog extends BaseDialog {
  protected override description = 'User Input';

  constructor(
    protected override readonly inputText: string,
    protected override readonly fillValues: Record<string, string>,
    protected override readonly agent: AgentModels
  ) {
    super(inputText, fillValues, agent);
    this.role = AgentMessageRoles.USER;
    this.dialogRole = DialogRoles.USER;
  }
}

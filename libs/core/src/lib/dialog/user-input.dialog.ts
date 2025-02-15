import { AgentMessageRoles, DialogRoles } from '@gongsho/types';
import { BaseDialog } from './base-dialog';

export class UserInputDialog extends BaseDialog {
  protected override description = 'User Input';

  constructor(
    protected override readonly inputText: string,
    protected override readonly fillValues: Record<string, string> = {}
  ) {
    super(inputText, fillValues);
    this.role = AgentMessageRoles.USER;
    this.dialogRole = DialogRoles.USER;
  }
}

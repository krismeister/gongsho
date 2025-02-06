import { AgentMessageRoles, DialogRoles } from '@gongsho/types';
import { BaseDialogue } from './base-dialogue';

export class UserInputDialogue extends BaseDialogue {
  protected override description = 'User Input';

  constructor(
    protected override readonly inputText: string,
    protected override readonly fillValues: Record<string, string> = {}
  ) {
    super(inputText, fillValues);
    this.role = AgentMessageRoles.USER;
    this.dialogueRole = DialogRoles.USER;
  }
}

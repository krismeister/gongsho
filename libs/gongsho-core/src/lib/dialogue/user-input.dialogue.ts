import { BaseDialogue } from './base-dialogue';
import { DialogRoles } from './conversation';

export class UserInputDialogue extends BaseDialogue {
  protected override description = 'User Input';

  constructor(
    protected override readonly inputText: string,
    protected override readonly fillValues: Record<string, string> = {}
  ) {
    super(inputText, fillValues);
    this.role = 'user';
    this.dialogueRole = DialogRoles.USER;
  }  
}

import { BaseDialogue } from './base-dialogue';
import { DialogRoles } from './conversation';

export class UserInputDialogue extends BaseDialogue {
  protected description: string = 'User Input';
  constructor(
    protected readonly inputText: string,
    protected readonly fillValues: Record<string, string> = {}
  ) {
    super(inputText, fillValues);
    this.role = 'user';
    this.dialogueRole = DialogRoles.USER;
  }
}

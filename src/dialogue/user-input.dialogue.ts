import { AbstractDialogue } from './abstract-dialogue';
import { DialogRoles } from './conversation';

export class UserInputDialogue extends AbstractDialogue {
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

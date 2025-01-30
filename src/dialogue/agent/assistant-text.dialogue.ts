import { AbstractDialogue } from '../abstract-dialogue';
import { DialogRoles } from '../conversation';

export class AssistantTextDialogue extends AbstractDialogue {
  protected description: string = 'Assistant Output';

  public model: string = '';
  public id: string = '';
  public stopReason: string = '';
  public stopSequence: string = '';
  public usage: Record<string, string> = {};

  constructor(
    protected readonly text: string,
    protected readonly fillValues: Record<string, string> = {}
  ) {
    super(text, fillValues);
    this.role = 'assistant';
    this.dialogueRole = DialogRoles.ASSISTANT;
  }
}

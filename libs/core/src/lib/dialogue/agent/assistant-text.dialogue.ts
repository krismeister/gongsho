import { AgentMessageRoles, DialogRoles } from '@gongsho/types';
import { BaseDialogue } from '../base-dialogue';

export class AssistantTextDialogue extends BaseDialogue {

  protected override description = 'Assistant Output';

  public model = '';
  public id = '';
  public stopReason = '';
  public stopSequence = '';
  public usage: Record<string, string> = {};

  constructor(
    protected readonly text: string,
    protected override readonly fillValues: Record<string, string> = {}
  ) {
    super(text, fillValues);
    this.description = 'Assistant Output';
    this.role = AgentMessageRoles.ASSISTANT;
    this.dialogueRole = DialogRoles.ASSISTANT;
  }
}

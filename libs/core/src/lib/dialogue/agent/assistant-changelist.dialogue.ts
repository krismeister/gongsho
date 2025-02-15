import { AgentMessageRoles, DialogRoles } from '@gongsho/types';
import { BaseDialogue } from '../base-dialogue';

export class AssistantChangelistDialogue extends BaseDialogue {

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
    this.description = 'Assistant Generated Changelist';
    this.role = AgentMessageRoles.ASSISTANT;
    this.dialogueRole = DialogRoles.CHANGELIST;
  }
}
import { AgentMessageRoles, DialogRoles } from "@gongsho/types";
import { BaseDialogue } from "../base-dialogue";

export class ChangelistAppliedDialogue extends BaseDialogue {
  constructor(
    protected override readonly inputText = '',
    protected override readonly fillValues: Record<string, string> = {}
  ) {
    super(prompt, fillValues);
    this.role = AgentMessageRoles.NONE;
    this.dialogueRole = DialogRoles.INFO;
    this.description = 'Changelist Applied';
  }
}

const prompt = `The changelist has been applied.`
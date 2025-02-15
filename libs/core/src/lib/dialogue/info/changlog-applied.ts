import { AgentMessageRoles, DialogRoles } from "@gongsho/types";
import { BaseDialogue } from "../base-dialogue";

export class ChangelogAppliedDialogue extends BaseDialogue {
  constructor(
    protected override readonly inputText = '',
    protected override readonly fillValues: Record<string, string> = {}
  ) {
    super(prompt, fillValues);
    this.role = AgentMessageRoles.NONE;
    this.dialogueRole = DialogRoles.INFO;
    this.description = 'Changlog Applied';
  }
}

const prompt = `The changelog has been applied.`
import { AgentMessageRoles, DialogRoles } from "@gongsho/types";
import { BaseDialog } from "../base-dialog";

export class ChangelistAppliedDialog extends BaseDialog {
  constructor(
    protected override readonly inputText = '',
    protected override readonly fillValues: Record<string, string> = {}
  ) {
    super(prompt, fillValues);
    this.role = AgentMessageRoles.NONE;
    this.dialogRole = DialogRoles.INFO;
    this.description = 'Changelist Applied';
  }
}

const prompt = `The changelist has been applied.`
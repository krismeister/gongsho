import { AgentMessageRoles, DialogRoles } from "@gongsho/types";
import { BaseDialog } from "../base-dialog";

export class ChangelistDialog extends BaseDialog {
  constructor(
    protected override readonly inputText = '',
    protected override readonly fillValues: Record<string, string> = {}
  ) {
    super(prompt, fillValues);
    this.role = AgentMessageRoles.USER;
    this.dialogRole = DialogRoles.INTERSTITIAL;
    this.description = 'Request A Changelist';
  }
}

const prompt = `Build me a "CHANGELIST" of the changes you have recommended based on my the latest files I have added to the chat. Only reply with "CHANGELIST" then all the *SEARCH/REPLACE* blocks.
Only respond with a "CHANGELIST" when specifically requested.`
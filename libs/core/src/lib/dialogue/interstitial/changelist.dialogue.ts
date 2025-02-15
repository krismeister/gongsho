import { AgentMessageRoles, DialogRoles } from "@gongsho/types";
import { BaseDialogue } from "../base-dialogue";

export class ChangelistDialogue extends BaseDialogue {
  constructor(
    protected override readonly inputText = '',
    protected override readonly fillValues: Record<string, string> = {}
  ) {
    super(prompt, fillValues);
    this.role = AgentMessageRoles.USER;
    this.dialogueRole = DialogRoles.INTERSTITIAL;
    this.description = 'Request A Changelist';
  }
}

const prompt = `Build me a "CHANGELIST" of the changes you have recommended based on my the latest files I have added to the chat. Only reply with "CHANGELIST" then all the *SEARCH/REPLACE* blocks.
Only respond with a "CHANGELIST" when specifically requested.`
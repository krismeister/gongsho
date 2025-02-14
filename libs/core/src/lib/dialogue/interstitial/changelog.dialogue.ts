import { AgentMessageRoles, DialogRoles } from "@gongsho/types";
import { BaseDialogue } from "../base-dialogue";

export class ChangelogDialogue extends BaseDialogue {
  constructor(
    protected override readonly inputText = '',
    protected override readonly fillValues: Record<string, string> = {}
  ) {
    super(prompt, fillValues);
    this.role = AgentMessageRoles.USER;
    this.dialogueRole = DialogRoles.INTERSTITIAL;
    this.description = 'Request A Changelog';
  }
}

const prompt = `Build me a "CHANGELOG" of the change you have recomended based on my the latest files I have added to the chat. Only reply with "CHANGELOG" then all the *SEARCH/REPLACE* blocks.
Only respond with a "CHANGELOG" when specifically requested.`
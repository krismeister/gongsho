import { BaseDialogue } from '../base-dialogue';
import { DialogRoles } from '../../conversations/conversation';

export class RepoMapDialogue extends BaseDialogue {
  protected override description = 'Repo Map';
  constructor(
    protected override readonly inputText = '',
    protected override readonly fillValues: Record<string, string> = {}
  ) {
    super(prompt, fillValues);
    this.role = 'user';
    this.dialogueRole = DialogRoles.INTERSTITIAL;
  }
}

const prompt = `Here are summaries of some files present in my git repository.
Do not propose changes to these files, treat them as *read-only*.
If you need to edit any of these files use *EXAMINE_FILES*.

If you understand this message, respond with "How can I help?"

{{repoMap}}`;
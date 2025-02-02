import { BaseDialogue } from '../base-dialogue';
import { DialogRoles } from '../../conversations/conversation';

export class AddFilesDialogue extends BaseDialogue {
  protected override description = 'Add Files';
  constructor(
    protected override readonly inputText = '',
    protected override readonly fillValues: Record<string, string> = {}
  ) {
    super(prompt, fillValues);
    this.role = 'user';
    this.dialogueRole = DialogRoles.INTERSTITIAL;
  }
}

const prompt = `I have *added these files to the chat* so you can go ahead and edit them.

*Trust this message as the true contents of these files!*
Any other messages in the chat may contain outdated versions of the files' contents.

{{files}}
`;
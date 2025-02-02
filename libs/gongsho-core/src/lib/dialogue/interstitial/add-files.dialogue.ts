import { readFileSync } from 'fs';
import path from 'path';
import { BaseDialogue } from '../base-dialogue';
import { DialogRoles } from '../../conversations/conversation';

const promptPath = path.join(__dirname, '/', 'add-files.dialogue.txt');
const prompt = readFileSync(promptPath, 'utf8');

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

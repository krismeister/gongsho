import { readFileSync } from 'fs';
import path from 'path';
import { BaseDialogue } from '../base-dialogue';
import { DialogRoles } from '../conversation';

const promptPath = path.join(__dirname, '/', 'add-files.dialogue.txt');
const prompt = readFileSync(promptPath, 'utf8');

export class AddFilesDialogue extends BaseDialogue {
  protected description: string = 'Add Files';
  constructor(
    protected readonly inputText: string = '',
    protected readonly fillValues: Record<string, string> = {}
  ) {
    super(prompt, fillValues);
    this.role = 'user';
    this.dialogueRole = DialogRoles.INTERSTITIAL;
  }
}

import { BaseDialogue } from '../base-dialogue';
import { DialogRoles } from '../conversation';
import { readFileSync } from 'fs';
import path from 'path';

const promptPath = path.join(__dirname, '/', 'repo-map.dialogue.txt');
const prompt = readFileSync(promptPath, 'utf8');

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

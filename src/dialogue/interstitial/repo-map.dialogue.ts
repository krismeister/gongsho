import { AbstractDialogue } from '@/dialogue/abstract-dialogue';
import { DialogRoles } from '../conversation';
import { readFileSync } from 'fs';
import path from 'path';

const promptPath = path.join(__dirname, '/', 'repo-map.dialogue.txt');
const prompt = readFileSync(promptPath, 'utf8');

export class RepoMapDialogue extends AbstractDialogue {
  protected description: string = 'Repo Map';
  constructor(
    protected readonly inputText: string = '',
    protected readonly fillValues: Record<string, string> = {}
  ) {
    super(prompt, fillValues);
    this.role = 'user';
    this.dialogueRole = DialogRoles.INTERSTITIAL;
  }
}

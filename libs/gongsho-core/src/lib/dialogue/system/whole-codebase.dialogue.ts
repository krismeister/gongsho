import { BaseDialogue } from '../base-dialogue';
import { DialogRoles } from '../../conversations/conversation';
import os from 'os';
import { readFileSync } from 'fs';
import path from 'path';

const promptPath = path.join(__dirname, '/', 'whole-codebase.dialogue.txt');
const prompt = readFileSync(promptPath, 'utf8');

export function generateSystemInfo(): string {
  const platform = os.platform() + '-' + os.release() + '-' + os.arch();
  const shell = process.env['SHELL'] || '/bin/bash';
  const lang = process.env['LANG'] || 'en_US';
  const currentDate = new Date().toISOString().split('T')[0];

  return `Use the appropriate shell based on the user's info:
  - Platform: ${platform}
  - Shell: SHELL=${shell}
  - Language: ${lang}
  - Current date: ${currentDate}`;
}

export class WholeCodebaseDialogue extends BaseDialogue {
  protected override description = 'Whole Codebase';
  constructor(
    protected override readonly inputText = '',
    protected override readonly fillValues: Record<string, string> = {}
  ) {
    fillValues['sysInfo'] = generateSystemInfo();
    super(prompt, fillValues);
    this.role = 'assistant';
    this.dialogueRole = DialogRoles.SYSTEM;
  }
}

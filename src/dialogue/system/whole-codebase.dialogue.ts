import { BaseDialogue } from '@/dialogue/base-dialogue';
import { DialogRoles } from '@/dialogue/conversation';
import os from 'os';
import { readFileSync } from 'fs';
import path from 'path';

const promptPath = path.join(__dirname, '/', 'whole-codebase.dialogue.txt');
const prompt = readFileSync(promptPath, 'utf8');

export function generateSystemInfo(): string {
  const platform = os.platform() + '-' + os.release() + '-' + os.arch();
  const shell = process.env.SHELL || '/bin/bash';
  const lang = process.env.LANG || 'en_US';
  const currentDate = new Date().toISOString().split('T')[0];

  return `Use the appropriate shell based on the user's info:
  - Platform: ${platform}
  - Shell: SHELL=${shell}
  - Language: ${lang}
  - Current date: ${currentDate}`;
}

export class WholeCodebaseDialogue extends BaseDialogue {
  protected description: string = 'Whole Codebase';
  constructor(
    protected readonly inputText: string = '',
    protected readonly fillValues: Record<string, string> = {}
  ) {
    fillValues['sysInfo'] = generateSystemInfo();
    debugger;
    super(prompt, fillValues);
    this.role = 'assistant';
    this.dialogueRole = DialogRoles.SYSTEM;
  }
}

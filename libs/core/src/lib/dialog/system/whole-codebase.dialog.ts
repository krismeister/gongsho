import { AgentMessageRoles, DialogRoles } from '@gongsho/types';
import os from 'os';
import path from 'path';
import { loadTemplate } from '../../utils/template';
import { BaseDialog } from '../base-dialog';

const prompt = loadTemplate(path.join(__dirname + '/whole-codebase.dialog.tpl'));

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

export class WholeCodebaseDialog extends BaseDialog {
  protected override description = 'Whole Codebase';
  constructor(
    protected override readonly inputText = '',
    protected override readonly fillValues: Record<string, string> = {}
  ) {
    fillValues['sysInfo'] = generateSystemInfo();
    super(prompt, fillValues);
    debugger;
    this.role = AgentMessageRoles.ASSISTANT;
    this.dialogRole = DialogRoles.SYSTEM;
  }
}
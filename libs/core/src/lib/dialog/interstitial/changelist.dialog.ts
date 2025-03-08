import { AgentMessageRoles, AgentModels, DialogRoles } from "@gongsho/types";
import { loadTemplate } from "../../utils/template";
import { BaseDialog } from "../base-dialog";

const prompt = loadTemplate('changelist.dialog.tpl');

export class ChangelistDialog extends BaseDialog {

  constructor(
    protected override readonly inputText = '',
    protected override readonly fillValues: Record<string, string> = {},
    protected override readonly agent: AgentModels
  ) {
    super(inputText, fillValues, agent);
    this.role = AgentMessageRoles.USER;
    this.dialogRole = DialogRoles.INTERSTITIAL;
    this.description = 'Request A Changelist';
  }

  static create(agent: AgentModels): ChangelistDialog {
    return new ChangelistDialog(prompt, {}, agent);
  }
}
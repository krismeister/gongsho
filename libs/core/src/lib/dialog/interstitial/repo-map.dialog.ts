import { AgentMessageRoles, AgentModels, DialogRoles } from '@gongsho/types';
import { RepoMap } from '../../repo-map/repo-map';
import { loadTemplate } from '../../utils/template';
import { BaseDialog } from '../base-dialog';

const prompt = loadTemplate('repo-map.dialog.tpl');
export class RepoMapDialog extends BaseDialog {
  protected override description = 'Repo Map';
  constructor(
    protected override readonly inputText = '',
    protected override readonly fillValues: Record<string, string> = {},
    protected override readonly agent: AgentModels
  ) {
    super(prompt, fillValues, agent);
    this.role = AgentMessageRoles.USER;
    this.dialogRole = DialogRoles.INTERSTITIAL;
  }

  public static create(agent: AgentModels): RepoMapDialog {
    const repoMap = RepoMap.getProjectFilesList();
    return new RepoMapDialog('', {
      repoMap: repoMap,
    }, agent);

  }
}
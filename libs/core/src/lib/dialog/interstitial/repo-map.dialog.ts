import { AgentMessageRoles, DialogRoles } from '@gongsho/types';
import { RepoMap } from '../../repo-map/repo-map';
import { BaseDialog } from '../base-dialog';
export class RepoMapDialog extends BaseDialog {
  protected override description = 'Repo Map';
  constructor(
    protected override readonly inputText = '',
    protected override readonly fillValues: Record<string, string> = {}
  ) {
    super(prompt, fillValues);
    this.role = AgentMessageRoles.USER;
    this.dialogRole = DialogRoles.INTERSTITIAL;
  }

  public static create(): RepoMapDialog {
    const repoMap = RepoMap.getRepoMapAstText();
    return new RepoMapDialog('', {
      repoMap: repoMap,
    });

  }
}

const prompt = `Here are summaries of some files present in my git repository.
Do not propose changes to these files, treat them as *read-only*.
If you need to edit any of these files use *EXAMINE_FILES*.

If you understand this message, respond with "How can I help?"

{{repoMap}}`;
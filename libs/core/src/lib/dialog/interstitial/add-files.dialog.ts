import { AgentMessageRoles, AgentModels, DialogRoles } from '@gongsho/types';
import { RepoMap } from '../../repo-map/repo-map';
import { deletesAndUpdates } from '../../utils/dialog';
import { loadTemplate } from '../../utils/template';
import { BaseDialog } from '../base-dialog';

const prompt = loadTemplate('add-files.dialog.tpl');
export class AddFilesDialog extends BaseDialog {
  protected override description = 'Add Files';
  constructor(
    protected override readonly inputText = '',
    protected override readonly fillValues: Record<string, string> = {},
    protected override readonly agent: AgentModels
  ) {
    super(prompt, fillValues);
    this.role = AgentMessageRoles.USER;
    this.dialogRole = DialogRoles.INTERSTITIAL;
  }

  public static async create(filePaths: string[], agent: AgentModels): Promise<AddFilesDialog> {

    const repoFiles = await RepoMap.loadContents(filePaths);

    const { files, fileHashes } = deletesAndUpdates(repoFiles);
    const dialog = new AddFilesDialog('', {
      deletes: '',
      files,
    }, agent);

    dialog.fileHashes = fileHashes;

    return dialog
  }
}
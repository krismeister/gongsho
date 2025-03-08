import { AgentMessageRoles, DialogRoles } from '@gongsho/types';
import { RepoMap } from '../../repo-map/repo-map';
import { deletesAndUpdates } from '../../utils/dialog';
import { loadTemplate } from '../../utils/template';
import { BaseDialog } from '../base-dialog';

const prompt = loadTemplate('files-changed.dialog.tpl');
export class FilesChangedDialog extends BaseDialog {
  protected override description = 'Files Changed';
  constructor(
    protected override readonly inputText = '',
    protected override readonly fillValues: Record<string, string> = {}
  ) {
    super(prompt, fillValues);
    this.role = AgentMessageRoles.USER;
    this.dialogRole = DialogRoles.INTERSTITIAL;
  }

  public static async create(filePaths: string[]): Promise<FilesChangedDialog> {

    const repoFiles = await RepoMap.loadContents(filePaths);
    const { files, deletedFiles, fileHashes } = deletesAndUpdates(repoFiles);

    let deletes = '';
    if (deletedFiles) {
      deletes = `These files have been deleted\n${deletedFiles}\n`;
    }

    const dialog = new FilesChangedDialog('', {
      deletes,
      files
    });

    dialog.fileHashes = fileHashes

    return dialog
  }
}

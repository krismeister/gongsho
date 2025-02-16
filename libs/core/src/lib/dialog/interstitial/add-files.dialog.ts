import { AgentMessageRoles, DialogRoles } from '@gongsho/types';
import { RepoMap } from '../../repo-map/repo-map';
import { deletesAndUpdates } from '../../utils/dialog';
import { BaseDialog } from '../base-dialog';

export class AddFilesDialog extends BaseDialog {
  protected override description = 'Add Files';
  constructor(
    protected override readonly inputText = '',
    protected override readonly fillValues: Record<string, string> = {}
  ) {
    super(prompt, fillValues);
    this.role = AgentMessageRoles.USER;
    this.dialogRole = DialogRoles.INTERSTITIAL;
  }

  public static async create(filePaths: string[]): Promise<AddFilesDialog> {
    debugger;

    const repoFiles = await RepoMap.loadContents(filePaths);

    const { files, fileHashes } = deletesAndUpdates(repoFiles);
    const dialog = new AddFilesDialog('', {
      deletes: '',
      files,
    });

    dialog.fileHashes = fileHashes;

    return dialog
  }
}

const prompt = `I have *added these files to the chat* so you can go ahead and edit them.

*Trust this message as the true contents of these files!*
Any other messages in the chat may contain outdated versions of the files' contents.
{{deletes}}
{{files}}
`;
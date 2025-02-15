import { AgentMessageRoles, DialogRoles } from '@gongsho/types';
import { RepoMap } from '../../repo-map/repo-map';
import { BaseDialog } from '../base-dialog';

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

  public static async create(files: string[]): Promise<FilesChangedDialog> {

    const repoFiles = await RepoMap.loadContents(files);

    const fileContents = Object.values(repoFiles)
      .map(file => file.getContentsForLlmMessage())
      .join('\n');

    const dialog = new FilesChangedDialog('', {
      files: fileContents,
    });

    dialog.fileHashes = Object.fromEntries(files.map(file => [file, repoFiles[file].getHash()]));

    return dialog
  }
}

const prompt = `I have *updated these files* that I sent you earlier.
Any other messages in the chat may contain outdated versions of the files' contents.

I want to ask you followup questions, please respond with "OK" if you are ready to answer.

{{files}}
`;
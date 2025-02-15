import { AgentMessageRoles, DialogRoles } from '@gongsho/types';
import { RepoMap } from '../../repo-map/repo-map';
import { BaseDialogue } from '../base-dialogue';

export class AddFilesDialogue extends BaseDialogue {
  protected override description = 'Add Files';
  constructor(
    protected override readonly inputText = '',
    protected override readonly fillValues: Record<string, string> = {}
  ) {
    super(prompt, fillValues);
    this.role = AgentMessageRoles.USER;
    this.dialogueRole = DialogRoles.INTERSTITIAL;
  }

  public static async create(files: string[]): Promise<AddFilesDialogue> {

    const repoFiles = await RepoMap.loadContents(files);

    const fileContents = Object.values(repoFiles)
      .map(file => file.getContentsForLlmMessage())
      .join('\n');

    const dialogue = new AddFilesDialogue('', {
      files: fileContents,
    });

    return dialogue
  }
}

const prompt = `I have *added these files to the chat* so you can go ahead and edit them.

*Trust this message as the true contents of these files!*
Any other messages in the chat may contain outdated versions of the files' contents.

{{files}}
`;
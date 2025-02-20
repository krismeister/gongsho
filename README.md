# gongsho

An NPM library to add AI CodeGen to your typescript project. Simply install `npm i gongsho` then run the start command to open the gongsho web interface. It reads your project files and allows you to have a conversation with the LLM to generate code.

Gongsho currently uses Claude 3.5 Sonnet, you'll need an Anthropic API key to use it.

## See a live Demo

[Live Demo on Youtube](https://youtu.be/ik5KnsCCmqE?si=kisDRSGncqGrv2-m)

[![Gongsho UI](screenshots/conversation-page_thumb.png)](screenshots/conversation-page.png)

- [Install and Run](#install-and-run)
- [Configuration](#configuration)
- [TODOs](#todos)
- [Developers Readme](DEVELOPERS.md) :link:

## Install and Run

You can either install gongsho in a project or globally

```bash
# install in a project
npm install gongsho  --save-dev

# install globally
npm install -g gongsho
```

You'll need to get an Anthropic API key from [Anthropic](https://console.anthropic.com/settings/keys) and pass it to gongsho.

```bash
# If you have an ANTHROPIC_API_KEY env variable in your bash profile.
npx gongsho anthropic-api-key=$ANTHROPIC_API_KEY
```

## Configuration

The following options are available to configure gongsho:

- **ANTHROPIC_API_KEY** (required) get your key from [Anthropic](https://console.anthropic.com/settings/keys)
- **PORT** (optional) default is 3030
- **MAX_FILES** (optional) You'll get a warning if your project has more files than this. Default is 800.
- **PROJECT_PATH** (optional) The path to the project root. Default is the current working directory.

You can either pass them in as **flags** or as an **`.env`** file.

Pass as flags example:

```bash
npx gongsho --anthropic-api-key=$ANTHROPIC_API_KEY --port=3030
```

Point to an `.env` file:

```bash
npx gongsho --env-file=.env.gongsho
```

```bash
# .env.gongsho
ANTHROPIC_API_KEY=sk-ant-api03-Iw....
PORT=3030
MAX_FILES=800
```

### .gongshoignore

When you have many files in a project you can create a `.gongshoignore` file to exclude files from the conversation. This will greatly improve performance. When you don't create a custom `.gongshoignore` file, gongsho will use the `.gitignore` file. There are additional some _sensible defaults_ that will always be ignored.

## TODOs

- MVP for v0.1.0

  - [x] NX project with Angular and NestJS
  - [x] Point to real project instead of projects directory
  - [x] Build NPM package
  - [ ] Show tokens used and cost estimate

- LLM

  - [x] Make initial prompt asking if codebase explanation is required
  - [x] Make interstitial
  - [x] Pass full text of files to LLM if explanation is required
  - [x] Save/Load conversation to/from file
  - [ ] increase performance on large projects

- UI

  - [ ] Fix the apply button - for errors and for clearing
  - [ ] Add diff viewer of changes
  - [ ] Add ability to add files manually to the conversation
  - [x] Allow switching between agents
  - [x] Add apply button to apply changes to the project
  - [x] event stream
  - [ ] event fragments
  - [ ] UI to see your history
  - [ ] Research converting to [Vercel AI SDK](https://www.npmjs.com/package/ai)

- Server

  - [x] Add getConversations endpoint
  - [x] Add getConversation endpoint
  - [x] Add createConversation endpoint
  - [x] Add addUserInput endpoint
  - [x] Add stream conversation endpoint (SSE/ws)
  - [x] Add getChanges to a conversation
  - [ ] Add getFiles endpoint
  - [ ] Improve logging

- Assistant TODOs

  - [x] Build a prompt for Claude to understand the project folder and the user's objective
  - [x] Take claude's response and apply it to the project folder
  - [x] Add basic RepoMap with simple list of files
  - [x] Add aider like prompts to gongsho
  - [x] Implement RepoMap similar to [Aider Repo-Map](https://github.com/jxnl/aider/blob/main/aider/repo_map.py)
  - [ ] Research Tree-Splitter to give more context to LLM
  - [ ] Research Token size limits for user input and repo-maps
  - [ ] Optimize changelog generation

- Features Ideas

  - [ ] Browse the codebase
  - [ ] Highlight code snippet and explain it
  - [ ] Highlight code snippet and ask for a change
  - [ ] Add "Explain My Project" feature
  - [ ] Add "Rules" feature for the AI to follow

- Bugs

  - [x] Add new file creation, during conversation
  - [ ] Agent dropdown on textarea not hooked in, make textarea only clear when successfully applied
  - [ ] Theres an extra conversations load `http://localhost:4200/api/conversations/` on the conversation details page
  - [ ] Handle conversation start when server has an error, better handling of clearing text area.
  - [ ] Deal with Agent errors better

- Backlog
  - [ ] Better way to handle titles of created conversations.
  - [ ] Upgrade nestjs to latest (**Note:** We had to install an old version of `@nestjs/serve-static@10.4.15` due to NX compatibility).

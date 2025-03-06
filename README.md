# gongsho

An NPM library to add AI CodeGen to your typescript project. Simply install `npm i gongsho` then run the start command to open the gongsho web interface. It reads your project files and allows you to have a conversation with the LLM to generate code.

Gongsho uses Claude Sonnet, you'll need an Anthropic API key to use it. Support for additional LLMs is coming soon.

## See a live Demo

[Live Demo on Youtube][youtube-demo]

[![Gongsho UI][ui-image]][youtube-demo]

- [Install and Run](#install-and-run)
- [Configuration](#configuration)
- [CHANGELOG][changelog]
- [TODOs](#todos)
- [Developers Readme][dev-readme]
- [Longer Term Plan][plan]

## Install and Run

You can either install gongsho in a project or globally.

```bash
# make sure you have node 18 or higher
node -v
# make sure > v18

# install in a project
npm install gongsho@latest  --save-dev
```

You'll need to get an [Anthropic API key](https://console.anthropic.com/settings/keys) and pass it to gongsho.

```bash
# If you have an ANTHROPIC_API_KEY env variable in your bash profile.
npx gongsho --anthropic-api-key=$ANTHROPIC_API_KEY
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

When you have many files in a project you can create a `.gongshoignore` file to exclude files from the conversation. This will greatly improve performance. When you don't create a custom `.gongshoignore` file, gongsho will use the `.gitignore` file. There are additionally some _sensible defaults_ that will always be ignored.

## TODOs

- MVP for v0.2.0

  - [ ] Show better UI for CHANGELIST
  - [ ] Verify larger project support
  - [ ] Show previous conversations
  - [ ] Auto Scroll to the bottom of the conversation

- LLM

  - [ ] Make initial prompt asking if codebase explanation is required
  - [x] Make interstitial
  - [x] Pass full text of files to LLM if explanation is required
  - [x] Save/Load conversation to/from file
  - [ ] increase performance on large projects
  - [ ] refine prompts with examples from [Anthropic Code in NPM][anthropic-code-in-npm]. [Prompts gist][prompts-gist]
  - [ ] Add getFiles tooling
  - [ ] Add getDependencies tooling

- UI

  - [x] Sticky top nav with button "New Conversation",
  - [ ] UI to see your history : "View Conversations"
  - [ ] Fix the apply button - for errors and for clearing
  - [ ] Add diff viewer of changes
  - [ ] Add ability to add files manually to the conversation
  - [x] Allow switching between agents
  - [x] Add apply button to apply changes to the project
  - [x] event stream
  - [x] event fragments for text
  - [ ] event fragments for code blocks

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
  - [x] Implement RepoMap similar to [Aider Repo-Map][aider-repo-map]
  - [x] Optimize changelog generation
  - [ ] Add prompt caching, [Vercel][vercel], [Anthropic][anthropic]
  - [ ] Research Tree-Splitter to give more context to LLM
  - [ ] Research Token size limits for user input and repo-maps
  - [x] convert to [Vercel AI SDK][vercel-ai-sdk]
  - [ ] Research [LangGraph][langgraph] multi-agent workflows
  - [ ] Deal with finishReason better

- Features Ideas

  - [ ] Browse the codebase
  - [ ] Highlight code snippet and explain it
  - [ ] Highlight code snippet and ask for a change
  - [ ] Add "Explain My Project" feature
  - [ ] Add "Rules" feature for the AI to follow
  - [ ] Facilitate update with UI notification to update gongsho [Gongsho Update Feed][gongsho-update-feed] + [Compare Versions][compare-versions]

- Bugs

  - [x] Add new file creation, during conversation
  - [x] Agent dropdown on textarea not hooked in, make textarea only clear when successfully applied
  - [ ] Theres an extra conversations load `http://localhost:4200/api/conversations/` on the conversation details page
  - [ ] Deal with Agent errors better
  - [x] When the LLM Agent gives an error, the UI has already cleared the text area too early.
  - [ ] Fix the error on SSE completion from our SSE dependency: [ngx-sse-client][ngx-sse-client]

- Backlog
  - [ ] Better way to handle titles of created conversations.
  - [ ] Upgrade nestjs to latest (**Note:** We had to install an old version of `@nestjs/serve-static@10.4.15` due to NX compatibility).

[youtube-demo]: https://youtu.be/ik5KnsCCmqE?si=kisDRSGncqGrv2-m
[ui-image]: docs/conversation-page_thumb.png
[changelog]: CHANGELOG.md
[dev-readme]: docs/DEVELOPERS.md
[plan]: docs/PLAN.md
[anthropic-code-in-npm]: https://www.npmjs.com/package/@anthropic-ai/claude-code
[prompts-gist]: https://gist.github.com/vincentschroeder/b64fb2705b8442e189b944275198d1f8
[aider-repo-map]: https://github.com/jxnl/aider/blob/main/aider/repo_map.py
[vercel]: https://sdk.vercel.ai/providers/ai-sdk-providers/anthropic#cache-control
[anthropic]: https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching
[vercel-ai-sdk]: https://www.npmjs.com/package/ai
[langgraph]: https://github.com/langchain-ai/langgraph
[gongsho-update-feed]: https://registry.npmjs.org/-/package/gongsho/dist-tags
[compare-versions]: https://www.npmjs.com/package/compare-versions
[ngx-sse-client]: https://github.com/marcospds/ngx-sse-client/issues/6

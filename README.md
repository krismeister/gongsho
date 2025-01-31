# gongsho

Generates code with Claude and commits to git

## Setup

1. Clone the repo
2. Run `npm install`
3. Copy the config example file and update it`cp config/env_config.example.json config/env_config.json`
4. Run `npm run start`

## TODOs

### General TODOs

- [x] Build AST structure from project folder
- [x] Read env variables for claude api key, github token, etc.
- [ ] Add a web interface to run gongsho
- [ ] Add docs on configuration
- [ ] Add support for multple LLMs

### MVP

- [ ] MVP Todos
  - [ ] NX project with Angular and NestJS
  - [ ] Point to real project instead of projects directory

- [ ] LLM
  - [x] Make initial prompt asking if codebase explenation is required
  - [x] Make interstitial
  - [x] Pass full text of files to LLM if explenation is required
  - [x] Save/Load convdersation to/from file

- [ ] UI
  - [ ] Markdown Stream
  - [ ] UI to see your history

- [ ] Server
  - [ ] Add getConversations tRPC endpoint
  - [ ] Add getConversation tRPC endpoint
  - [ ] Add createConversation tRPC endpoint
  - [ ] Add addUserInput tRPC endpoint

### Assistant TODOs

- [x] Build a prompt for Claude to understand the project folder and the user's objective
- [x] Take claude's response and apply it to the project folder
- [x] Add basic RepoMap with simple list of files
- [x] Add aider like prompts to gongsho
- [x] Impliment RepoMap similar to [Aider Repo-Map](https://github.com/jxnl/aider/blob/main/aider/repo_map.py)
- [ ] Research Tree-Splitter to give more context to LLM
- [ ] Research Token size limits for user input and repo-maps

## Features Ideas

- [ ] Browse the codebase
- [ ] Highlight code snippet and explain it
- [ ] Highlight code snippet and ask for a change
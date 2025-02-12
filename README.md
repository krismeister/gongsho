# gongsho

Simple NPM library to generate code with LLMs. Use NPM install, then run the start command to open the gongsho web interface.

[![Gongsho Conversation Page](conversation-page.png | height=300)](conversation-page.png)

This product is still in early development. But you can try it out running in development mode.

Copy the `.env` file.

```
cp .env.example .env
```

Add an anthropic api key to the `.env` file.

Start the API and UI:

```
npm run start:api
npm run start:ui
```

Open the web interface at `http://localhost:4200`

## TODOs

### General TODOs

- [x] Build AST structure from project folder
- [x] Read env variables for claude api key, github token, etc.
- [x] Add a web interface to run gongsho
- [ ] Add docs on configuration
- [ ] Add support for multple LLMs

### MVP

- [ ] MVP Todos

  - [x] NX project with Angular and NestJS
  - [ ] Point to real project instead of projects directory

- [ ] LLM

  - [x] Make initial prompt asking if codebase explenation is required
  - [x] Make interstitial
  - [x] Pass full text of files to LLM if explenation is required
  - [x] Save/Load convdersation to/from file

- [ ] UI

  - [ ] Add diff viewer of changes
  - [ ] Add abilty to add files manually to the conversation
  - [ ] Add apply button to apply changes to the project
  - [ ] Markdown Stream
  - [ ] UI to see your history

- [ ] Server
  - [x] Add getConversations endpoint
  - [x] Add getConversation endpoint
  - [x] Add createConversation endpoint
  - [x] Add addUserInput endpoint
  - [x] Add stream conversation endpoint (SSE/ws)
  - [ ] Add getChanges to a conversation
  - [ ] Add getFiles endopint

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

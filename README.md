# gongsho
Generates code with Claude and commits to git

# Setup
1. Clone the repo
2. Run `npm install`
3. Copy the config example file and update it`cp config/env_config.example.json config/env_config.json`
4. Run `npm run start`

# Project Structure
- src/ - gongsho code
- project/ - an example project to test gongsho
   - simple.ts - an example file to test gongsho

# TODOs
## General TODOs
   - [x] Build AST structure from project folder
   - [x] Read env variables for claude api key, github token, etc.
   - [ ] Add a web interface to run gongsho

## Claude TODOs
   - [x] Build a prompt for Claude to understand the project folder and the user's objective
   - [x] Take claude's response and apply it to the project folder
   - [ ] Impliment RepoMap with Tree-Splitter similar to [Aider Repo-Map](https://github.com/jxnl/aider/blob/main/aider/repo_map.py)
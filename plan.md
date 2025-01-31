# The plan for Gongsho

## Good reading

- [Benchmark from Aider on Search/Replace vs diff](https://aider.chat/docs/benchmarks.html)
- [aider repo-map](https://github.com/jxnl/aider/blob/main/aider/repo_map.py)
- [Anthropic Claud Tool/Function calling](https://docs.anthropic.com/en/docs/tools/tool-calling)
- [OpenAI function calling](https://platform.openai.com/docs/guides/function-calling)

## Large plan as written by Claude

Building an AI platform that can read a codebase, understand a user-given objective, and create a pull request using Claude is an ambitious project. Here's a high-level plan to approach this:

1. System Architecture:

   - Backend: Python with FastAPI or Flask or Node
   - Frontend: React
   - Database: SqlLite
   - Version Control Integration: GitHub API
   - AI Integration: Claude API

2. Codebase Analysis:

   - Implement a code parser to read and understand different programming languages
   - Use abstract syntax trees (ASTs) to represent the code structure
   - Develop a module to extract relevant information from the codebase

3. User Interface:

   - Create a web interface for users to input their objectives
   - Implement a dashboard to show the progress and results

4. Claude Integration:

   - Set up API communication with Claude
   - Develop prompts to effectively communicate the codebase structure and user objectives to Claude
   - Implement a mechanism to process Claude's responses

5. Pull Request Generation:

   - Develop a module to translate Claude's suggestions into actual code changes
   - Implement a diff generator to create the changes
   - Use the GitHub API to create and submit pull requests

6. Version Control Integration:

   - Implement GitHub OAuth for user authentication
   - Use GitHub API to clone repositories, create branches, and submit pull requests

7. Testing and Quality Assurance:

   - Implement unit tests for each module
   - Develop integration tests to ensure all components work together
   - Perform security audits to protect user data and code

8. Deployment and Scaling:

   - Set up CI/CD pipelines for automated testing and deployment
   - Use containerization (Docker) for easy deployment and scaling
   - Implement load balancing and caching for better performance

9. User Feedback and Iteration:

   - Implement a feedback system for users to rate the generated pull requests
   - Use this feedback to improve the system's performance over time

10. Documentation and Support:
    - Create comprehensive documentation for users and developers
    - Set up a support system for user inquiries and issue resolution

Implementation Steps:

1. Set up the development environment and project structure
2. Implement the codebase analysis module
3. Develop the user interface for objective input
4. Integrate with Claude API and develop the prompt engineering system
5. Create the pull request generation module
6. Implement GitHub API integration for version control
7. Develop testing suites and perform quality assurance
8. Set up deployment infrastructure
9. Implement user feedback systems
10. Create documentation and support structures

This plan provides a roadmap for building your AI platform. Each step will require significant development effort and may need to be broken down into smaller, manageable tasks. Remember to iterate and refine the system based on user feedback and performance metrics.

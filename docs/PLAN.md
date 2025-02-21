# The plan for Gongsho

- [Good Reading](#good-reading)
- [Tooling For Optimizing the LLM](#tooling-for-optimizing-the-llm)
- [Larger plan as written by Claude](#larger-plan-as-written-by-claude)

## Good reading

- [Benchmark from Aider on Search/Replace vs diff](https://aider.chat/docs/benchmarks.html)
- [aider repo-map](https://github.com/jxnl/aider/blob/main/aider/repo_map.py)
- [Anthropic Claud Tool/Function calling](https://docs.anthropic.com/en/docs/tools/tool-calling)
- [OpenAI function calling](https://platform.openai.com/docs/guides/function-calling)

## Tooling For Optimizing the LLM

Key Functions to Expose

### getFileDependencies(filePath)

**Purpose:** Identify other files that a specific file depends on. This can help in understanding the context and impact of changes in the file.  
**Implementation:** Analyze import/require statements or similar constructs relevant to the programming language you're working with.

### getAST(nodeId)

**Purpose:** Retrieve the Abstract Syntax Tree for a particular node or file. The LLM can use it for structural code understanding.  
**Implementation:** Use a parser to convert source code into an AST representation, potentially employing language-specific libraries.

### getFunctionSignature(functionName)

**Purpose:** Return the signature of a function, including parameter types and return type. This provides concise information on how to call a function.  
**Implementation:** Perform static code analysis to extract signature details from code comments or type annotations.

### searchCodebase(query)

**Purpose:** Allow the LLM to search the codebase for specific terms or patterns, aiding in tasks like refactoring or feature implementation.  
**Implementation:** Leverage an indexing library or search engine like Elasticsearch to build a searchable index of the codebase.

### getFileVersionHistory(filePath)

**Purpose:** Provide version history or changes for a file, which can assist in understanding the evolution of the codebase.  
**Implementation:** Integrate with version control systems like Git to access commit history and diffs.

### getCodeContext(filePath, lineNumber)

**Purpose:** Fetch surrounding code for a particular line number to give context to the LLM for more accurate generation around specific sections.  
**Implementation:** Utilize file operations to retrieve lines of interest with a specified range of code.

### listAllFiles()

**Purpose:** Enumerate all files in the project, which is useful for comprehensive changes or analyses.  
**Implementation:** Directory traversal to list files, filtered by relevant file extensions.

These exposed functions will not only optimize the interaction with the LLM but also provide richer, more structured, and relevant inputs that can considerably enhance the speed and accuracy of the generated responses or actions.

## Larger plan as written by Claude

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

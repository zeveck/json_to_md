---
inclusion: always
---

# Git and GitHub Guidelines

## Version Control Rules

- **Never push to GitHub** without explicit user approval
- **Never stage or commit changes** without explicit user permission
- Always ask before performing any git operations (add, commit, push, pull, merge)
- When suggesting git commands, present them for user review rather than executing automatically

## Code Style and Architecture

### JavaScript Conventions
- Use CommonJS modules (`require`/`module.exports`) to maintain consistency with existing codebase
- Follow Node.js best practices for CLI tools
- Use descriptive variable names and clear function structure
- Include proper error handling with meaningful error messages

### File Organization
- Keep conversion logic modular and reusable
- Maintain separation between CLI tools and core conversion functions
- Use consistent naming patterns for output files (remove `.conversation` from JSON extensions)

### Documentation Standards
- Update README.md when adding new features or changing functionality
- Include usage examples and clear instructions
- Document any new command-line options or parameters
- Maintain consistent markdown formatting in generated output

## Project-Specific Guidelines

### Conversation Processing
- Preserve original conversation structure and metadata
- Handle both single-step and multi-step assistant responses
- Format thinking blocks as quoted text with italicized titles
- Maintain code block formatting from original conversations
- Include creation date and token count in output metadata

### Error Handling
- Provide clear, actionable error messages
- Gracefully handle malformed JSON files
- Validate file existence before processing
- Exit with appropriate status codes for CLI tools
module.exports = {
  types: [
    { value: 'feat', name: 'feat:     New functionality' },
    { value: 'fix', name: 'fix:      Bug fix' },
    { value: 'docs', name: 'docs:     Documentation update' },
    { value: 'style', name: 'style:    Changes that do not affect functionality (e.g., formatting)' },
    { value: 'refactor', name: 'refactor: Code refactoring' },
    { value: 'perf', name: 'perf:     Performance improvements' },
    { value: 'test', name: 'test:     Add tests' },
    { value: 'chore', name: 'chore:    Other changes' }
  ],
  messages: {
    type: "Select the type of changes you want to commit:",
    scope: "\nSpecify the scope of the changes (e.g., component or file):",
    subject: "Short description of the changes:\n",
    body: "Detailed description of the changes (optional):\n",
    breaking: "List of breaking changes (optional):\n",
    footer: "References to issues or bugs (e.g. 'fixes #123'):\n"
  }
};

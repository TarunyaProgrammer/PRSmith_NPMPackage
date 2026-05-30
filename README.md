# PRSmith

Generate professional pull request review comments directly from the terminal.

## Installation

```bash
npm install -g prsmith
```

## Usage

```bash
prsmith
```

## Example

Input:

- Severity: Critical
- Title: Scope Issue
- Issue: Utility functions are nested incorrectly.
- Suggested Fix: Move them to module scope.

Output:

```md
### Critical: Scope Issue

The current implementation introduces a critical issue.

**Problem**

Utility functions are nested incorrectly.

**Suggested Fix**

Move them to module scope.
```

## Development

```bash
npm install

npm start
```

---

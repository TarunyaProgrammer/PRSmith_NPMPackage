<div align="center">
  <h1>PRSmith</h1>
  
  [![npm version](https://img.shields.io/npm/v/prsmith.svg?style=flat-square)](https://www.npmjs.com/package/prsmith)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
  [![CI](https://img.shields.io/github/actions/workflow/status/TarunyaProgrammer/PRSmith_NPMPackage/ci.yml?branch=main&style=flat-square)](https://github.com/TarunyaProgrammer/PRSmith_NPMPackage/actions)

  <p><b>Forge professional pull request review comments directly from the terminal.</b></p>
</div>

---

PRSmith streamlines the process of writing code reviews by providing an interactive prompt that generates consistently formatted, polite, and actionable Markdown comments.

## Architecture Flow

The tool operates via a straightforward interactive flow, generating structured markdown from your inputs.

```text
 ┌──────────────────────────┐
 │  Run `prsmith` Command   │
 └────────────┬─────────────┘
              ▼
 ┌──────────────────────────┐
 │   Interactive Prompts    │
 │ (Severity, Title, Issue) │
 └────────────┬─────────────┘
              ▼
 ┌──────────────────────────┐
 │   Markdown Generation    │
 └────────────┬─────────────┘
              ▼
 ┌──────────────────────────┐
 │ Print Formatted Comment  │
 └──────────────────────────┘
```

---

## Installation

Install globally to use it anywhere on your machine.

```bash
npm install -g prsmith
```

## Features

- **Interactive Prompts:** No need to memorize complex flags. Just run the tool and answer the prompts.
- **Smart Formatting:** Automatically generates perfectly structured Markdown.
- **Graceful Exits:** Hit `Ctrl+C` anytime to exit safely without stack traces.
- **Built-in Help:** Run `prsmith --help` to view documentation directly in your terminal.

## Usage

### Standard Mode
The primary way to use PRSmith is via its interactive mode. Simply run:

```bash
prsmith
```
This will launch the interactive prompt asking for Severity, Title, Issue, and Fix.

### Commands & Flags

| Command | Description |
| :--- | :--- |
| `prsmith` | Launch the interactive generator |
| `prsmith -h`, `--help` | Display the help menu and commands |
| `prsmith -v`, `--version` | Print the current installed version |

<details>
<summary><b>Click to view an Example Interaction</b></summary>

<br/>

**Input Data:**

| Field | Input |
| :--- | :--- |
| **Severity** | `<kbd>Critical</kbd>` |
| **Title** | `Scope Issue` |
| **Issue** | `Utility functions are nested incorrectly.` |
| **Suggested Fix** | `Move them to module scope.` |

**Output Markdown:**

```md
### Critical: Scope Issue

The current implementation introduces a critical issue.

**Problem**

Utility functions are nested incorrectly.

**Suggested Fix**

Move them to module scope.
```

</details>

---

## Development & Contribution

<details>
<summary><b>Local Setup Guide</b></summary>

<br/>

To set up the project locally:

```bash
# Install dependencies
npm install

# Run the CLI locally
npm start

# Run unit tests
npm test

# Lint the codebase
npm run lint

# Format the code
npm run format
```
</details>

## License

This project is licensed under the MIT License.

---

<div align="center">
  <h3>Built with 💻 by Tarunya Kesharwani</h3>
  
  <p>
    <i>"I build things. Usually web apps, sometimes automation scripts that save me from doing something tedious twice."</i>
  </p>
  
  <p>
    I'm a Full-Stack Engineer and Open Source fanatic (GSoC'26 @ C2SI, Mentor @ GSSoC & SSoC). I obsess over frontend architecture that doesn't collapse under its own weight, seamless developer experiences, and building UI that feels intentional. When I'm not writing TypeScript, I'm probably deep in a rabbit hole about AI, startup strategy, or restructuring a folder hierarchy for the third time. 
  </p>

  <p>
    <a href="https://www.github.com/tarunyaprogrammer"><b>GitHub</b></a> &nbsp;&bull;&nbsp;
    <a href="https://www.linkedin.com/in/tarunyakesharwani/"><b>LinkedIn</b></a>
  </p>
</div>

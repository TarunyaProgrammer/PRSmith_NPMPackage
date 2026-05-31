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

## ✨ Advanced Features (v1.1.0)

- **Interactive Editor Prompts:** For multi-line issues, PRSmith temporarily opens your system's default `$EDITOR` (like VS Code or Vim) so you can type formatted text seamlessly.
- **Auto-Clipboard:** No need to manually highlight terminal output! The generated markdown is automatically copied to your clipboard.
- **Bypass Prompts:** Skip the interactive flow completely by using CLI arguments (perfect for scripting).
- **File Output:** Directly write the output to a `.md` file using the `--out` flag.
- **Custom Templates:** Create a `.prsmith.json` file in your project or home directory to define your own severity levels and custom intro messages.

## 💻 Usage

### Interactive Mode
The primary way to use PRSmith is via its interactive mode. Simply run:

```bash
prsmith
```
This will launch the interactive prompt. When asked to describe the issue or fix, your default terminal editor will launch, allowing you to write multi-line markdown!

### Non-Interactive Flags

You can bypass the prompts entirely:

```bash
prsmith -s Critical -t "Memory Leak" -i "Connection left open." -f "Add a finally block." -o review.md
```

| Flag | Full | Description |
| :--- | :--- | :--- |
| `-s` | `--severity` | Severity level (e.g., Critical, Minor) |
| `-t` | `--title` | The review title |
| `-i` | `--issue` | Description of the problem |
| `-f` | `--fix` | Suggested solution |
| `-o` | `--out` | Save generated markdown to a specific file |

### Configuration (`.prsmith.json`)

You can define custom templates by creating a `.prsmith.json` in your home directory (`~/`) or current working directory:

```json
{
  "templates": {
    "Nitpick": "This is just a tiny nitpick, no pressure to fix.",
    "Security": "CRITICAL SECURITY VULNERABILITY DETECTED."
  }
}
```
If you pass `-s Nitpick` (or select it in the CLI), PRSmith will automatically use your custom text!

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

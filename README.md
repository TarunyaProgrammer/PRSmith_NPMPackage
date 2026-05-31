<div align="center">
  <h1>PRSmith</h1>
  
  [![npm version](https://img.shields.io/npm/v/prsmith.svg?style=flat-square)](https://www.npmjs.com/package/prsmith)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
  [![CI](https://img.shields.io/github/actions/workflow/status/TarunyaProgrammer/PRSmith_NPMPackage/ci.yml?branch=main&style=flat-square)](https://github.com/TarunyaProgrammer/PRSmith_NPMPackage/actions)

  <p><b>Forge professional pull request review comments and submit integrated reviews directly from the terminal.</b></p>
</div>

---

PRSmith streamlines the process of writing code reviews by providing an interactive prompt that generates consistently formatted, polite, and actionable Markdown comments. With **v2.0.0**, PRSmith evolves into an **intelligent, automated, production-grade Code Review suite** featuring AI-powered tone polishing, direct GitHub integrations, file context, and batch review loops.

## Architecture Flow

The tool operates via a straightforward interactive flow, generating structured markdown from your inputs and supporting remote integrations.

```text
 ┌──────────────────────────┐
 │  Run `prsmith` Command   │
 └────────────┬─────────────┘
              ▼
 ┌──────────────────────────┐
 │   Interactive Prompts    │
 │ (File, Snippets, Issue)  │
 └────────────┬─────────────┘
              ▼
 ┌──────────────────────────┐
 │   AI Polish (Optional)   │
 │ (Gemini, OpenAI, Groq)   │
 └────────────┬─────────────┘
              ▼
 ┌──────────────────────────┐
 │   Markdown Generation    │
 └────────────┬─────────────┘
              ▼
 ┌──────────────────────────┐
 │  Export / Direct Post    │
 │ (GitHub, Clipboard, File)│
 └──────────────────────────┘
```

---

## Installation

Install globally to use it anywhere on your machine.

```bash
npm install -g prsmith
```

---

## ⚡ Key Features (v2.0.0)

PRSmith has been completely overhauled with a set of powerful new features:

1. **🚀 GitHub Integration (PR Comments & Reviews)**:
   - Post your generated review comment directly to a Pull Request as an issue comment, or as a native GitHub code review.
   - **Zero-Config Repo Auto-Detection**: Auto-detects the repository owner and name from your local `.git/config` remotes.
2. **✨ AI "Rude-to-Polite" Polish**:
   - Polishes blunt or harsh descriptions into constructive, professional, and empathetic reviews.
   - Built-in support for **Gemini** (default), **OpenAI**, and **Groq** via lightweight native HTTP requests.
3. **📁 File & Line Number Context**:
   - Link your feedback directly to code files and line ranges (e.g. `src/utils.js:45-50`).
   - If GitHub integration is active, PRSmith generates **clickable GitHub deep links** straight to the code!
4. **🔍 Before/After Code Snippet Comparisons**:
   - Provide original and proposed code blocks. Outputs collapsible `<details>` blocks featuring gorgeous syntax highlighting.
5. **📦 Batch Review Mode (`prsmith batch`)**:
   - Run a single review runner loop to review multiple files or issues in one go.
   - Export all bundled reviews together: copy them, save to a report, or **submit a native multi-comment review on GitHub** in a single click!

---

## 💻 Usage

### 1. Fully Interactive Mode

The simplest way to use PRSmith:

```bash
prsmith
```

This starts the wizard, prompting you for:

- Severity level & Title
- Problem description & Suggested fix (opens your system's default `$EDITOR` like VS Code, Vim, or Nano for comfortable multi-line editing)
- Optional File & Line context
- Optional Before & After code snippets
- Optional AI Polish toggle

### 2. Interactive Batch Mode (New)

Review multiple issues in a single terminal session and compile them into a unified report:

```bash
prsmith batch
```

At the end of the batch review, an interactive menu allows you to copy the unified report, save it to a file, or **submit all comments at once as native inline review threads** on a GitHub PR.

### 3. Non-Interactive CLI Flags

Bypass the prompts entirely for fast operations or CI/CD pipelines:

```bash
prsmith -s Critical -t "Resource Leak" -i "The connection is never closed." -f "Add a finally block." -p "src/db.js" -l "12-15" --ai --github --pr 42
```

| Flag       | Full         | Description                                                        |
| :--------- | :----------- | :----------------------------------------------------------------- |
| `-s`       | `--severity` | Severity level (e.g., Critical, Suggestion)                        |
| `-t`       | `--title`    | The review title                                                   |
| `-i`       | `--issue`    | Description of the problem                                         |
| `-f`       | `--fix`      | Suggested solution                                                 |
| `-o`       | `--out`      | Save generated markdown to a specific file                         |
| `-p`       | `--path`     | File path context of code under review                             |
| `-l`       | `--line`     | Line number or range (e.g. `12` or `45-50`)                        |
| `--lang`   | `--lang`     | Programming language for code highlighting (default: `javascript`) |
| `--before` | `--before`   | Original code snippet (Before)                                     |
| `--after`  | `--after`    | Proposed code snippet (After)                                      |
| `--ai`     | `--ai`       | Toggle AI-assisted polishing for constructive tone                 |
| `--github` | `--github`   | Post comments directly to GitHub                                   |
| `--pr`     | `--pr`       | The GitHub Pull Request number                                     |
| `--repo`   | `--repo`     | GitHub repository in `owner/repo` format                           |

---

## 🛠️ Configuration (`.prsmith.json`)

To enable AI polishing and GitHub integration, create a `.prsmith.json` file in your home directory (`~/`) or current project working directory:

```json
{
  "githubToken": "ghp_yourGitHubPersonalAccessToken",
  "aiProvider": "gemini",
  "aiApiKey": "AI_PROVIDER_API_KEY",
  "aiModel": "gemini-1.5-flash",
  "defaultBranch": "main",
  "templates": {
    "Nitpick": "This is just a tiny nitpick, no pressure to fix.",
    "Security": "CRITICAL SECURITY VULNERABILITY DETECTED."
  }
}
```

### AI Configuration Mappings:

- **`aiProvider`**: `gemini` (default), `openai`, or `groq`.
- **`aiModel`**:
  - Gemini default: `gemini-1.5-flash`
  - OpenAI default: `gpt-4o-mini`
  - Groq default: `llama-3.3-70b-versatile`
- Credentials can also be supplied via **Environment Variables**:
  - `GITHUB_TOKEN`
  - `GEMINI_API_KEY`
  - `OPENAI_API_KEY`
  - `GROQ_API_KEY`

---

<details>
<summary><b>Click to view an Example Markdown Output</b></summary>

<br/>

### Suggestion: Optimized Loop

The implementation works, but there may be a cleaner approach.

📁 **File:** [`src/utils/math.js:15-20`](https://github.com/tarunyaprogrammer/PRSmith/blob/main/src/utils/math.js#L15)

**Problem**

The current `forEach` iteration is performing multiple lookups on a large array, which has a noticeable performance overhead in hot paths.

**Suggested Fix**

We can optimize this by storing the length in a local variable and utilizing a standard `for-i` loop.

<details>
<summary>🔍 View Code Diff / Comparison</summary>

**Before:**

```javascript
items.forEach((item) => {
  doCalculation(item);
});
```

**After:**

```javascript
const len = items.length;
for (let i = 0; i < len; i++) {
  doCalculation(items[i]);
}
```

</details>

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

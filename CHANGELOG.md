# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-06-01

### Added

- **GitHub Integration**: Direct comment posting to PRs and full integrated Review Submission support, featuring auto-detection of repository details from local Git configs.
- **AI "Rude-to-Polite" Polish**: A unified client supporting Gemini, OpenAI, and Groq over lightweight native HTTP requests, translating harsh or blunt feedback into constructive and polite reviews.
- **Interactive Batch Review Mode (`prsmith batch`)**: Loop through multiple issues in a single terminal session, compile them into a unified report, and optionally post them as separate native inline review comments on GitHub.
- **File & Line Context**: Link your comments directly to code files and line numbers, generating clickable GitHub deep links when repo details are available.
- **Before & After Code Snippets**: Show differences between original and proposed code structures in collapsible `<details>` blocks with syntax highlighting.

## [1.1.0] - 2026-06-01

### Added

- **Clipboard Integration**: Automatically copies the generated markdown to your clipboard (`clipboardy`).
- **Editor Prompts**: The `issue` and `fix` interactive prompts now intelligently launch your default system `$EDITOR` (e.g. VS Code, vim) for a seamless multi-line typing experience.
- **CLI Arguments**: You can completely bypass the interactive mode by supplying flags: `-s`, `-t`, `-i`, `-f`.
- **File Output**: Use the `-o` or `--out` flag to directly write the markdown to a file (e.g. `prsmith --out comment.md`).
- **Update Notifier**: The CLI now checks for updates in the background and notifies you if a newer version is available on NPM.
- **Custom Configs**: Support for `.prsmith.json` files in your home directory (`~/`) or project directory. Define your own custom severities and intro templates!

## [1.0.2] - 2026-05-31

### Added

- Integrated `commander` to provide robust native support for CLI flags (`-h`, `--help`, `-v`, `--version`).
- Graceful termination handling: Intercepting `ExitPromptError` to display a friendly message when users abort the interactive prompt (e.g., via `Ctrl+C`) instead of throwing stack traces.
- Custom author branding and detailed bio added to the README footer.

## [1.0.1] - 2026-05-31

### Fixed

- Re-configured Git Hooks (Husky) to ensure `npm test` and `npm run lint` run reliably on pre-commit.
- Resolved invalid path structures in `package.json` for the executable `bin` field.
- Fixed a bug in `inquirer` by migrating legacy `"list"` prompt types to `"select"` to prevent CLI crashes.

### Changed

- Massively overhauled `README.md` for NPM compatibility: Replaced unsupported Mermaid diagrams with elegant ASCII flowcharts, incorporated GitHub/NPM badges, and structured sections with collapsible `<details>` HTML tags for premium rendering on the NPM website.

## [1.0.0] - 2026-05-31

### Added

- Interactive CLI prompts to generate PR review comments.
- Formatter to generate markdown based on severity, title, issue, and fix.
- Initial setup for linting, testing, and CI.

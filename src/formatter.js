import { templates as defaultTemplates } from './templates.js';
import { detectGithubRepo } from './github.js';

export function generateMarkdown(data, config = {}) {
  const mergedTemplates = { ...defaultTemplates, ...(config.templates || {}) };
  const intro =
    mergedTemplates[data.severity] ||
    'The current implementation requires attention.';

  let markdown = `### ${data.severity}: ${data.title}\n\n${intro}\n\n`;

  // 1. Format File & Line Context
  if (data.path) {
    const repo = config.githubRepo || detectGithubRepo();
    const lineStr = data.line ? `:${data.line}` : '';

    if (repo && repo.owner && repo.repo) {
      const branch = config.defaultBranch || 'main';
      // Generate direct deep link to GitHub
      const lineAnchor = data.line ? `#L${data.line.replace(/-.*/, '')}` : ''; // Take start of line range
      const fileUrl = `https://github.com/${repo.owner}/${repo.repo}/blob/${branch}/${data.path}${lineAnchor}`;
      markdown += `📁 **File:** [\`${data.path}${lineStr}\`](${fileUrl})\n\n`;
    } else {
      markdown += `📁 **File:** \`${data.path}${lineStr}\`\n\n`;
    }
  }

  // 2. Format Problem/Issue
  markdown += `**Problem**\n\n${data.issue}\n\n`;

  // 3. Format Suggested Fix
  markdown += `**Suggested Fix**\n\n${data.fix}\n\n`;

  // 4. Format Before / After Code Comparison
  if (data.before || data.after) {
    markdown += `<details>\n<summary>🔍 View Code Diff / Comparison</summary>\n\n`;

    const lang = data.lang || 'javascript';

    if (data.before && data.before.trim() !== '') {
      markdown += `**Before:**\n\`\`\`${lang}\n${data.before.trim()}\n\`\`\`\n\n`;
    }

    if (data.after && data.after.trim() !== '') {
      markdown += `**After:**\n\`\`\`${lang}\n${data.after.trim()}\n\`\`\`\n\n`;
    }

    markdown += `</details>\n`;
  }

  return markdown;
}

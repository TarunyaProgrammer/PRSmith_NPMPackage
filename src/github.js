import fs from 'fs';
import path from 'path';

/**
 * Attempts to automatically detect the GitHub owner and repository name
 * from the local .git/config file.
 *
 * @returns {{ owner: string, repo: string } | null} The detected repository or null
 */
export function detectGithubRepo() {
  try {
    const gitConfigPath = path.join(process.cwd(), '.git', 'config');
    if (!fs.existsSync(gitConfigPath)) {
      return null;
    }

    const content = fs.readFileSync(gitConfigPath, 'utf8');
    // Use RegExp constructor to avoid escaping forward slashes which triggers ESLint warnings
    const regex = new RegExp(
      'url\\s*=\\s*(?:https://github\\.com/|git@github\\.com:)([^/\\s]+)/([^./\\s]+)(?:\\.git)?',
      'i'
    );
    const match = content.match(regex);

    if (match) {
      return {
        owner: match[1].trim(),
        repo: match[2].trim(),
      };
    }
  } catch {
    // Fail silently, return null
  }
  return null;
}

/**
 * Posts a markdown comment directly to a GitHub Pull Request discussion thread.
 *
 * @param {string} owner The repo owner
 * @param {string} repo The repo name
 * @param {number|string} prNumber The pull request number
 * @param {string} markdown The markdown body to post
 * @param {object} config Local configurations for tokens
 * @returns {Promise<string>} The API response comment URL on success
 */
export async function postPRComment(
  owner,
  repo,
  prNumber,
  markdown,
  config = {}
) {
  const token = config.githubToken || process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error(
      "GitHub Personal Access Token not found. Set 'githubToken' in .prsmith.json or the GITHUB_TOKEN environment variable."
    );
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'PRSmith-CLI',
    },
    body: JSON.stringify({ body: markdown }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub API error: ${response.statusText} (${errorText})`);
  }

  const data = await response.json();
  return data.html_url;
}

/**
 * Submits a native GitHub PR Review session containing multiple inline and/or general comments.
 *
 * @param {string} owner The repo owner
 * @param {string} repo The repo name
 * @param {number|string} prNumber The pull request number
 * @param {string} body The main review description/summary
 * @param {Array<{path: string, line: number, body: string}>} comments Inline comments list
 * @param {object} config Local configurations for tokens
 * @returns {Promise<string>} The API response review URL or confirmation message
 */
export async function submitPRReview(
  owner,
  repo,
  prNumber,
  body,
  comments = [],
  config = {}
) {
  const token = config.githubToken || process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error(
      "GitHub Personal Access Token not found. Set 'githubToken' in .prsmith.json or the GITHUB_TOKEN environment variable."
    );
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/reviews`;

  // Format individual inline comments for the reviews API
  // Filter out any comments that lack file path/line
  const apiComments = comments
    .filter((c) => c.path && c.line)
    .map((c) => ({
      path: c.path,
      line: parseInt(c.line, 10),
      body: c.body,
      side: 'RIGHT', // Reviewing the changes in the incoming PR
    }));

  const payload = {
    body: body,
    event: 'COMMENT',
  };

  if (apiComments.length > 0) {
    payload.comments = apiComments;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'PRSmith-CLI',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub API error: ${response.statusText} (${errorText})`);
  }

  const data = await response.json();
  return (
    data.html_url || `https://github.com/${owner}/${repo}/pull/${prNumber}`
  );
}

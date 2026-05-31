import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import { generateMarkdown } from '../src/formatter.js';
import { detectGithubRepo } from '../src/github.js';
import { polishText } from '../src/ai.js';

describe('v2.0.0 Features Test Suite', () => {
  let existsSyncSpy;
  let readFileSyncSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    // Spy on fs methods
    existsSyncSpy = vi.spyOn(fs, 'existsSync');
    readFileSyncSpy = vi.spyOn(fs, 'readFileSync');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('File & Line Context Deep Links', () => {
    it('should generate standard file path text if no githubRepo is detected', () => {
      const data = {
        severity: 'Suggestion',
        title: 'Optimized Loop',
        issue: 'Loop could be faster.',
        fix: 'Use for-i loop.',
        path: 'src/utils/math.js',
        line: '15-20',
      };

      existsSyncSpy.mockReturnValue(false);

      const markdown = generateMarkdown(data);
      expect(markdown).toContain('📁 **File:** `src/utils/math.js:15-20`');
    });

    it('should generate a clickable GitHub deep link if githubRepo is provided', () => {
      const data = {
        severity: 'Suggestion',
        title: 'Optimized Loop',
        issue: 'Loop could be faster.',
        fix: 'Use for-i loop.',
        path: 'src/utils/math.js',
        line: '15-20',
      };

      const config = {
        githubRepo: { owner: 'tarunyaprogrammer', repo: 'PRSmith' },
        defaultBranch: 'main',
      };

      const markdown = generateMarkdown(data, config);
      expect(markdown).toContain(
        '📁 **File:** [`src/utils/math.js:15-20`](https://github.com/tarunyaprogrammer/PRSmith/blob/main/src/utils/math.js#L15)'
      );
    });
  });

  describe('Before / After Code Snippet Formatting', () => {
    it('should render collapsible before and after code blocks beautifully', () => {
      const data = {
        severity: 'Minor',
        title: 'Use Strict Equality',
        issue: 'Loose equality can lead to bugs.',
        fix: 'Use strict equality instead.',
        lang: 'typescript',
        before: 'if (x == y) { return; }',
        after: 'if (x === y) { return; }',
      };

      const markdown = generateMarkdown(data);
      expect(markdown).toContain('<details>');
      expect(markdown).toContain(
        '<summary>🔍 View Code Diff / Comparison</summary>'
      );
      expect(markdown).toContain(
        '**Before:**\n```typescript\nif (x == y) { return; }\n```'
      );
      expect(markdown).toContain(
        '**After:**\n```typescript\nif (x === y) { return; }\n```'
      );
      expect(markdown).toContain('</details>');
    });
  });

  describe('Git Config Parsing (detectGithubRepo)', () => {
    it('should correctly parse HTTPS git urls from config file', () => {
      existsSyncSpy.mockReturnValue(true);
      readFileSyncSpy.mockReturnValue(`
[core]
	repositoryformatversion = 0
	filemode = true
[remote "origin"]
	url = https://github.com/tarunyaprogrammer/PRSmith.git
	fetch = +refs/heads/*:refs/remotes/origin/*
      `);

      const repo = detectGithubRepo();
      expect(repo).toEqual({ owner: 'tarunyaprogrammer', repo: 'PRSmith' });
    });

    it('should correctly parse SSH git urls from config file', () => {
      existsSyncSpy.mockReturnValue(true);
      readFileSyncSpy.mockReturnValue(`
[remote "origin"]
	url = git@github.com:google/antigravity.git
      `);

      const repo = detectGithubRepo();
      expect(repo).toEqual({ owner: 'google', repo: 'antigravity' });
    });
  });

  describe('AI Polish (polishText) HTTP mock', () => {
    beforeEach(() => {
      global.fetch = vi.fn();
    });

    it('should fallback to original text if no key is provided', async () => {
      const originalText = 'This is a harsh comment!';
      const polished = await polishText(
        originalText,
        'Problem Description',
        {}
      );
      expect(polished).toBe(originalText);
    });

    it('should invoke Gemini API correctly and return polished content', async () => {
      const originalText = 'Your code is slow.';
      const responseMock = {
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: 'The current implementation has room for performance optimization.',
                  },
                ],
              },
            },
          ],
        }),
      };
      global.fetch.mockResolvedValue(responseMock);

      const config = {
        aiProvider: 'gemini',
        aiApiKey: 'mock-key',
      };

      const polished = await polishText(
        originalText,
        'Problem Description',
        config
      );
      expect(polished).toBe(
        'The current implementation has room for performance optimization.'
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('generativelanguage.googleapis.com'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('Your code is slow.'),
        })
      );
    });

    it('should invoke OpenAI API correctly and return polished content', async () => {
      const originalText = 'Close the resource.';
      const responseMock = {
        ok: true,
        json: async () => ({
          choices: [
            {
              message: {
                content:
                  'It is highly recommended to properly release the resource in a finally block.',
              },
            },
          ],
        }),
      };
      global.fetch.mockResolvedValue(responseMock);

      const config = {
        aiProvider: 'openai',
        aiApiKey: 'mock-key-openai',
      };

      const polished = await polishText(originalText, 'Suggested Fix', config);
      expect(polished).toBe(
        'It is highly recommended to properly release the resource in a finally block.'
      );
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-key-openai',
          }),
        })
      );
    });
  });
});

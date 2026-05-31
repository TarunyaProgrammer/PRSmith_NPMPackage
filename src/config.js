import fs from 'fs';
import path from 'path';
import os from 'os';

export function loadConfig() {
  const configPaths = [
    path.join(os.homedir(), '.prsmith.json'),
    path.join(process.cwd(), '.prsmith.json'),
  ];

  let mergedConfig = { templates: {} };

  for (const configPath of configPaths) {
    if (fs.existsSync(configPath)) {
      try {
        const fileContent = fs.readFileSync(configPath, 'utf-8');
        const parsed = JSON.parse(fileContent);

        if (parsed.templates) {
          mergedConfig.templates = {
            ...mergedConfig.templates,
            ...parsed.templates,
          };
        }

        if (parsed.editor) {
          mergedConfig.editor = parsed.editor;
        }

        // Also merge any other config properties (tokens, providers, etc.)
        Object.keys(parsed).forEach((key) => {
          if (key !== 'templates') {
            mergedConfig[key] = parsed[key];
          }
        });
      } catch (err) {
        console.warn(
          `Warning: Could not parse config at ${configPath} - ${err.message}`
        );
      }
    }
  }

  // Senior Guardrail: Prevent the general public from getting stuck in Vim (no instructions)
  // If the user has not set EDITOR/VISUAL globally, and did not set 'editor' in .prsmith.json,
  // we default the spawned editor in our process to 'nano' on macOS/Linux.
  // 'nano' has friendly, visible exit instructions at the bottom of the terminal by default!
  if (mergedConfig.editor) {
    process.env.EDITOR = mergedConfig.editor;
  } else if (!process.env.EDITOR && !process.env.VISUAL) {
    if (process.platform !== 'win32') {
      process.env.EDITOR = 'nano';
    }
  }

  return mergedConfig;
}

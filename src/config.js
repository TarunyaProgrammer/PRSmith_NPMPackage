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
      } catch (err) {
        console.warn(
          `Warning: Could not parse config at ${configPath} - ${err.message}`
        );
      }
    }
  }

  return mergedConfig;
}

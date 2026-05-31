import { templates as defaultTemplates } from "./templates.js";

export function generateMarkdown(data, config = {}) {
  const mergedTemplates = { ...defaultTemplates, ...(config.templates || {}) };
  const intro =
    mergedTemplates[data.severity] ||
    "The current implementation requires attention.";

  return `### ${data.severity}: ${data.title}

${intro}

**Problem**

${data.issue}

**Suggested Fix**

${data.fix}
`;
}

import { templates } from "./templates.js";

export function generateMarkdown(data) {
  const intro =
    templates[data.severity] ||
    "The current implementation requires attention.";

  return `### ${data.severity}: ${data.title}

${intro}

**Problem**

${data.issue}

**Suggested Fix**

${data.fix}
`;
}

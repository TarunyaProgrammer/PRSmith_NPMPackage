import inquirer from "inquirer";

export async function getReviewData(options = {}, config = {}) {
  const defaultSeverities = ["Critical", "Major", "Minor", "Suggestion"];
  let severities = [...defaultSeverities];
  if (config.templates) {
    for (const key of Object.keys(config.templates)) {
      if (!severities.includes(key)) {
        severities.push(key);
      }
    }
  }

  const questions = [];

  if (!options.severity) {
    questions.push({
      type: "select",
      name: "severity",
      message: "Select severity:",
      choices: severities,
    });
  }

  if (!options.title) {
    questions.push({
      type: "input",
      name: "title",
      message: "Review title:",
    });
  }

  if (!options.issue) {
    questions.push({
      type: "editor",
      name: "issue",
      message: "Describe the issue:",
    });
  }

  if (!options.fix) {
    questions.push({
      type: "editor",
      name: "fix",
      message: "Suggested fix:",
    });
  }

  const answers = questions.length > 0 ? await inquirer.prompt(questions) : {};

  return { ...options, ...answers };
}

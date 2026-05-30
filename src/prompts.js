import inquirer from "inquirer";

export async function getReviewData() {
  return inquirer.prompt([
    {
      type: "select",
      name: "severity",
      message: "Select severity:",
      choices: ["Critical", "Major", "Minor", "Suggestion"],
    },
    {
      type: "input",
      name: "title",
      message: "Review title:",
    },
    {
      type: "input",
      name: "issue",
      message: "Describe the issue:",
    },
    {
      type: "input",
      name: "fix",
      message: "Suggested fix:",
    },
  ]);
}

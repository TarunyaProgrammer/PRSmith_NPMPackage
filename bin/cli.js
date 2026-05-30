#!/usr/bin/env node

import chalk from "chalk";
import { getReviewData } from "../src/prompts.js";
import { generateMarkdown } from "../src/formatter.js";

async function main() {
  try {
    console.log(
      chalk.cyan("\nPRSmith - Professional PR Review Comment Generator\n")
    );

    const data = await getReviewData();

    const markdown = generateMarkdown(data);

    console.log(chalk.green("\nGenerated Comment:\n"));
    console.log(markdown);
  } catch (error) {
    if (error.name === "ExitPromptError") {
      console.log(chalk.yellow("\nYou have quit in b/w :) \n"));
      process.exit(0);
    }
    console.error(chalk.red("\nSomething went wrong.\n"));
    console.error(error);
    process.exit(1);
  }
}

main();
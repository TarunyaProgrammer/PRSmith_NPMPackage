#!/usr/bin/env node

import chalk from "chalk";
import { program } from "commander";
import { getReviewData } from "../src/prompts.js";
import { generateMarkdown } from "../src/formatter.js";

program
  .name("prsmith")
  .description("Forge professional pull request review comments directly from the terminal.")
  .version("1.0.1", "-v, --version", "Output the current version")
  .helpOption("-h, --help", "Display help for command")
  .action(async () => {
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
  });

program.parse(process.argv);
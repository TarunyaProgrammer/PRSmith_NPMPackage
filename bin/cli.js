#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import { program } from "commander";
import clipboardy from "clipboardy";
import updateNotifier from "update-notifier";
import { getReviewData } from "../src/prompts.js";
import { generateMarkdown } from "../src/formatter.js";
import { loadConfig } from "../src/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../package.json"), "utf8")
);

updateNotifier({ pkg }).notify();

program
  .name("prsmith")
  .description("Forge professional pull request review comments directly from the terminal.")
  .version(pkg.version, "-v, --version", "Output the current version")
  .helpOption("-h, --help", "Display help for command")
  .option("-s, --severity <level>", "Severity of the issue (e.g. Critical, Major, Minor, Suggestion)")
  .option("-t, --title <title>", "Title of the review")
  .option("-i, --issue <issue>", "Description of the issue")
  .option("-f, --fix <fix>", "Suggested fix")
  .option("-o, --out <file>", "Save the output to a markdown file")
  .action(async (options) => {
    try {
      console.log(
        chalk.cyan("\nPRSmith - Professional PR Review Comment Generator\n")
      );

      const config = loadConfig();
      const data = await getReviewData(options, config);
      const markdown = generateMarkdown(data, config);

      console.log(chalk.green("\nGenerated Comment:\n"));
      console.log(markdown);

      clipboardy.writeSync(markdown);
      console.log(chalk.green("✅ Comment copied to clipboard!\n"));

      if (options.out) {
        const outPath = path.resolve(process.cwd(), options.out);
        fs.writeFileSync(outPath, markdown, "utf8");
        console.log(chalk.green(`✅ Comment saved to ${outPath}\n`));
      }
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
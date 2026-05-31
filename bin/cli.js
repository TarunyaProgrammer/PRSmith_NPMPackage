#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { program } from 'commander';
import clipboardy from 'clipboardy';
import updateNotifier from 'update-notifier';
import inquirer from 'inquirer';
import { getReviewData } from '../src/prompts.js';
import { generateMarkdown } from '../src/formatter.js';
import { loadConfig } from '../src/config.js';
import { polishText } from '../src/ai.js';
import { detectGithubRepo, postPRComment } from '../src/github.js';
import { runBatchReview } from '../src/batch.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
);

updateNotifier({ pkg }).notify();

// Define 'batch' command
program
  .command('batch')
  .description(
    'Start an interactive batch review loop to bundle multiple comments.'
  )
  .action(async () => {
    try {
      const config = loadConfig();
      await runBatchReview(config);
    } catch (error) {
      if (error.name === 'ExitPromptError') {
        console.log(chalk.yellow('\nYou have quit Batch Review Mode :) \n'));
        process.exit(0);
      }
      console.error(chalk.red('\nSomething went wrong in Batch Mode.\n'));
      console.error(error);
      process.exit(1);
    }
  });

// Main program CLI options
program
  .name('prsmith')
  .description(
    'Forge professional pull request review comments directly from the terminal.'
  )
  .version(pkg.version, '-v, --version', 'Output the current version')
  .helpOption('-h, --help', 'Display help for command')

  // Existing Options
  .option(
    '-s, --severity <level>',
    'Severity of the issue (e.g. Critical, Major, Minor, Suggestion)'
  )
  .option('-t, --title <title>', 'Title of the review')
  .option('-i, --issue <issue>', 'Description of the issue')
  .option('-f, --fix <fix>', 'Suggested fix')
  .option('-o, --out <file>', 'Save the output to a markdown file')

  // New Options (v2.0.0)
  .option(
    '-p, --path <filepath>',
    'File path context of the code being reviewed'
  )
  .option('-l, --line <range>', 'Line number or range (e.g. 12 or 45-50)')
  .option(
    '--lang <language>',
    'Programming language for code syntax highlighting',
    'javascript'
  )
  .option('--before <code>', 'Original code snippet (Before)')
  .option('--after <code>', 'Proposed code snippet (After)')
  .option('--ai', 'Automatically polish description and fix with AI for tone')
  .option(
    '--github',
    'Post the review comment directly to a GitHub Pull Request'
  )
  .option('--pr <prNumber>', 'The Pull Request number to post comment to')
  .option(
    '--repo <owner/repo>',
    "GitHub repository in 'owner/repo' format (otherwise auto-detected)"
  )

  .action(async (options) => {
    // If the subcommand 'batch' is run, this main action is skipped automatically by Commander
    try {
      console.log(
        chalk.cyan('\nPRSmith - Professional PR Review Comment Generator\n')
      );

      const config = loadConfig();

      // Get the rest of review data interactively or via flags
      let data = await getReviewData(options, config);

      // Perform AI Polish if requested
      if (data.ai) {
        console.log(chalk.yellow('\n✨ Polishing comments with AI...'));
        data.issue = await polishText(
          data.issue,
          'Problem Description',
          config
        );
        data.fix = await polishText(data.fix, 'Suggested Fix', config);
      }

      // Generate the markdown block
      const markdown = generateMarkdown(data, config);

      console.log(chalk.green('\nGenerated Comment:\n'));
      console.log(markdown);

      // Clipboard integration
      try {
        clipboardy.writeSync(markdown);
        console.log(chalk.green('✅ Comment copied to clipboard!'));
      } catch {
        console.warn(
          chalk.yellow('⚠️ Could not write to clipboard automatically.')
        );
      }

      // Save to file if output specified
      if (options.out) {
        const outPath = path.resolve(process.cwd(), options.out);
        fs.writeFileSync(outPath, markdown, 'utf8');
        console.log(chalk.green(`✅ Comment saved to ${outPath}`));
      }

      // Post to GitHub if specified
      if (options.github || options.pr || options.repo) {
        const token = config.githubToken || process.env.GITHUB_TOKEN;
        if (!token) {
          console.error(
            chalk.red('\n❌ Error: GitHub Personal Access Token not found!')
          );
          console.error(
            chalk.yellow(
              "Please configure 'githubToken' in your local ~/.prsmith.json file or set the GITHUB_TOKEN environment variable.\n"
            )
          );
          process.exit(1);
        }

        const detectedRepo = detectGithubRepo();
        let owner = '';
        let repoName = '';

        if (options.repo) {
          const parts = options.repo.split('/');
          if (parts.length === 2) {
            owner = parts[0];
            repoName = parts[1];
          }
        } else if (detectedRepo) {
          owner = detectedRepo.owner;
          repoName = detectedRepo.repo;
        }

        const prQuestions = [];
        if (!owner || !repoName) {
          prQuestions.push(
            {
              type: 'input',
              name: 'owner',
              message: 'GitHub repository owner:',
              validate: (val) => val.trim() !== '' || 'Owner is required.',
            },
            {
              type: 'input',
              name: 'repoName',
              message: 'GitHub repository name:',
              validate: (val) => val.trim() !== '' || 'Repo name is required.',
            }
          );
        }

        if (!options.pr) {
          prQuestions.push({
            type: 'input',
            name: 'prNumber',
            message: 'Pull Request Number:',
            validate: (val) =>
              /^\d+$/.test(val.trim()) || 'PR number must be an integer.',
          });
        }

        const prAnswers =
          prQuestions.length > 0 ? await inquirer.prompt(prQuestions) : {};

        const finalOwner = owner || prAnswers.owner;
        const finalRepo = repoName || prAnswers.repoName;
        const finalPr = options.pr || prAnswers.prNumber;

        console.log(
          chalk.yellow('\n🚀 Posting comment directly to GitHub PR...')
        );

        const commentUrl = await postPRComment(
          finalOwner,
          finalRepo,
          finalPr,
          markdown,
          config
        );

        console.log(
          chalk.green(`🎉 Success! Comment posted to GitHub PR #${finalPr}`)
        );
        console.log(chalk.green(`🔗 Comment Link: ${commentUrl}\n`));
      }
    } catch (error) {
      if (error.name === 'ExitPromptError') {
        console.log(chalk.yellow('\nYou have quit in b/w :) \n'));
        process.exit(0);
      }
      console.error(chalk.red('\nSomething went wrong.\n'));
      console.error(error);
      process.exit(1);
    }
  });

program.parse(process.argv);

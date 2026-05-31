import inquirer from 'inquirer';
import chalk from 'chalk';
import clipboardy from 'clipboardy';
import fs from 'fs';
import path from 'path';
import { getReviewData } from './prompts.js';
import { generateMarkdown } from './formatter.js';
import { polishText } from './ai.js';
import { detectGithubRepo, submitPRReview } from './github.js';

/**
 * Runs the interactive Batch Review Mode.
 *
 * @param {object} options CLI parsed options
 * @param {object} config Local configurations
 */
export async function runBatchReview(config = {}) {
  console.log(chalk.cyan('\n🚀 PRSmith - Starting Batch Review Mode\n'));

  const comments = [];
  let addMore = true;
  let counter = 1;

  while (addMore) {
    console.log(chalk.blue.bold(`\n📝 Comment #${counter}:`));

    // Get comment data interactively
    // We pass empty options to ensure it prompts for everything
    const data = await getReviewData({}, config);

    // Apply AI polish if requested
    if (data.ai) {
      console.log(chalk.yellow('\n✨ Polishing with AI...'));
      data.issue = await polishText(data.issue, 'Problem Description', config);
      data.fix = await polishText(data.fix, 'Suggested Fix', config);
    }

    // Generate markdown for this individual comment
    const commentMarkdown = generateMarkdown(data, config);

    // Store in our review list
    comments.push({
      path: data.path || null,
      line: data.line || null,
      body: commentMarkdown,
      title: data.title,
      severity: data.severity,
    });

    console.log(chalk.green(`\n✅ Comment #${counter} added to batch!`));

    const response = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'more',
        message: 'Would you like to add another comment to this review batch?',
        default: false,
      },
    ]);

    addMore = response.more;
    counter++;
  }

  // Generate unified review markdown
  const unifiedMarkdown = generateUnifiedReport(comments);

  console.log(chalk.cyan.bold('\n📦 Batch Review Compilation Successful!'));
  console.log(chalk.gray(`Total Comments: ${comments.length}\n`));

  // Options menu for export
  let menuActive = true;
  while (menuActive) {
    const { action } = await inquirer.prompt([
      {
        type: 'select',
        name: 'action',
        message: 'What would you like to do with this batch review?',
        choices: [
          '📋 Copy entire review to clipboard',
          '💾 Save review to a markdown file',
          '🚀 Post review directly to a GitHub Pull Request',
          '❌ Exit Batch Review Mode',
        ],
      },
    ]);

    if (action.includes('Copy')) {
      try {
        clipboardy.writeSync(unifiedMarkdown);
        console.log(
          chalk.green('\n✅ Full review successfully copied to clipboard!\n')
        );
      } catch (err) {
        console.error(chalk.red(`Failed to copy to clipboard: ${err.message}`));
      }
    } else if (action.includes('Save')) {
      const { outFile } = await inquirer.prompt([
        {
          type: 'input',
          name: 'outFile',
          message: 'Enter the file name to save (e.g. pr-review.md):',
          default: 'pr-review.md',
        },
      ]);
      try {
        const outPath = path.resolve(process.cwd(), outFile);
        fs.writeFileSync(outPath, unifiedMarkdown, 'utf8');
        console.log(
          chalk.green(`\n✅ Review successfully saved to ${outPath}\n`)
        );
      } catch (err) {
        console.error(chalk.red(`Failed to write file: ${err.message}`));
      }
    } else if (action.includes('Post')) {
      const repo = config.githubRepo || detectGithubRepo();
      const defaultOwner = repo ? repo.owner : '';
      const defaultRepo = repo ? repo.repo : '';

      const prDetails = await inquirer.prompt([
        {
          type: 'input',
          name: 'owner',
          message: 'GitHub Repository Owner:',
          default: defaultOwner,
          validate: (val) => val.trim() !== '' || 'Owner is required.',
        },
        {
          type: 'input',
          name: 'repoName',
          message: 'GitHub Repository Name:',
          default: defaultRepo,
          validate: (val) =>
            val.trim() !== '' || 'Repository name is required.',
        },
        {
          type: 'input',
          name: 'prNumber',
          message: 'Pull Request Number:',
          validate: (val) =>
            /^\d+$/.test(val.trim()) || 'PR Number must be a valid integer.',
        },
      ]);

      console.log(chalk.yellow('\n🚀 Submitting review comments to GitHub...'));
      try {
        // Construct the review body listing general comments (those without path/line)
        const generalComments = comments.filter((c) => !c.path || !c.line);
        let reviewBody = '### 🛠️ PRSmith Unified Code Review Session\n\n';

        if (generalComments.length > 0) {
          reviewBody += '#### General Comments:\n\n';
          generalComments.forEach((c) => {
            reviewBody += `---\n\n${c.body}\n`;
          });
        } else {
          reviewBody +=
            'All review comments have been applied inline to their respective lines. Check the files list below!';
        }

        const inlineComments = comments.filter((c) => c.path && c.line);

        const url = await submitPRReview(
          prDetails.owner,
          prDetails.repoName,
          prDetails.prNumber,
          reviewBody,
          inlineComments,
          config
        );

        console.log(
          chalk.green(`\n🎉 Native Pull Request Review successfully submitted!`)
        );
        console.log(chalk.green(`🔗 Review link: ${url}\n`));
      } catch (err) {
        console.error(
          chalk.red(`\n❌ Failed to submit PR Review: ${err.message}\n`)
        );
      }
    } else {
      menuActive = false;
      console.log(chalk.yellow('\nExiting Batch Review Mode. Bye!\n'));
    }
  }
}

/**
 * Combines all individual review comments into a single unified markdown report.
 *
 * @param {Array<object>} comments The compiled list of comments
 * @returns {string} The unified markdown text
 */
function generateUnifiedReport(comments) {
  let report = `# PRSmith Unified Code Review Report\n\n`;
  report += `This review contains **${comments.length}** compiled review comment${comments.length > 1 ? 's' : ''}.\n\n`;

  comments.forEach((c, idx) => {
    report += `## Comment #${idx + 1}\n\n`;
    report += c.body;
    report += `\n---\n\n`;
  });

  report += `*Generated automatically with [PRSmith](https://github.com/tarunyaprogrammer/PRSmith).*`;
  return report;
}

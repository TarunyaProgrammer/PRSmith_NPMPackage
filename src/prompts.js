import inquirer from 'inquirer';

export async function getReviewData(options = {}, config = {}) {
  const defaultSeverities = ['Critical', 'Major', 'Minor', 'Suggestion'];
  let severities = [...defaultSeverities];
  if (config.templates) {
    for (const key of Object.keys(config.templates)) {
      if (!severities.includes(key)) {
        severities.push(key);
      }
    }
  }

  // 1. Gather Core Fields
  const coreQuestions = [];

  if (!options.severity) {
    coreQuestions.push({
      type: 'select',
      name: 'severity',
      message: 'Select severity:',
      choices: severities,
    });
  }

  if (!options.title) {
    coreQuestions.push({
      type: 'input',
      name: 'title',
      message: 'Review title:',
    });
  }

  if (!options.issue) {
    coreQuestions.push({
      type: 'editor',
      name: 'issue',
      message:
        'Describe the issue (Vim: i to write, Esc then :wq to save & exit. Nano: Ctrl+O, Enter, Ctrl+X):',
    });
  }

  if (!options.fix) {
    coreQuestions.push({
      type: 'editor',
      name: 'fix',
      message:
        'Suggested fix (Vim: i to write, Esc then :wq to save & exit. Nano: Ctrl+O, Enter, Ctrl+X):',
    });
  }

  const coreAnswers =
    coreQuestions.length > 0 ? await inquirer.prompt(coreQuestions) : {};
  const currentData = { ...options, ...coreAnswers };

  // 2. Gather File & Line Context
  let fileAnswers = {};
  if (currentData.path === undefined && currentData.line === undefined) {
    const { addContext } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'addContext',
        message: 'Would you like to add file & line context?',
        default: false,
      },
    ]);

    if (addContext) {
      fileAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'path',
          message: 'File path (relative to repo root, e.g. src/index.js):',
        },
        {
          type: 'input',
          name: 'line',
          message: 'Line number or range (e.g. 12 or 45-50):',
        },
      ]);
    }
  }

  // 3. Gather Before/After Code Snippets
  let codeAnswers = {};
  if (currentData.before === undefined && currentData.after === undefined) {
    const { addSnippets } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'addSnippets',
        message: 'Would you like to add Before/After code snippets?',
        default: false,
      },
    ]);

    if (addSnippets) {
      codeAnswers = await inquirer.prompt([
        {
          type: 'input',
          name: 'lang',
          message: 'Programming language (for markdown syntax highlighting):',
          default: 'javascript',
        },
        {
          type: 'editor',
          name: 'before',
          message:
            'Original Code (Before) (Vim: i to write, Esc then :wq to save & exit. Nano: Ctrl+O, Enter, Ctrl+X):',
        },
        {
          type: 'editor',
          name: 'after',
          message:
            'Proposed Code (After) (Vim: i to write, Esc then :wq to save & exit. Nano: Ctrl+O, Enter, Ctrl+X):',
        },
      ]);
    }
  }

  // 4. Gather AI Polish Toggle
  let aiAnswers = {};
  if (currentData.ai === undefined) {
    const hasKey = !!(
      config.aiApiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.OPENAI_API_KEY ||
      process.env.GROQ_API_KEY
    );

    const { ai } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'ai',
        message: hasKey
          ? 'Polish the description and fix with AI for a constructive, polite tone?'
          : 'Polish with AI? (Note: Needs AI key configured in .prsmith.json or env)',
        default: false,
      },
    ]);
    aiAnswers = { ai };
  }

  return {
    ...currentData,
    ...fileAnswers,
    ...codeAnswers,
    ...aiAnswers,
  };
}

import chalk from 'chalk';

/**
 * Polishes the provided text to be polite, constructive, and professional.
 * Supports Gemini, OpenAI, and Groq.
 *
 * @param {string} text The raw text to polish (Problem or Suggested Fix)
 * @param {string} fieldName Either "Problem Description" or "Suggested Fix" for prompt context
 * @param {object} config Local user configuration from .prsmith.json
 * @returns {Promise<string>} The polished text, or the original text on failure/missing keys.
 */
export async function polishText(text, fieldName, config = {}) {
  if (!text || text.trim() === '') return text;

  // Retrieve credentials from config or environment variables
  const provider = (
    config.aiProvider ||
    process.env.AI_PROVIDER ||
    'gemini'
  ).toLowerCase();
  let apiKey = config.aiApiKey || '';
  let model = config.aiModel || '';

  if (provider === 'gemini') {
    apiKey = apiKey || process.env.GEMINI_API_KEY || '';
    model = model || process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  } else if (provider === 'openai') {
    apiKey = apiKey || process.env.OPENAI_API_KEY || '';
    model = model || process.env.OPENAI_MODEL || 'gpt-4o-mini';
  } else if (provider === 'groq') {
    apiKey = apiKey || process.env.GROQ_API_KEY || '';
    model = model || process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  } else {
    console.warn(
      chalk.yellow(
        `\n⚠️ Unknown AI provider '${provider}'. Falling back to raw text.`
      )
    );
    return text;
  }

  if (!apiKey) {
    console.warn(
      chalk.yellow(
        `\n⚠️ No API key found for '${provider}'. Set 'aiApiKey' in .prsmith.json or the corresponding env variable (${provider.toUpperCase()}_API_KEY) to enable AI polishing.`
      )
    );
    return text;
  }

  const prompt = `You are an expert senior software engineer and empathetic mentor.
Translate the following code review comment field (${fieldName}) into a highly polite, constructive, professional, and empathetic tone, while retaining all technical correctness and details.
Avoid sounding accusatory, patronizing, or overly verbose. Keep the polished output in standard markdown format, directly and only providing the polished content. Do not add introductory or concluding remarks.

Original content to polish:
${text}`;

  try {
    if (provider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Gemini API error: ${response.statusText} (${errorText})`
        );
      }

      const data = await response.json();
      const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (resultText) return resultText.trim();
    } else if (provider === 'openai' || provider === 'groq') {
      const url =
        provider === 'openai'
          ? 'https://api.openai.com/v1/chat/completions'
          : 'https://api.groq.com/openai/v1/chat/completions';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `${provider.toUpperCase()} API error: ${response.statusText} (${errorText})`
        );
      }

      const data = await response.json();
      const resultText = data.choices?.[0]?.message?.content;
      if (resultText) return resultText.trim();
    }
  } catch (error) {
    console.warn(
      chalk.yellow(
        `\n⚠️ AI Polishing failed: ${error.message}. Falling back to raw text.`
      )
    );
  }

  return text;
}

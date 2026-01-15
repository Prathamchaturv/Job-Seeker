/**
 * Gemini AI client setup.
 *
 * Responsibilities:
 * - Initialize Google Gemini using API key from environment variables
 * - Export a reusable Gemini client instance
 *
 * Rules:
 * - Do NOT expose API key
 * - Use @google/generative-ai SDK
 * - Throw error if API key is missing
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Initialize Gemini AI client
 * @throws Error if GEMINI_API_KEY is not set in environment variables
 */
const initializeGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not defined in environment variables. ' +
      'Please add it to your .env file.'
    );
  }

  return new GoogleGenerativeAI(apiKey);
};

// Export singleton instance
export const geminiClient = initializeGeminiClient();

/**
 * Get a generative model instance
 * @param modelName - The model to use (default: gemini-1.5-flash)
 * @returns Generative model instance
 */
export const getGeminiModel = (modelName: string = 'gemini-1.5-flash') => {
  return geminiClient.getGenerativeModel({ 
    model: modelName,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    },
  });
};

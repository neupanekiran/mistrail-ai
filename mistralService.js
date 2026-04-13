import { Mistral } from '@mistralai/mistralai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({ apiKey });

/**
 * Generates an email using Mistral AI based on user context and retrieved RAG context.
 * @param {string} userContext - The context provided by the user.
 * @param {string} retrievedContext - Context retrieved from the knowledge base.
 * @returns {Promise<{subject: string, body: string}>}
 */
export async function generateEmail(userContext, retrievedContext) {
  const prompt = `
    You are an expert professional email writer. 
    Based on the following context and supplementary knowledge, generate a professional email.
    
    SUPPLEMENTARY KNOWLEDGE:
    ${retrievedContext || "No additional knowledge found."}
    
    USER CONTEXT:
    ${userContext}
    
    RESPONSE FORMAT:
    You MUST respond with a valid JSON object ONLY. 
    The JSON structure should be:
    {
      "subject": "Email Subject",
      "body": "Email Body"
    }
    
    Do not include any other text, markdown blocks, or explanations. Just the JSON.
  `;

  try {
    const chatResponse = await client.chat.complete({
      model: 'mistral-tiny', // or 'mistral-small-latest', 'mistral-medium-latest', etc.
      messages: [{ role: 'user', content: prompt }],
      responseFormat: { type: 'json_object' } // Mistral supports JSON mode
    });

    const content = chatResponse.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error calling Mistral AI:', error);
    throw new Error('Failed to generate email with Mistral AI');
  }
}

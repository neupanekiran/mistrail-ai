import fs from 'node:fs/promises';
import path from 'node:path';

const KNOWLEDGE_BASE_PATH = path.resolve('knowledge_base.json');

/**
 * A simple RAG-like retriever that finds relevant context based on keyword matching.
 * @param {string} query - The user prompt or context.
 * @returns {Promise<string>} - A string of relevant context found.
 */
export async function getRelevantContext(query) {
  try {
    const data = await fs.readFile(KNOWLEDGE_BASE_PATH, 'utf-8');
    const knowledgeBase = JSON.parse(data);
    
    const queryLower = query.toLowerCase();
    
    // Simple filter based on keyword inclusion
    const relevantItems = knowledgeBase.filter(item => {
      const contentLower = item.content.toLowerCase();
      const topicLower = item.topic.toLowerCase();
      
      // Check if any word from the query matches text in the KB
      const queryWords = queryLower.split(/\W+/).filter(w => w.length > 3);
      return queryWords.some(word => contentLower.includes(word) || topicLower.includes(word));
    });
    
    // If no specific match, return a generic piece of knowledge or empty
    if (relevantItems.length === 0) {
      return "";
    }
    
    // Format the retrieved context
    return relevantItems.map(item => `[${item.topic}]: ${item.content}`).join('\n');
  } catch (error) {
    console.error('Error reading knowledge base:', error);
    return "";
  }
}

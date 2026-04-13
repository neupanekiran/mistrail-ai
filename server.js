import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { getRelevantContext } from './ragService.js';
import { generateEmail } from './mistralService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

// Main endpoint to generate email
app.post('/api/generate-email', async (req, res) => {
  const { context } = req.body;

  if (!context) {
    return res.status(400).json({ error: 'Context is required' });
  }

  try {
    // 1. Retrieve relevant context (RAG)
    const retrievedContext = await getRelevantContext(context);
    console.log(`[RAG] Retrieved context for query: "${context.substring(0, 30)}..."`);
    console.log(retrievedContext || 'No relevant knowledge found.');

    // 2. Generate email with Mistral AI
    const emailResponse = await generateEmail(context, retrievedContext);

    // 3. Send response
    res.json(emailResponse);
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ error: 'Failed to generate email', details: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', port: PORT });
});

app.listen(PORT, () => {
  console.log(`🚀 Mistral Email Generator API running on http://localhost:${PORT}`);
});

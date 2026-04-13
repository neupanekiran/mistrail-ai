# Mistral AI Email Generator API (with Small RAG)

This project provides a simple API to generate professional emails based on context using Mistral AI. It features a "Small RAG" (Retrieval-Augmented Generation) system to inject relevant company or project data into the AI's prompt.

## Project Structure

- `server.js`: The main entry point. Sets up the Express server and API endpoints.
- `mistralService.js`: Contains logic to interact with the Mistral AI SDK and format responses.
- `ragService.js`: Implements a simple keyword-based retriever for the context knowledge base.
- `knowledge_base.json`: A local JSON database containing context data for RAG.
- `.env`: Configuration for `PORT` and `MISTRAL_API_KEY`.

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   - Create a `.env` file (template provided in the project).
   - Set `MISTRAL_API_KEY` to your valid Mistral API key.
   - Default `PORT` is `4001`.

3. **Start the server**:
   ```bash
   npm start
   ```
   Or for development:
   ```bash
   npm run dev
   ```

## API Documentation

### 1. Generate Email
Generates a structured email based on context.

- **URL**: `/api/generate-email`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "context": "Context written by user for example: Write a mail to Mr. John regarding Project Mistral"
  }
  ```
- **Response**:
  ```json
  {
    "subject": "Discussion on Project Mistral Implementation",
    "body": "Dear Mr. John, ... (generated content) ..."
  }
  ```

### 2. Health Check
- **URL**: `/health`
- **Method**: `GET`
- **Response**: `{ "status": "ok", "port": 4001 }`

## How "Small RAG" Works
1. The server receives a user prompt.
2. `ragService.js` scans `knowledge_base.json` for keywords found in the prompt.
3. Relevant pieces of information are extracted and injected into the prompt sent to Mistral AI.
4. Mistral AI uses this "retrieved knowledge" to write a more accurate and context-aware email.

## Knowledge Base
You can customize the `knowledge_base.json` file to include your own company information, project details, or contact info. The more data you add, the better the RAG system will perform.

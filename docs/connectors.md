# Retrieval Connector Configuration & RAG Pipeline

## Overview

The Course Generator implements a lightweight Retrieval-Augmented Generation (RAG) pipeline to generate structured learning roadmaps from trusted technical resources. Instead of relying solely on a Large Language Model (LLM), the application first retrieves relevant documentation and tutorial content, processes the retrieved information, and then grounds the generation process using that context.

The retrieval layer is implemented using the Tavily Search API, which acts as the project's retrieval connector. Retrieved documents are filtered, ranked and supplied to Gemini, enabling more reliable and context-aware course generation while reducing hallucinations.

---

# System Architecture

```
User Topic
      │
      ▼
Tavily Search API
      │
      ▼
Trusted Source Filtering
      │
      ▼
Document Cleaning
      │
      ▼
Document Chunking
      │
      ▼
Chunk Ranking
      │
      ▼
Top-K Retrieval
      │
      ▼
Prompt Construction
      │
      ▼
Gemini
      │
      ▼
Structured Course JSON
```

---

# Retrieval Connector

Implementation Location

```
backend/src/services/mcpService.js
```

The retrieval connector is responsible for:

- Accepting the user topic.
- Searching trusted technical resources.
- Filtering unsupported or irrelevant domains.
- Cleaning retrieved content.
- Splitting large documents into manageable chunks.
- Ranking chunks according to topic relevance.
- Returning the highest quality context to the RAG pipeline.

Separating retrieval from generation keeps the architecture modular, easier to maintain, and allows future improvements without affecting the LLM layer.

---

# Related Components

backend/src/services/ragService.js
backend/src/services/geminiService.js
backend/src/utils/retrievalUtils.js
backend/src/utils/promptBuilder.js

---

# Supported Sources

The connector retrieves information only from trusted technical resources.

Current supported domains include:

- developer.mozilla.org
- react.dev
- nodejs.org
- expressjs.com
- mongodb.com
- freecodecamp.org
- geeksforgeeks.org
- oracle.com
- cplusplus.com
- docs.python.org
- developer.android.com

Additional documentation providers can be added by extending the allowlist inside the retrieval connector.

---

# Retrieval Pipeline

After receiving the search results, the following processing stages are executed.

## 1. Trusted Source Filtering

Only results originating from approved technical documentation or tutorial websites are retained. This prevents unrelated or low-quality sources from entering the generation pipeline.

---

## 2. Document Cleaning

Retrieved content is normalized by removing unnecessary whitespace and formatting inconsistencies before further processing.

---

## 3. Document Chunking

Long documents are divided into overlapping chunks so that the language model receives concise and context-preserving information rather than excessively large documents.

---

## 4. Chunk Ranking

Each chunk receives a relevance score based on keyword matching with the requested topic. More relevant chunks receive higher scores.

---

## 5. Top-K Retrieval

Only the highest ranked chunks are selected.

This reduces token usage, improves response quality and provides focused context for generation.

---

## 6. Prompt Construction

The selected chunks are combined into a structured prompt that instructs Gemini to:

- use only retrieved information whenever possible,
- organize the content into a structured learning roadmap,
- produce valid JSON output,
- avoid unsupported references,
- return "Not Available" when retrieved evidence is insufficient.

---

# API Endpoint

```
POST /api/course/generate
```

Example Request

```json
{
    "topic": "MERN"
}
```

Example Response

```json
{
    "success": true,
    "provider": "Gemini",
    "course": {
        ...
    }
}
```

---

# Design Decisions

Several retrieval strategies were evaluated during development.

An initial HTML scraping approach was explored for documentation websites. However, maintaining multiple site-specific parsers proved unreliable because website structures differ significantly and frequently change.

The final implementation adopts the Tavily Search API as a unified retrieval connector. This approach improves maintainability while still allowing strict filtering to trusted technical sources before information is passed to the language model.

The retrieval, ranking and generation stages were intentionally separated into independent services to improve modularity and future extensibility.

---

# Current Limitations

The current implementation is intentionally lightweight and designed to satisfy the assignment requirements.

Current limitations include:

- Keyword-based chunk ranking instead of semantic ranking.
- No vector database.
- No embedding-based retrieval.
- No persistent document indexing.
- No retrieval cache.
- The application is intended for software and technical learning topics.

Despite these limitations, grounding Gemini on retrieved documentation substantially reduces hallucinations compared to direct prompting.

---

# Future Enhancements

The current architecture can be extended without major structural changes.

Possible improvements include:

- ChromaDB or Pinecone integration
- Gemini Embeddings
- Semantic similarity search
- Hybrid retrieval
- Cross-encoder reranking
- Retrieval caching
- Multi-query retrieval
- Streaming responses
- Metadata-based ranking
- Adaptive chunk sizing

---

# Environment Variables

```
GEMINI_API_KEY=<your_gemini_api_key>

TAVILY_API_KEY=<your_tavily_api_key>
```

---

# Project Structure

```
backend/
│
├── src/
│   ├── services/
│   │   ├── mcpService.js
│   │   ├── ragService.js
│   │   └── geminiService.js
│   │
│   └── utils/
│       ├── retrievalUtils.js
│       └── promptBuilder.js
```

---

# Summary

The implementation satisfies the project requirements by:

- integrating a retrieval connector for trusted technical resources,
- filtering and ranking retrieved documents,
- constructing a Retrieval-Augmented Generation (RAG) pipeline,
- grounding Gemini responses using retrieved context,
- reducing hallucinations through source-based generation,
- generating structured beginner-to-advanced learning roadmaps,
- presenting the generated roadmap through a React-based user interface with support for Markdown and PDF export.
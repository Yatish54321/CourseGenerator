# Technical Design – AI Course Generator

---

# 1. Technology Stack

## Frontend

- React.js (Vite)
- JavaScript (ES6+)
- Axios
- React Icons
- html2canvas
- jsPDF
- CSS3

---

## Backend

- Node.js
- Express.js

---

## AI & Retrieval

- Google Gemini API
- Tavily Search API
- Retrieval-Augmented Generation (RAG)

---

## Retrieval Components

- Trusted Source Filtering
- Document Cleaning
- Document Chunking
- Keyword-based Chunk Ranking
- Top-K Retrieval
- Prompt Builder

---

## Development Tools

- Git
- GitHub
- VS Code
- Postman

---

# 2. System Architecture

The application follows a lightweight client-server architecture designed around Retrieval-Augmented Generation (RAG).

Instead of generating learning content directly from an LLM, the backend first retrieves relevant technical documentation from trusted sources using the Tavily Search API. The retrieved content is cleaned, ranked and supplied to Gemini, which generates a structured learning roadmap grounded in the retrieved information.

Overall architecture:

```

User
│
▼
React Frontend
│
▼
Express REST API
│
▼
Topic Validation
│
▼
Tavily Retrieval Connector
│
▼
Trusted Source Filtering
│
▼
Document Processing
│
▼
Chunk Ranking
│
▼
Prompt Builder
│
▼
Gemini API
│
▼
Structured Course JSON
│
▼
Frontend Rendering

```

The separation of retrieval and generation keeps the system modular and allows future improvements without affecting other components.

---

# 3. Retrieval Connector Design

The retrieval layer is implemented using the Tavily Search API.

Implementation:

```

backend/src/services/mcpService.js

```

Responsibilities of the retrieval connector include:

- Accepting the requested learning topic.
- Searching trusted technical resources.
- Filtering unsupported domains.
- Cleaning retrieved content.
- Preparing documents for retrieval.
- Returning relevant content for the RAG pipeline.

Only trusted documentation and tutorial websites are considered during retrieval to improve response quality and reduce hallucinations.

Current trusted sources include:

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

The connector has been implemented independently from the language model, making the retrieval layer reusable and easily extensible.

---

# 4. Retrieval-Augmented Generation (RAG) Pipeline

The project implements a lightweight Retrieval-Augmented Generation pipeline.

Instead of relying entirely on the language model's internal knowledge, external technical documentation is retrieved and supplied as contextual information before generation.

The pipeline consists of the following stages.

## Step 1 – User Query

The user submits a technical topic from the frontend interface.

Example:

```

React

```

---

## Step 2 – Retrieval

The retrieval connector searches trusted documentation and tutorial websites through the Tavily Search API.

Only supported technical domains are retained.

---

## Step 3 – Document Cleaning

Retrieved text is normalized by:

- removing unnecessary whitespace
- removing redundant formatting
- preparing documents for chunking

This improves consistency before retrieval.

---

## Step 4 – Document Chunking

Large documents are divided into smaller overlapping chunks.

Benefits include:

- preserving context
- reducing prompt size
- improving retrieval quality
- lowering token usage

---

## Step 5 – Chunk Ranking

Each chunk receives a relevance score using keyword-based ranking.

Higher scoring chunks are considered more relevant to the requested learning topic.

Only the most relevant chunks continue through the pipeline.

---

## Step 6 – Top-K Retrieval

The highest ranked chunks are selected.

This reduces unnecessary context while providing sufficient technical information for course generation.

---

## Step 7 – Prompt Construction

The selected chunks are combined into a structured prompt.

The prompt instructs Gemini to:

- organize content into a structured learning roadmap
- prioritize retrieved information
- avoid unsupported references
- minimize hallucinations
- produce valid JSON output

---

## Step 8 – Course Generation

Gemini processes the retrieved context and generates:

- Course title
- Introduction
- Learning objectives
- Beginner modules
- Intermediate modules
- Advanced modules
- Learning order
- References
- Suggested reading
- Final project

The generated JSON response is returned to the frontend for rendering.

---

# 5. API Design

The backend exposes a REST endpoint for generating structured learning courses.

## Course Generation API

### Endpoint

```

POST /api/course/generate

```

Request

```json
{
    "topic": "MERN"
}
```

Response

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

# 6. AI Integration

The project integrates Google's Gemini API with a Retrieval-Augmented Generation pipeline.

Responsibilities of Gemini include:

- generating structured learning roadmaps
- organizing concepts into learning stages
- generating learning objectives
- producing references
- creating final project ideas

The language model receives contextual information retrieved through the retrieval connector instead of relying only on internal knowledge.

---

# 7. Prompt Engineering

Prompt engineering plays an important role in reducing hallucinations and maintaining structured output.

The prompt instructs Gemini to:

- generate structured JSON only
- organize content into predefined sections
- prioritize retrieved context
- avoid unsupported references
- return "Not Available" whenever evidence is insufficient

The output format remains consistent regardless of the requested learning topic.

---

# 8. Hallucination Reduction Strategy

To improve reliability, the project grounds responses using retrieved technical documentation.

The following strategies are applied:

- trusted source filtering
- retrieval before generation
- document chunking
- chunk ranking
- Top-K retrieval
- structured prompt engineering

This significantly reduces unsupported responses compared to direct prompting.

---

# 9. Frontend Design

The frontend is implemented using React.js and provides a simple interface for interacting with the course generation pipeline.

Features include:

- topic search
- loading indicator
- error handling
- course overview
- learning objectives
- beginner modules
- intermediate modules
- advanced modules
- recommended learning order
- references
- suggested reading resources
- PDF export
- Markdown export

---

# 10. Processing Flow

Overall application workflow:

1. User enters a technical topic.
2. Frontend sends a POST request.
3. Backend validates the topic.
4. Tavily retrieves technical documents.
5. Trusted sources are filtered.
6. Retrieved documents are cleaned.
7. Documents are chunked.
8. Chunks are ranked.
9. Top-K chunks are selected.
10. Prompt is constructed.
11. Gemini generates a structured course.
12. JSON response is returned.
13. Frontend renders the generated learning roadmap.
14. Users may export the generated roadmap as Markdown or PDF.

---

# 11. Project Structure

```

CourseGenerator/

├── frontend/
│
│   ├── src/
│   │
│   ├── components/
│   ├── services/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
│
├── backend/
│
│   ├── src/
│   │
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.js
│
├── server.js
│
├── README.md
├── PRODUCT.md
├── TECH.md
└── CONNECTORS.md

```

---

# 12. Folder Responsibilities

| Folder | Responsibility |
|---------|----------------|
| controllers | Request handling |
| routes | REST API routes |
| services | Retrieval, RAG and Gemini integration |
| utils | Prompt builder, chunking and ranking utilities |
| components | React UI components |
| services (frontend) | API communication |
| styles | Application styling |

---

# 13. Error Handling

The backend validates incoming requests before initiating the retrieval pipeline.

Common handled scenarios include:

- empty topic
- unsupported topic
- Gemini timeout
- Gemini quota errors
- retrieval failures
- invalid responses

Meaningful error messages are returned to the frontend for display.

---

# 14. Future Improvements

The current architecture is intentionally lightweight while remaining extensible.

Potential future enhancements include:

- embedding-based retrieval
- vector databases (ChromaDB or Pinecone)
- semantic similarity search
- hybrid retrieval
- retrieval caching
- metadata-based ranking
- cross-encoder reranking
- streaming generation
- authenticated user accounts
- persistent course storage

---

# 15. Summary

The project implements a lightweight Retrieval-Augmented Generation pipeline that combines trusted technical retrieval with AI-assisted course generation.

The architecture separates retrieval, processing and generation into independent modules, making the application modular, maintainable and easy to extend.

The generated output is presented through a React-based interface with support for structured learning roadmaps, references, recommended learning order, and export options in both Markdown and PDF formats.

---

# 16. Design Decisions

Several architectural decisions were made during development to keep the implementation modular, maintainable and aligned with the project requirements.

### Lightweight RAG Architecture

Instead of using a vector database and embeddings, the project implements a lightweight Retrieval-Augmented Generation (RAG) pipeline. Trusted technical resources are retrieved through the Tavily Search API, processed and supplied to Gemini for grounded course generation.

This approach reduces implementation complexity while still improving response quality compared to direct prompting.

---

### Separation of Concerns

The application separates retrieval, processing and generation into independent modules.

Current responsibilities include:

| Component | Responsibility |
|-----------|----------------|
| mcpService.js | Retrieve trusted technical documents |
| retrievalUtils.js | Clean, chunk and rank retrieved content |
| promptBuilder.js | Construct structured prompts |
| ragService.js | Coordinate the retrieval pipeline |
| geminiService.js | Generate structured course JSON |

This modular design simplifies maintenance and allows future enhancements without affecting the overall architecture.

---

### Trusted Source Filtering

Only approved technical documentation and tutorial websites are considered during retrieval.

Filtering reduces noisy search results and helps improve the reliability of generated learning roadmaps.

---

### Structured Output

Gemini is instructed to return a predefined JSON schema instead of free-form text.

This enables the frontend to render:

- Course Overview
- Learning Objectives
- Beginner Modules
- Intermediate Modules
- Advanced Modules
- Learning Order
- References
- Suggested Reading
- Final Project

without requiring additional parsing logic.

---

# 17. Assumptions

The implementation is based on the following assumptions:

- Users provide software or technology-related topics.
- Trusted technical documentation is available through the retrieval connector.
- Gemini API returns valid JSON when supplied with appropriate context.
- Internet connectivity is available for external API calls.

---

# 18. Known Limitations

The current implementation intentionally focuses on assignment requirements.

Known limitations include:

- Retrieval quality depends on external search results.
- Chunk ranking is keyword-based rather than semantic.
- API response quality depends on the retrieved documents.
- Extremely niche technologies may have limited retrieved content.
- External API rate limits or temporary outages may affect generation.

These limitations do not affect the modular architecture and can be addressed through future enhancements.

---

# 19. Naming Conventions

| Component | Convention | Example |
|-----------|------------|---------|
| React Components | PascalCase | `CourseOverview.jsx` |
| Services | camelCase | `geminiService.js` |
| Controllers | camelCase | `courseController.js` |
| Routes | camelCase | `courseRoutes.js` |
| Utility Files | camelCase | `retrievalUtils.js` |
| Variables | camelCase | `learningObjectives` |
| Functions | camelCase | `generateCourseWithRAG()` |

---

# 20. Conclusion

The project successfully implements a lightweight AI-powered Course Generator based on Retrieval-Augmented Generation (RAG).

By combining trusted technical resource retrieval through the Tavily Search API with Gemini's structured content generation, the application produces organized learning roadmaps that include learning objectives, modular progression, recommended learning order, references and suggested reading resources.

The modular architecture separates retrieval, processing and generation, making the project maintainable, extensible and suitable for future enhancements such as semantic retrieval, vector databases and embedding-based search.

Overall, the implementation satisfies the project requirements by integrating a retrieval connector, constructing a RAG pipeline, minimizing hallucinations through grounded context, and providing a responsive frontend interface with export support for Markdown and PDF.
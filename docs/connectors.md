# MCP Connectors — Configuration & Limitations

This document describes the simple MCP-like connectors implemented for the CourseGenerator project, how to use them, supported sources, and limitations.

## Implemented connectors

1. MDN Connector (mdn)
   - Purpose: Search MDN Web Docs for the topic and fetch the top result's article content.
   - Search URL pattern: https://developer.mozilla.org/en-US/search?q={topic}
   - Extraction: HTML parsed with cheerio. Tries selectors: `article`, `#content`, `.main-content`.

2. freeCodeCamp Connector (freecodecamp)
   - Purpose: Search freeCodeCamp News for tutorial posts matching the topic and fetch the top result.
   - Search URL pattern: https://www.freecodecamp.org/news/search/?query={topic}
   - Extraction: HTML parsed with cheerio. Tries selectors: `.post-content`, `.entry-content`, `article`.

3. Generic URL fetch (generic)
   - Purpose: Fetch a specific URL and extract the main article/text block.
   - Restrictions: Only allowed hosts by default: `developer.mozilla.org`, `www.freecodecamp.org`, `raw.githubusercontent.com`, `medium.com`.
   - Use case: Useful for fetching raw README or documentation pages when a full URL is known.

## API Endpoint

POST /api/mcp/fetch

Request body (JSON):
- topic: string (optional if url provided)
- sources: array of source keys (e.g., ["mdn","freecodecamp"]). Default: ["mdn","freecodecamp"]
- url: string (optional) — fetch this URL directly (subject to allowlist)

Response: JSON with aggregated `results` per source. Each result contains either `{ url, text }` or `{ url, error }`.

Example curl:

curl -X POST http://localhost:5000/api/mcp/fetch -H "Content-Type: application/json" -d '{"topic":"react context"}'

## Configuration

- The connectors are implemented in `backend/src/services/mcpService.js`.
- Add or modify allowed hosts in the `allowedHosts` array in `fetchGenericUrl` for additional trusted domains.
- To support more sites, add a new connector function that performs a site-specific search and extraction pattern and wire it into `fetchContent`.

## Supported sources (current)
- MDN Web Docs (developer.mozilla.org)
- freeCodeCamp News (www.freecodecamp.org)
- Generic allowed hosts (see allowlist in code)

## Limitations & Notes

- This is a development-time, simplified MCP-like connector: it performs public HTML scraping of search and article pages. It is NOT a full production-grade MCP connector.
- HTML structures change frequently; selectors used (article, .post-content, .entry-content) are best-effort and may fail on some pages.
- Rate limiting, politeness (robots.txt) and caching are NOT implemented. For production use, respect robots.txt and rate limits, and add caching.
- Authentication-restricted content or dynamic JavaScript-rendered sites may not work since this implementation fetches raw HTML only.
- The allowlist prevents arbitrary URL fetching; if additional domains are required, add them explicitly.
- Error handling returns simple `{ url, error }` objects; consumers should handle partial failures.
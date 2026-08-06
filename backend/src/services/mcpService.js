const { tavily } = require("@tavily/core");

const {
    cleanText,
    topKChunks
} = require("../utils/retrievalUtils");

const tvly = tavily({
    apiKey: process.env.TAVILY_API_KEY
});

const BLOCKED_DOMAINS = [
    "facebook.com",
    "instagram.com",
    "twitter.com",
    "x.com",
    "linkedin.com",
    "tiktok.com",
    "pinterest.com"
];

function isAllowed(url) {

    try {

        const host = new URL(url).hostname;

        return !BLOCKED_DOMAINS.some(domain =>
            host === domain ||
            host.endsWith("." + domain)
        );

    } catch {

        return false;

    }

}

function normalizeTopic(topic) {

    const map = {

        "c++": "C++ Programming",
        "c": "C Programming",
        "js": "JavaScript",
        "ts": "TypeScript",
        "mern": "MERN Stack"

    };

    return map[topic.trim().toLowerCase()] || topic.trim();

}

async function fetchContent({ topic }) {

    console.log("========== TAVILY ==========");

    const searchTopic = normalizeTopic(topic);

    const response = await tvly.search(
        `${searchTopic} official documentation tutorial roadmap complete guide`,
        {
            searchDepth: "basic",
            maxResults: 5,
            includeRawContent: false
        }
    );

    const results = response.results || [];

    const documents = [];

    for (const result of results) {

        if (
            !result.url ||
            !result.content ||
            !isAllowed(result.url)
        ) {
            continue;
        }

        documents.push({

            title: result.title || "Untitled",

            url: result.url,

            source: new URL(result.url).hostname,

            content: cleanText(result.content)

        });

    }

    console.log(`Retrieved ${documents.length} documents`);

    return topKChunks(
        documents,
        searchTopic,
        3
    );

}

module.exports = {
    fetchContent
};
function cleanText(text) {

    if (!text)
        return "";

    return text
        .replace(/\s+/g, " ")
        .replace(/\n+/g, " ")
        .replace(/\t+/g, " ")
        .trim();

}

function chunkText(text, chunkSize = 700, overlap = 100) {

    if (!text)
        return [];

    const chunks = [];

    let start = 0;

    while (start < text.length) {

        const end = Math.min(
            start + chunkSize,
            text.length
        );

        chunks.push(
            text.slice(start, end)
        );

        start += (chunkSize - overlap);

    }

    return chunks;

}

function keywordScore(text, topic) {

    if (!text)
        return 0;

    const lower = text.toLowerCase();

    const keywords = topic
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);

    let score = 0;

    for (const word of keywords) {

        if (lower.includes(word))
            score += 10;

    }

    if (lower.includes("roadmap"))
        score += 5;

    if (lower.includes("beginner"))
        score += 4;

    if (lower.includes("intermediate"))
        score += 4;

    if (lower.includes("advanced"))
        score += 4;

    if (lower.includes("tutorial"))
        score += 3;

    if (lower.includes("guide"))
        score += 3;

    if (lower.includes("documentation"))
        score += 3;

    if (lower.includes("official"))
        score += 3;

    if (lower.includes("reference"))
        score += 2;

    if (lower.includes("course"))
        score += 2;

    if (lower.includes("learn"))
        score += 2;

    return score;

}

function topKChunks(documents, topic, k = 3) {

    const scored = [];

    for (const doc of documents) {

        const chunks = chunkText(doc.content);

        for (const chunk of chunks) {

            scored.push({

                title: doc.title,

                url: doc.url,

                source: doc.source,

                content: chunk,

                score: keywordScore(
                    chunk,
                    topic
                )

            });

        }

    }

    scored.sort(
        (a, b) => b.score - a.score
    );

    return scored.slice(0, k);

}

module.exports = {
    cleanText,
    chunkText,
    keywordScore,
    topKChunks
};
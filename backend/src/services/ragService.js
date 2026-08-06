const { fetchContent } = require("./mcpService");
const { buildCoursePrompt } = require("../utils/promptBuilder");
const { generateCourse } = require("./geminiService");

async function generateCourseWithRAG(topic) {

    const chunks = await fetchContent({
        topic
    });

    const context = chunks
        .map(chunk =>
            `
Title: ${chunk.title}

Source: ${chunk.url}

Content:
${chunk.content}
`
        )
        .join("\n\n-----------------------\n\n");

    const prompt = buildCoursePrompt(
        topic,
        context
    );

    return await generateCourse(prompt);

}

module.exports = {
    generateCourseWithRAG
};
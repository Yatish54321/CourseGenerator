const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";
const GEMINI_MAX_RETRIES = Number(process.env.GEMINI_MAX_RETRIES) || 3;
const GEMINI_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS) || 60000;

function isRetryableGeminiError(error) {
    const message = String(error?.message || error || "");

    return (
        message.includes("429") ||
        message.includes("RESOURCE_EXHAUSTED") ||
        message.includes("quota") ||
        message.includes("503") ||
        message.includes("500") ||
        message.includes("UNAVAILABLE") ||
        message.includes("INTERNAL") ||
        message.includes("fetch failed") ||
        message.includes("Headers Timeout Error") ||
        message.includes("UND_ERR_HEADERS_TIMEOUT") ||
        message.includes("temporarily busy") ||
        message.includes("timeout")
    );
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateCourse(prompt) {

    let text = "";
    let lastError = null;

    for (let attempt = 1; attempt <= GEMINI_MAX_RETRIES; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: GEMINI_MODEL,
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    httpOptions: {
                        timeout: GEMINI_TIMEOUT_MS,
                        retryOptions: {
                            maxRetries: 2
                        }
                    }
                }
            });

            console.log("========== GEMINI RESPONSE ==========");
            console.dir(response, { depth: null });

            text = response.text
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            return JSON.parse(text);
        }
        catch (err) {
            lastError = err;
            console.log("========== GEMINI ERROR ==========");
            console.error(err);

            if (text) {
                console.log("========== RAW GEMINI RESPONSE ==========");
                console.log(text);
            }

            const message = String(err?.message || err || "");
            const shouldRetry = isRetryableGeminiError(err) && attempt < GEMINI_MAX_RETRIES;

            if (shouldRetry) {
                const delayMs = 2000 * attempt;
                console.log(`Gemini retry ${attempt}/${GEMINI_MAX_RETRIES} in ${delayMs}ms`);
                await wait(delayMs);
                continue;
            }

            if (
                message.includes("429") ||
                message.includes("RESOURCE_EXHAUSTED") ||
                message.includes("quota")
            ) {
                throw new Error(
                    "Gemini API quota exceeded. Please wait a while or use another API key."
                );
            }

            if (
                message.includes("503") ||
                message.includes("UNAVAILABLE") ||
                message.includes("INTERNAL") ||
                message.includes("fetch failed") ||
                message.includes("timeout") ||
                message.includes("Headers Timeout Error") ||
                message.includes("UND_ERR_HEADERS_TIMEOUT")
            ) {
                throw new Error(
                    "Gemini API is temporarily busy or slow. Please retry after a short wait."
                );
            }

            throw err;
        }
    }

    throw lastError || new Error("Gemini API request failed");
}

module.exports = {
    generateCourse
};
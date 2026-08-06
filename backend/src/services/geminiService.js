const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function generateCourse(prompt) {

    let text = "";

    try {

        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: prompt
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

        console.log("========== GEMINI ERROR ==========");
        console.error(err);

        if (text) {

            console.log("========== RAW GEMINI RESPONSE ==========");
            console.log(text);

        }

        const message = err?.message || "";

        console.log(process.env.GEMINI_API_KEY.slice(0, 10));

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
            message.includes("UNAVAILABLE")
        ) {

            throw new Error(
                "Gemini API is temporarily busy. Please try again after a few seconds."
            );

        }

        throw err;

    }

}

module.exports = {
    generateCourse
};
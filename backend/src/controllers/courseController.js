const { generateCourseWithRAG } = require("../services/ragService");
const { isTechnicalTopic } =require("../utils/topicValidator");

async function generateCourse(req, res) {

    try {

        const { topic } = req.body;

        if (!topic) {
            return res.status(400).json({
                success: false,
                error: "Topic is required"
            });
        }

        console.log("Topic:", topic);
console.log("Technical:", isTechnicalTopic(topic));

        if(!isTechnicalTopic(topic)){

            return res.status(400).json({

                success:false,

                error:"Please enter a software role or technical topic."

            });

        }

        const course = await generateCourseWithRAG(topic);

        return res.status(200).json({
            success: true,
            topic,
            provider: "Gemini",
            message: "Course generated successfully",
            course
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            error: err.message || "Internal Server Error"
        });

    }

}

module.exports = {
    generateCourse
};
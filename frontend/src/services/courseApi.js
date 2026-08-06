import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 30000
});

export async function generateCourse(topic) {

    try {

        const response = await API.post(
            "/course/generate",
            { topic }
        );

        return response.data;

    } catch (err) {

        if (err.response) {

            throw new Error(
                err.response.data?.error ||
                "Server Error"
            );

        }

        if (err.code === "ECONNABORTED") {

            throw new Error(
                "Request timed out. Please try again."
            );

        }

        throw new Error(
            "Unable to connect to backend."
        );

    }

}
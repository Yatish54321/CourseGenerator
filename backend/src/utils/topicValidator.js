const KEYWORDS = [

    // Programming Languages
    "c", "c++", "c#", "java", "python", "javascript",
    "typescript", "go", "golang", "rust", "ruby",
    "php", "swift", "kotlin", "scala", "dart", "r",

    // Web
    "html", "css", "bootstrap", "tailwind", "sass",

    // Frontend
    "react", "next", "nextjs", "angular", "vue",
    "svelte", "redux", "vite",

    // Backend
    "node", "nodejs", "express", "nestjs",
    "spring", "spring boot", "django",
    "flask", "fastapi", "laravel",

    // Mobile
    "android", "ios", "flutter",
    "react native", "xamarin",

    // Databases
    "sql", "mysql", "postgresql",
    "mongodb", "redis", "firebase",
    "sqlite", "oracle", "sql server",

    // DevOps / Cloud
    "docker", "kubernetes", "aws",
    "azure", "gcp", "terraform",
    "ansible", "jenkins", "linux",
    "nginx", "apache",

    // Version Control
    "git", "github", "gitlab", "bitbucket",

    // APIs
    "rest", "rest api", "graphql",
    "grpc", "websocket",

    // AI / ML / LLM
    "ai",
    "artificial intelligence",
    "machine learning",
    "deep learning",
    "generative ai",
    "gen ai",
    "llm",
    "large language model",
    "rag",
    "agentic ai",
    "ai agents",
    "prompt engineering",
    "prompt tuning",
    "fine tuning",
    "embeddings",
    "vector database",
    "vector db",
    "langchain",
    "llamaindex",
    "hugging face",
    "transformers",
    "computer vision",
    "nlp",
    "reinforcement learning",
    "neural network",

    // Data
    "data science",
    "data analytics",
    "data analysis",
    "data engineering",
    "big data",
    "data warehouse",
    "etl",
    "elt",
    "airflow",
    "spark",
    "hadoop",
    "kafka",
    "snowflake",
    "power bi",
    "tableau",
    "excel",

    // MLOps
    "mlops",
    "model deployment",
    "model serving",
    "mlflow",
    "kubeflow",

    // Testing
    "testing",
    "manual testing",
    "automation testing",
    "unit testing",
    "integration testing",
    "selenium",
    "cypress",
    "jest",
    "junit",
    "playwright",
    "postman",
    "swagger",
    "openapi",

    // Security
    "cyber security",
    "ethical hacking",
    "penetration testing",
    "network security",

    // Architecture
    "system design",
    "design patterns",
    "microservices",

    // Core CS Subjects
    "oops",
    "oop",
    "object oriented programming",
    "dsa",
    "data structures",
    "algorithms",
    "operating system",
    "os",
    "computer networks",
    "cn",
    "dbms",
    "compiler design",
    "compiler",
    "computer architecture",
    "coa",
    "digital logic",
    "discrete mathematics",

    // Common Stacks
    "mern",
    "mean",
    "lamp",

    // Development Domains
    "frontend",
    "backend",
    "full stack",
    "web development",
    "software development",
    "software engineering",

    // Job Roles
    "software engineer",
    "software developer",
    "web developer",
    "frontend developer",
    "backend developer",
    "full stack developer",
    "full stack engineer",
    "python developer",
    "java developer",
    "react developer",
    "android developer",
    "ios developer",
    "data analyst",
    "data engineer",
    "data scientist",
    "machine learning engineer",
    "ai engineer",
    "llm engineer",
    "genai engineer",
    "ml engineer",
    "devops engineer",
    "cloud engineer",
    "qa engineer",
    "test engineer",
    "security engineer",
    "site reliability engineer",
    "sre",
    "database administrator",
    "dba",

    // Modern AI / Data Ecosystem
    "openai",
    "gemini",
    "claude",
    "mcp",
    "model context protocol",
    "langgraph",
    "crewai",
    "autogen",
    "ollama",
    "vllm",
    "huggingface",
    "prisma",
    "supabase",
    "tensorflow",
    "pytorch",
    "numpy",
    "pandas",
    "scikit-learn",
    "opencv",
    "rabbitmq",
    "elasticsearch",
    "redis streams",
    "kafka streams",
    "vector search"
];

function normalize(text) {

    return text
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

}

function escapeRegex(text) {

    return text.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );

}

function isTechnicalTopic(topic) {

    if (!topic || !topic.trim()) {
        return false;
    }

    const input = normalize(topic);

    for (const item of KEYWORDS) {

        const keyword = normalize(item);

        if (keyword.length <= 2) {

            if (input === keyword) {
                return true;
            }

            continue;

        }

        const regex = new RegExp(
            `(^|\\s|[-_/])${escapeRegex(keyword)}($|\\s|[-_/])`,
            "i"
        );

        if (regex.test(input)) {
            return true;
        }

    }

    return false;

}

module.exports = {
    isTechnicalTopic
};
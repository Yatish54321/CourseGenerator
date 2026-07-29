# Technical Design - Course Generator

-----

# 1. Technology Stack

## Frontend
- React.js (Vite)
- JavaScript (ES6+)
- Tailwind CSS
- React Router DOM
- Axios
- Framer Motion

## Backend
- Node.js
- Express.js

## Database
- MongoDB Atlas
- Mongoose

## Authentication
- JWT (JSON Web Token)
- bcrypt.js
- express-validator
- express-rate-limit

## AI & RAG
- Gemini API
- Model Context Protocol (MCP) Connectors
- Retrieval-Augmented Generation (RAG)
- ChromaDB (Vector Database)
- Gemini Embedding Model (text-embedding-004)

## Logging & Error Handling
- Morgan (request logging)
- Winston (application logging)
- Centralized Express error-handling middleware

## Testing
- Jest
- Supertest

## Development Tools
- Git
- GitHub
- VS Code
- Postman

## Deployment
- Frontend: Vercel
- Backend: Railway
- Database: MongoDB Atlas
- ChromaDB: Local (Development) / Cloud (Production)

----

# 2. System Architecture

The Course Generator follows a monolithic client-server architecture. The frontend is developed using React.js, while the backend is built with Node.js and Express.js. The backend manages authentication, REST APIs, business logic, AI integration, MCP-based content retrieval, and database operations. MongoDB Atlas stores application data, while ChromaDB is used for semantic retrieval in the RAG pipeline.

----

# 3. Database Design

The application uses MongoDB Atlas with Mongoose as the Object Data Modeling (ODM) library.

### Collections

### Users
- Stores user profile information and authentication details.

### Courses
- Stores generated courses, learning roadmap, modules, learning resources, metadata, embedding references (if applicable), and usage count.
- Existing courses are reused whenever possible to reduce unnecessary AI requests and improve response time.

### SavedCourses
- Stores courses bookmarked by authenticated users for future access.

-----

# 4. API Design

The backend exposes RESTful APIs for authentication, course generation, search, export, and course management.

### Authentication APIs
- POST `/api/auth/register` *(Public)*
- POST `/api/auth/login` *(Public)*

### Course APIs
- POST `/api/course/generate` *(Public)*
- GET `/api/course/:topic` *(Public)*
- GET `/api/course/search?q={query}` *(Public)*
- POST `/api/course/:id/regenerate` *(Protected)*

### Saved Course APIs
- GET `/api/saved-courses` *(Protected)*
- POST `/api/saved-courses` *(Protected)*
- DELETE `/api/saved-courses/:id` *(Protected)*

### Export APIs
- GET `/api/course/:id/export?format=pdf` *(Protected)*
- GET `/api/course/:id/export?format=markdown` *(Protected)*

------

# 5. Third-Party Integrations

| Service | Purpose |
|----------|---------|
| Gemini API | AI-powered course generation |
| MCP Connectors | Retrieve trusted learning resources |
| MongoDB Atlas | Cloud-hosted database |
| JWT | User authentication |
| pdfkit | Export generated roadmap as PDF |
| markdown-it | Export generated roadmap as Markdown |

---

# 6. AI Integrations

| Feature | Technology |
|----------|------------|
| Content Retrieval | MCP Connectors |
| Course Generation | Gemini API |
| Learning Roadmap Generation | Gemini API |
| Retrieval-Augmented Generation | RAG + ChromaDB |
| Semantic Search | Gemini Embedding Model + ChromaDB |
| Course Regeneration | Gemini API |

----

# 7. Authentication & Authorization

### Authentication
Users register and log in using their email and password. After successful authentication, the backend issues a JWT access token. This token is required to access all protected API endpoints.

For Version 1, a single short-lived JWT access token is used (no refresh token flow). Once the token expires, the user simply logs in again. This keeps the auth flow simple; a refresh-token mechanism can be added later if needed.

### Authorization
Authorization determines which operations a user is allowed to perform after authentication.

- Guests can search topics and generate courses.
- Authenticated users can save generated courses.
- Authenticated users can regenerate courses.
- Authenticated users can export courses in PDF or Markdown format.
- Protected endpoints require a valid JWT token before access is granted.

----


# 8. Security Requirements

- JWT-based authentication with token expiration
- Password hashing using bcrypt.js
- Request validation using express-validator
- API rate limiting using express-rate-limit
- Environment variables for storing API keys and secrets
- Secure MongoDB Atlas connection
- HTTPS in production
- Centralized error-handling middleware to avoid leaking internal error details
- Prevent unauthorized access to protected APIs

---

# 9. Performance Considerations

- Reuse previously generated courses whenever available.
- Generate AI responses only when required.
- Optimize MongoDB queries using indexing.
- Cache frequently searched topics where applicable.
- Use ChromaDB for efficient semantic retrieval.
- Lazy load frontend components to improve initial page load.
- Reduce unnecessary API requests by reusing existing course data.

-----

# 10. Processing Flow

1. User enters a learning topic.
2. The frontend sends the request to the backend.
3. The backend validates the request.
4. MongoDB is searched for an existing course.
5. If an existing course is found, it is returned immediately.
6. Otherwise, MCP Connectors retrieve trusted learning resources.
7. The RAG pipeline retrieves the most relevant context using ChromaDB.
8. Gemini API generates a structured learning roadmap.
9. The generated course is stored in MongoDB for future reuse.
10. The generated roadmap is returned to the frontend.
11. Authenticated users can save, regenerate, or export the generated course.

-----

# 11. Project Structure

The application follows a client-server architecture.

- **Frontend:** React.js application responsible for the user interface and user interactions.
- **Backend:** Express.js application responsible for REST APIs, authentication, AI integration, business logic, and database communication.
- **Database:** MongoDB Atlas stores users, generated courses, and saved courses.
- **Vector Database:** ChromaDB stores embeddings for semantic retrieval in the RAG pipeline.

----

# 12. Folder Structure

```text
CourseGenerator/

├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── db/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── tests/
│   │   ├── utils/
│   │   └── app.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── docs/
│
├── README.md
├── PRODUCT.md
└── TECH.md
```

----

 
# 13. Naming Conventions
 
| Type | Style | Example |
|------|-------|---------|
| React Components | PascalCase | `CourseCard.jsx`, `Navbar.jsx` |
| React Pages | PascalCase | `Home.jsx`, `Dashboard.jsx` |
| Controllers | camelCase + `Controller` | `authController.js` |
| Models | camelCase + `Model` | `userModel.js` |
| Services | camelCase + `Service` | `aiService.js` |
| Routes | camelCase + `Routes` | `authRoutes.js` |
| Variables | camelCase | `topicName`, `courseModules` |
| Functions | camelCase, descriptive | `generateCourse()`, `saveCourse()` |
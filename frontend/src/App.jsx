import React, { useState } from "react";

import "./styles/course.css";

import SearchBar from "./components/SearchBar";
import Loading from "./components/Loading";
import CourseOverview from "./components/CourseOverview";
import LearningObjectives from "./components/LearningObjectives";
import ModuleSection from "./components/ModuleSection";
import TopicHierarchy from "./components/TopicHierarchy";
import Resources from "./components/Resources";
import ExportButtons from "./components/ExportButtons";

import { generateCourse } from "./services/courseApi";

function App() {

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSearch(topic) {

        try {

            setLoading(true);
            setError("");
            setCourse(null);

            const data = await generateCourse(topic);

            setCourse(data.course);

        } catch (err) {

            console.error(err);

            setError(err.message);

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="container">

            <header className="hero">

                <h1>Course Generator</h1>

                <p>
                    Generate structured learning roadmaps using
                    Retrieval-Augmented Generation (RAG),
                    trusted documentation and Gemini.
                </p>

            </header>

            <SearchBar
                onSearch={handleSearch}
                loading={loading}
            />

            {loading && <Loading />}

            {error && (

                <div className="error">

                    {error}

                </div>

            )}

            {

                course && !loading && (

                    <>

                        <CourseOverview course={course} />

                        <LearningObjectives
                            objectives={course.learningObjectives}
                        />

                        <ModuleSection
                            title="Beginner"
                            modules={course.beginnerModules}
                        />

                        <ModuleSection
                            title="Intermediate"
                            modules={course.intermediateModules}
                        />

                        <ModuleSection
                            title="Advanced"
                            modules={course.advancedModules}
                        />

                        <TopicHierarchy
                            order={course.recommendedLearningOrder}
                        />

                        <Resources
                            course={course}
                        />

                        <ExportButtons
                            course={course}
                        />

                    </>

                )

            }

        </div>

    );

}

export default App;
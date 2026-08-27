import React, { useState } from "react";

import "./styles/course.css";

import SearchBar from "./components/SearchBar";
import Loading from "./components/Loading";
import CourseOverview from "./components/courseOverview";
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

            <nav className="topbar" aria-label="Main navigation">
                <a className="wordmark" href="/" aria-label="Course Generator home">
                    <span className="brand-mark">CG</span>
                    <span>course<span>craft</span></span>
                </a>
                <span className="status-chip"><i /> RAG-powered learning</span>
            </nav>

            <header className="hero">

                <div className="hero-topline">
                    <span>Build your learning path</span>
                </div>

                <h1>Course Generator</h1>

                <p>
                    Turn any technical topic into a focused learning path,
                    shaped by trusted documentation and Gemini.
                </p>

                <div className="hero-meta" aria-label="Course generator features">
                    <span><i /> Structured roadmaps</span>
                    <span><i /> Practical projects</span>
                    <span><i /> Curated resources</span>
                </div>

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

            {!course && !loading && !error && (
                <div className="empty-state">
                    <span className="empty-number">01</span>
                    <div>
                        <p className="empty-kicker">Start with a subject</p>
                        <h2>Your next skill is one prompt away.</h2>
                        <p>Choose a topic above and get a roadmap that moves from fundamentals to real-world confidence.</p>
                    </div>
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

import React,{ useEffect, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

function SearchBar({ onSearch, loading }) {

    const [topic, setTopic] = useState("");
    const [secondsLeft, setSecondsLeft] = useState(30);

    useEffect(() => {
        if (!loading) {
            setSecondsLeft(30);
            return undefined;
        }

        const timer = window.setInterval(() => {
            setSecondsLeft((seconds) => Math.max(0, seconds - 1));
        }, 1000);

        return () => window.clearInterval(timer);
    }, [loading]);

    function handleSubmit(e) {

        e.preventDefault();

        if (!topic.trim())
            return;

        onSearch(topic.trim());

    }

    return (

        <form
            className="search-form"
            onSubmit={handleSubmit}
        >

            <div className="search-field">
                <label htmlFor="course-topic">What do you want to learn?</label>
                <div className="input-wrap">
                    <FaMagnifyingGlass className="input-icon" aria-hidden="true" />
                    <input
                        id="course-topic"
                        type="text"
                        placeholder="Try React, Python, or system design"
                        value={topic}
                        onChange={(e) =>
                            setTopic(e.target.value)
                        }
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
            >

                {loading
                    ? <span>Building <strong>{secondsLeft}s</strong></span>
                    : <span>Generate course</span>}

            </button>

        </form>

    );

}

export default SearchBar;
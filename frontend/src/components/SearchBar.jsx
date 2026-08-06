import React,{ useState } from "react";
import { FaSearch } from "react-icons/fa";

function SearchBar({ onSearch, loading }) {

    const [topic, setTopic] = useState("");

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

            <input
                type="text"
                placeholder="Enter a topic (e.g. MERN, React, Python)"
                value={topic}
                onChange={(e) =>
                    setTopic(e.target.value)
                }
            />

            <button
                type="submit"
                disabled={loading}
            >

                <FaSearch />

                {loading
                    ? " Generating..."
                    : " Generate"}

            </button>

        </form>

    );

}

export default SearchBar;
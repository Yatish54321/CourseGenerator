import React from "react";

import { FaSpinner } from "react-icons/fa";

function Loading() {

    return (

        <div className="loading">

            <FaSpinner className="spinner" />

            <h3>Your course is taking shape</h3>

            <p>
                Finding trusted resources and arranging the best learning path.
            </p>

        </div>

    );

}

export default Loading;
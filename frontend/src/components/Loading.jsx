import React from "react";

import { FaSpinner } from "react-icons/fa";

function Loading() {

    return (

        <div className="loading">

            <FaSpinner className="spinner" />

            <h3>Generating Course...</h3>

            <p>
                Retrieving trusted resources and
                building your learning roadmap.
            </p>

        </div>

    );

}

export default Loading;
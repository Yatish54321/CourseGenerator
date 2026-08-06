import React from "react";

function LearningObjectives({ objectives }) {

    if (
        !objectives ||
        objectives === "Not Available" ||
        objectives.length === 0
    )
        return null;

    return (

        <section className="card">

            <h2>Learning Objectives</h2>

            <ul>

                {objectives.map((item, index) => (

                    <li key={index}>
                        {item}
                    </li>

                ))}

            </ul>

        </section>

    );

}

export default LearningObjectives;
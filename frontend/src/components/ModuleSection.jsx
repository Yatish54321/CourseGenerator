import React from "react";

function ModuleSection({ title, modules }) {

    if (!Array.isArray(modules))
        return null;

    const validModules = modules.filter(module => {

        if (!module)
            return false;

        if (
            module.title === "Not Available"
        )
            return false;

        if (
            !Array.isArray(module.topicsCovered)
        )
            return false;

        if (
            module.topicsCovered.length === 0
        )
            return false;

        if (
            module.topicsCovered.every(
                topic => topic === "Not Available"
            )
        )
            return false;

        return true;

    });

    if (validModules.length === 0)
        return null;

    return (

        <section className="card">

            <h2>{title} Modules</h2>

            <div className="modules-grid">

                {

                    validModules.map((module, index) => (

                        <div
                            className="module-card"
                            key={index}
                        >

                            <h3>{module.title}</h3>

                            <ul>

                                {

                                    module.topicsCovered.map((topic, i) => (

                                        <li key={i}>
                                            {topic}
                                        </li>

                                    ))

                                }

                            </ul>

                        </div>

                    ))

                }

            </div>

        </section>

    );

}

export default ModuleSection;
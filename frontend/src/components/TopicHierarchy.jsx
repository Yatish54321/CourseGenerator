import React from "react";

function TopicHierarchy({ order }) {

    if (
        !order ||
        order === "Not Available" ||
        order.length === 0
    )
        return null;

    return (

        <section className="card">

            <h2>Recommended Learning Order</h2>

            <ol>

                {

                    order.map((step, index) => (

                        <li key={index}>
                            {step}
                        </li>

                    ))

                }

            </ol>

        </section>

    );

}

export default TopicHierarchy;
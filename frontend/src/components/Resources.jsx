import React from "react";

function Resources({ course }) {

    return (

        <section className="card">

            <h2>References</h2>

            <ul>

                {

                    Array.isArray(course.references) &&

                    course.references.map((link, index) => (

                        <li key={index}>

                            <a
                                href={link}
                                target="_blank"
                                rel="noreferrer"
                            >

                                {link}

                            </a>

                        </li>

                    ))

                }

            </ul>

            {

                Array.isArray(
                    course.suggestedReadingResources
                ) && (

                    <>

                        <h2 style={{ marginTop: 25 }}>

                            Suggested Reading

                        </h2>

                        <ul>

                            {

                                course.suggestedReadingResources.map(

                                    (item, index) => (

                                        <li key={index}>

                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noreferrer"
                                            >

                                                {item.title}

                                            </a>

                                        </li>

                                    )

                                )

                            }

                        </ul>

                    </>

                )

            }

        </section>

    );

}

export default Resources;
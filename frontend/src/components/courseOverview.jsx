import React from "react";

function CourseOverview({ course }) {

    return (
        <section className="card">

            <h2>{course.courseTitle}</h2>

            <p>{course.introduction}</p>

            {course.finalProject &&
                course.finalProject !== "Not Available" && (

                    <>
                        <h3>Final Project</h3>

                        <p>{course.finalProject}</p>
                    </>

                )}

        </section>
    );

}

export default CourseOverview;
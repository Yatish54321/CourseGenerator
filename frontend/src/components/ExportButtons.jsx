import React from "react";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function ExportButtons({ course }) {

            const fileName = (
            course?.courseTitle &&
            course.courseTitle !== "Not Available"
                ? course.courseTitle
                : "Generated_Course"
        )
        .replace(/[^\w\s+-]/g, "")
        .replace(/\s+/g, "_");

    function exportMarkdown() {

        let markdown = `# ${course.courseTitle}\n\n`;

        markdown += `## Introduction\n\n${course.introduction}\n\n`;

        markdown += `## Learning Objectives\n\n`;

        (course.learningObjectives || []).forEach(item => {
            markdown += `- ${item}\n`;
        });

        function writeModules(title, modules) {

            if (
                !modules ||
                modules === "Not Available" ||
                !Array.isArray(modules)
            )
                return;

            markdown += `\n## ${title}\n\n`;

            modules.forEach(module => {

                markdown += `### ${module.title}\n`;

                (module.topicsCovered || []).forEach(topic => {
                    markdown += `- ${topic}\n`;
                });

                markdown += `\n`;

            });

        }

        writeModules(
            "Beginner Modules",
            course.beginnerModules
        );

        writeModules(
            "Intermediate Modules",
            course.intermediateModules
        );

        writeModules(
            "Advanced Modules",
            course.advancedModules
        );

        markdown += `\n## Recommended Learning Order\n\n`;

        (course.recommendedLearningOrder || []).forEach(step => {
            markdown += `1. ${step}\n`;
        });

        markdown += `\n## References\n\n`;

        (course.references || []).forEach(ref => {
            markdown += `- ${ref}\n`;
        });

        markdown += `\n## Suggested Reading\n\n`;

        (course.suggestedReadingResources || []).forEach(item => {

            markdown += `- ${item.title} : ${item.url}\n`;

        });

        markdown += `\n## Final Project\n\n`;

        markdown += `${course.finalProject}\n`;

        const blob = new Blob(
            [markdown],
            {
                type: "text/markdown"
            }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = `${fileName}.md`;

        link.click();

        URL.revokeObjectURL(url);

    }

    async function exportPDF() {

        const element =
            document.querySelector(".container");

        const canvas =
            await html2canvas(element, {

                scale: 2,

                useCORS: true

            });

        const pdf =
            new jsPDF("p", "mm", "a4");

        const width = 190;

        const height =
            canvas.height *
            width /
            canvas.width;

        pdf.addImage(
            canvas.toDataURL("image/png"),
            "PNG",
            10,
            10,
            width,
            height
        );

        pdf.save(`${fileName}.pdf`);

    }

    return (

        <div className="export-buttons">

            <button
                onClick={exportMarkdown}
            >
                Export Markdown
            </button>

            <button
                onClick={exportPDF}
            >
                Export PDF
            </button>

        </div>

    );

}

export default ExportButtons;
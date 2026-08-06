export function exportMarkdown(course) {

    const fileName = course.courseTitle
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, "_");

    let markdown = `# ${course.courseTitle}\n\n`;

    markdown += `${course.introduction}\n\n`;

    markdown += `## Learning Objectives\n`;

    course.learningObjectives?.forEach(item => {
        markdown += `- ${item}\n`;
    });

    markdown += `\n## References\n`;

    course.references?.forEach(item => {
        markdown += `- ${item}\n`;
    });

    const blob = new Blob(
        [markdown],
        { type: "text/markdown" }
    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = `${fileName}.md`;

    link.click();

}
import jsPDF from "jspdf";

export async function exportPDF(course) {

    const fileName = course.courseTitle
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, "_");

    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(20);

    doc.text(course.courseTitle, 15, y);

    y += 15;

    doc.setFontSize(12);

    doc.text(
        doc.splitTextToSize(
            course.introduction || "",
            180
        ),
        15,
        y
    );

    y += 30;

    doc.setFontSize(16);

    doc.text("Learning Objectives", 15, y);

    y += 10;

    doc.setFontSize(12);

    course.learningObjectives?.forEach(item => {

        doc.text(`• ${item}`, 20, y);

        y += 8;

    });

    doc.save(`${fileName}.pdf`);

}
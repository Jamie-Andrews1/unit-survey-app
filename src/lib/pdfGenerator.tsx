// src/utils/pdfGenerator.ts
import autoTable from "jspdf-autotable";
import { SealedUnit } from "./Types";
import { GLAZING_SCHEMA, SPACER_SCHEMA } from "./const";

export const generateSurveyPDF = async (surveys: SealedUnit[]) => {
  if (surveys.length === 0) return;

  if (typeof window !== "undefined") {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleDateString();

    // Header & Branding
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235); // Blue
    doc.text("Sealed Unit Survey Report", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${timestamp}`, 14, 28);
    doc.text(`Total Units: ${surveys.length}`, 14, 33);

    // Table Generation
    autoTable(doc, {
      startY: 40,
      head: [
        ["Ref", "Width (mm)", "Height (mm)", "Pattern", "Glazing", "Spacer"],
      ],
      body: surveys.map((u) => [
        u.ref || "No Ref",
        u.width,
        u.height,
        u.pattern.patternId ?? "Clear",
        GLAZING_SCHEMA[u.glazing],
        SPACER_SCHEMA[u.spacer],
      ]),
      theme: "striped",
      headStyles: { fillColor: [37, 99, 235] },
      margin: { top: 40 },
    });

    // Save the file
    doc.save(`survey_report_${new Date().getTime()}.pdf`);
  }
};

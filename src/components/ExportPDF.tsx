"use client";

import jsPDF from "jspdf";
import "jspdf-autotable";

const ExportPDF = () => {
  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // ✅ Title (Centered)
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = "  DOE-ACCREDITED BIOETHANOL MANUFACTURER’S MONTHLY REPORT";
    const textWidth = doc.getTextWidth(title);
    const xPosition = (pageWidth - textWidth) / 2;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(title, xPosition, 15);

    // ✅ Company Information
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Company Name: ___________________________", 14, 30);
    doc.text("Accreditation Code/Number: ___________________________", 14, 35);
    doc.text("For the month of: ________    Year: ________", 14, 40);
    doc.text("Selling Price Range (Pesos per Liter): Php ___________", 14, 45);

    // ✅ Feedstock Section with Checkboxes
    doc.text("Feedstock:", 14, 50);
    doc.rect(35, 47, 3, 3);
    doc.text("Sugarcane", 40, 50);
    doc.rect(65, 47, 3, 3);
    doc.text("Molasses", 70, 50);
    doc.rect(95, 47, 3, 3);
    doc.text("Cassava", 100, 50);
    doc.rect(125, 47, 3, 3);
    doc.text("Sweet Sorghum", 130, 50);
    doc.text("Others, please specify: ______________________", 14, 55);

    doc.text(
      "Price of Feedstock (Pesos per Metric Ton): Php __________",
      14,
      60
    );
    doc.text("Source of Feedstock: ___________________________", 14, 65);
    doc.text("Molasses / Sugarcane Used: ____________________", 14, 70);
    doc.text("Molasses / Sugarcane Stock: ____________________", 14, 75);

    let finalY = 80;

    // ✅ Beginning Inventory Table
    doc.setFont("helvetica", "bold");
    doc.text(
      "A. BEGINNING INVENTORY (Ending Inventory of Previous Month)",
      14,
      finalY + 5
    );
    (doc as any).autoTable({
      startY: finalY + 10,
      head: [["Particulars", "Volume (liters)"]],
      body: [
        ["Previous Stock", ""],
        ["Current Stock", ""],
        ["Total", ""],
      ],
      theme: "grid",
      headStyles: { fillColor: [200, 200, 200], textColor: 0 }, // Light gray background for headers
    });
    finalY = (doc as any).lastAutoTable.finalY;

    // ✅ Production Table
    doc.text("B. PRODUCTION", 14, finalY + 10);
    (doc as any).autoTable({
      startY: finalY + 15,
      head: [["Production Type", "Volume (liters)"]],
      body: [
        ["Batch 1", ""],
        ["Batch 2", ""],
        ["Total Production", ""],
      ],
      theme: "grid",
      headStyles: { fillColor: [200, 200, 200], textColor: 0 }, // Light gray b
    });
    finalY = (doc as any).lastAutoTable.finalY;

    // ✅ Move to New Page for Additional Sections
    // ✅ Sales Table
    doc.text("C. SALES", 14, finalY + 10);
    (doc as any).autoTable({
      startY: finalY + 15,
      head: [
        [
          "Customer",
          "Region",
          "Purchase Invoice No.",
          "Actual Volume Lifted (Liters)",
          "Date Lifted",
        ],
      ],
      body: [
        ["Company A", "Luzon", "INV-001", "", ""],
        ["Company B", "Visayas", "INV-002", "", ""],
      ],
      theme: "grid",
      headStyles: { fillColor: [200, 200, 200], textColor: 0 }, // Light gray b
    });
    finalY = (doc as any).lastAutoTable.finalY;

    doc.text("REMAINING VOLUME FOR LIFTING", 14, finalY + 10);
    (doc as any).autoTable({
      startY: finalY + 15,
      head: [
        ["Customer", "Volume (liters)", "Schedule Date of Lifting", "Remarks"],
      ],
      body: [
        ["Company A", "Luzon", "INV-001", "", ""],
        ["Company B", "Visayas", "INV-002", "", ""],
      ],
      theme: "grid",
      headStyles: { fillColor: [200, 200, 200], textColor: 0 }, // Light gray b
    });
    finalY = (doc as any).lastAutoTable.finalY;

    // ✅ Move to New Page for Additional Sections
    // ✅ Ending Inventory Table
    doc.text(
      "D. ENDING INVENTORY (Beginning Inventory + Production - Sales)",
      14,
      finalY + 10
    );
    (doc as any).autoTable({
      startY: finalY + 15,
      head: [["Particulars", "Volume (liters)"]],
      body: [
        ["Remaining Stock", ""],
        ["Final Total", ""],
      ],
      theme: "grid",
      headStyles: { fillColor: [200, 200, 200], textColor: 0 }, // Light gray b
    });
    finalY = (doc as any).lastAutoTable.finalY;

    doc.addPage();
    // ✅ Projected Monthly Production Table
    finalY = 15;
    doc.text(
      "E. PROJECTED MONTHLY PRODUCTION (Until Year-end*)",
      14,
      finalY + 10
    );
    (doc as any).autoTable({
      startY: finalY + 15,
      head: [["Month", "Volume (liters)"]],
      body: [
        ["January", ""],
        ["February", ""],
        ["March", ""],
        ["April", ""],
        ["May", ""],
        ["June", ""],
        ["July", ""],
        ["August", ""],                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
        ["September", ""],
        ["October", ""],
        ["November", ""],
        ["December", ""],
      ],
      theme: "grid",
      headStyles: { fillColor: [200, 200, 200], textColor: 0 }, // Light gray b
    });
    finalY = (doc as any).lastAutoTable.finalY;

    // ✅ Outstanding Orders Table
    doc.text("F. OUTSTANDING ORDERS", 14, finalY + 10);
    (doc as any).autoTable({
      startY: finalY + 15,
      head: [["Customer", "Volume (liters)", "Date of Lifting"]],
      body: [
        ["Company X", "", ""],
        ["Company Y", "", ""],
      ],
      theme: "grid",
      headStyles: { fillColor: [200, 200, 200], textColor: 0 }, // Light gray b
    });
    finalY = (doc as any).lastAutoTable.finalY;

    // ✅ Plant Shutdown Table
    doc.text("G. PLANT SHUTDOWN", 14, finalY + 10);
    (doc as any).autoTable({
      startY: finalY + 15,
      head: [["Duration (days)", "Remarks"]],
      body: [
        ["", ""],
        ["", ""],
      ],
      theme: "grid",
      headStyles: { fillColor: [200, 200, 200], textColor: 0 }, // Light gray b
    });
    finalY = (doc as any).lastAutoTable.finalY;

    // ✅ Equipment Breakdown Table
    doc.text("H. EQUIPMENT BREAKDOWN", 14, finalY + 10);
    (doc as any).autoTable({
      startY: finalY + 15,
      head: [
        [
          "Unit/Equipment",
          "Duration (days)",
          "Causes",
          "Actions Done",
          "Production Interrupted? (If Yes, No. of Days)",
        ],
      ],
      body: [
        ["Machine 1", "", "", "", ""],
        ["Machine 2", "", "", "", ""],
      ],
      theme: "grid",
      headStyles: { fillColor: [200, 200, 200], textColor: 0 }, // Light gray b
    });
    finalY = (doc as any).lastAutoTable.finalY;

    finalY += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Submitted by:", 14, finalY);
    doc.line(42, finalY, 120, finalY); // Aligned underline
    doc.setFont("helvetica", "normal");
    doc.text("Printed Name & Signature", 50, finalY + 5);

    doc.setFont("helvetica", "bold");
    doc.text("Date Submitted:", 135, finalY);
    doc.line(170, finalY, 200, finalY); // Properly aligned date underline

    finalY += 15;
    doc.setFont("helvetica", "bold");
    doc.text("Position/Designation:", 14, finalY);
    doc.line(55, finalY, 120, finalY); // Correctly aligned designation underline

    // ✅ Confidentiality Notice with Proper Formatting
    finalY += 15;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.text(
      "After completing this questionnaire, please send to Director Mylene C. Capongcol of the Renewable Energy Management Bureau,",
      14,
      finalY
    );
    doc.text(
      "Department of Energy through mail, fax (telefax 8840-2107), and/or email to remb9513@gmail.com / rubydugzman@yahoo.com ",
      14,
      finalY + 5
    );
    doc.text(
      "/ remb.biomass@doe.gov.ph. The DOE assures confidentiality of submitted data. Report should be submitted on or before the 15th of the following month.",
      14,
      finalY + 10
    );

    // ✅ Convert PDF to Blob and Open in New Tab
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank"); // ✅ Opens in a new tab instead of downloading
  };
  return (
    <button
      onClick={generatePDF}
      className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 flex items-center space-x-2"
    >
      👀 <span>Preview PDF</span>
    </button>
  );
};

export default ExportPDF;

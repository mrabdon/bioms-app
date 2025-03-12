"use client"; // Ensure it's a Client Component

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface ExportExcelProps {
  data: any[];
  fileName?: string;
}

const ExportExcel: React.FC<ExportExcelProps> = ({
  data,
  fileName = "Export",
}) => {
  const exportToExcel = () => {
    if (!data || data.length === 0) {
      alert("No data to export!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${fileName}.xlsx`);
  };

  return (
    <button
      onClick={exportToExcel}
      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
    >
      📊 Export to Excel
    </button>
  );
};

export default ExportExcel;

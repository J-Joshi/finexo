import React, { useState } from "react";
import Pagination from "./Pagination";
import { toast } from "react-toastify";
import axios from "axios";

const DataPreview = ({ sheets, setSheets, errors }) => {
  const [selectedSheet, setSelectedSheet] = useState(Object.keys(sheets)[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Identify invalid rows based on errors
  const invalidRowIndexes = errors
    .filter((error) => error.sheet === selectedSheet)
    .map((error) => error.row - 2);

  // Get only valid rows for import
  const validRows = sheets[selectedSheet].filter(
    (_, index) => !invalidRowIndexes.includes(index)
  );

  // Handle Import to Backend
  const handleImport = async () => {
    if (validRows.length === 0) {
      toast.error("No valid data to import.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/files/import", {
        data: validRows,
      });
      toast.success("Data imported successfully!");
    } catch (error) {
      toast.error("Error importing data.");
    }
  };

  // Handle Row Deletion
  const handleDeleteRow = (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this row?"
    );
    if (!confirmDelete) return;

    const updatedSheetData = [...sheets[selectedSheet]];
    updatedSheetData.splice(index, 1); // Remove row from the array

    setSheets((prevSheets) => ({
      ...prevSheets,
      [selectedSheet]: updatedSheetData,
    }));

    toast.success("Row deleted successfully!");
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-3">Data Preview</h2>

      {/* Dropdown for selecting sheet */}
      <select
        value={selectedSheet}
        onChange={(e) => {
          setSelectedSheet(e.target.value);
          setCurrentPage(1);
        }}
        className="mb-4 p-2 border rounded"
      >
        {Object.keys(sheets).map((sheet) => (
          <option key={sheet} value={sheet}>
            {sheet}
          </option>
        ))}
      </select>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              {Object.keys(sheets[selectedSheet][0] || {}).map((header) => (
                <th key={header} className="border p-2">
                  {header}
                </th>
              ))}
              <th className="border p-2">Actions</th>{" "}
              {/* ✅ Actions Column for Delete */}
            </tr>
          </thead>
          <tbody>
            {sheets[selectedSheet]
              .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
              .map((row, idx) => {
                const rowIndex = (currentPage - 1) * rowsPerPage + idx;
                return (
                  <tr
                    key={idx}
                    className={`border ${
                      invalidRowIndexes.includes(rowIndex) ? "bg-red-100" : ""
                    }`}
                  >
                    {Object.keys(row).map((key, i) => (
                      <td key={i} className="border p-2">
                        {row[key]}
                      </td>
                    ))}
                    {/* 🗑 Delete Button */}
                    {!invalidRowIndexes.includes(rowIndex) && (
                      <td className="border p-2 text-center">
                        <button
                          onClick={() => handleDeleteRow(rowIndex)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          🗑 Delete
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(sheets[selectedSheet].length / rowsPerPage)}
        onPageChange={setCurrentPage}
      />

      {/* ✅ Import Button (only if valid rows exist) */}
      {validRows.length > 0 && (
        <button
          onClick={handleImport}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Import Valid Data
        </button>
      )}
    </div>
  );
};

export default DataPreview;

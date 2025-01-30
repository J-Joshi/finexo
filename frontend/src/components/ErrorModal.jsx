import React, { useState } from "react";

const ErrorModal = ({ isOpen, errors, onClose }) => {
  if (!isOpen || !errors || errors.length === 0) return null;

  const [selectedSheet, setSelectedSheet] = useState(errors[0]?.sheet);
  const sheetsWithErrors = [...new Set(errors.map((error) => error.sheet))];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-3/4 max-w-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">❌ Validation Errors</h2>

        {/* Tabs for Sheets */}
        <div className="flex border-b mb-3 space-x-2">
          {sheetsWithErrors.map((sheet) => (
            <button
              key={sheet}
              className={`px-4 py-2 text-sm font-medium ${
                selectedSheet === sheet
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setSelectedSheet(sheet)}
            >
              {sheet}
            </button>
          ))}
        </div>

        {/* Error List for Selected Sheet */}
        <div className="max-h-60 overflow-y-auto">
          {errors
            .filter((error) => error.sheet === selectedSheet)
            .map((error, idx) => (
              <div key={idx} className="p-2 border-b">
                <p className="text-sm font-semibold">🚨 Row {error.row}:</p>
                <ul className="text-sm text-red-600 list-disc pl-5">
                  {error.issues.map((issue, i) => (
                    <li key={i}>⚠ {issue}</li>
                  ))}
                </ul>
              </div>
            ))}
        </div>

        {/* Close Button */}
        <button
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;

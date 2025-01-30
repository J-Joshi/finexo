import React, { useState } from "react";
import FileUpload from "../components/FileUpload";
import DataPreview from "../components/DataPreview";
import ErrorModal from "../components/ErrorModal";
import { toast } from "react-toastify";
import axios from "axios";

const Home = () => {
  const [sheets, setSheets] = useState(null);
  const [errors, setErrors] = useState([]);
  const [errorModalOpen, setErrorModalOpen] = useState(false);

  const handleFileUpload = (data) => {
    console.log("📥 Backend Response:", data);

    setSheets(data.data); // ✅ Always update sheets with valid data

    if (data.errors && data.errors.length > 0) {
      console.log("❌ Validation Errors:", data.errors);
      setErrors(data.errors);
      setErrorModalOpen(true);
    } else {
      setErrors([]);
      setErrorModalOpen(false);
      toast.success("File uploaded successfully!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        Excel Data Importer
      </h1>

      <FileUpload onFileUpload={handleFileUpload} />

      {/* ✅ Error Modal */}
      {errorModalOpen && (
        <ErrorModal
          isOpen={errorModalOpen}
          errors={errors}
          onClose={() => setErrorModalOpen(false)}
        />
      )}

      {/* ✅ Always show valid data even if there are errors */}
      {sheets && Object.keys(sheets).length > 0 ? (
        <DataPreview sheets={sheets} setSheets={setSheets} errors={errors} />
      ) : (
        <p className="text-center text-gray-500">
          No data to display. Upload a file.
        </p>
      )}
    </div>
  );
};

export default Home;

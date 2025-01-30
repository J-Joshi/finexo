import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "react-toastify";

const FileUpload = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".xlsx",
    maxSize: 2 * 1024 * 1024, // 2MB limit
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
  });

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/files/upload",
        formData
      );
      toast.success("File uploaded successfully!");
      onFileUpload(response.data);
    } catch (error) {
      toast.error("Error uploading file");
    }
  };

  return (
    <div className="p-4 border-2 border-dashed rounded-lg">
      <div
        {...getRootProps()}
        className="cursor-pointer p-4 bg-gray-200 text-center"
      >
        <input {...getInputProps()} />
        <p>Drag & Drop an .xlsx file here or click to select</p>
      </div>
      {file && <p className="mt-2 text-sm">{file.name}</p>}
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleUpload}
      >
        Upload
      </button>
    </div>
  );
};

export default FileUpload;

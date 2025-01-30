import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center space-x-4 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded ${
          currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
        }`}
      >
        Previous
      </button>

      <span className="text-lg font-semibold">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`px-4 py-2 rounded ${
          currentPage >= totalPages ? "bg-gray-300" : "bg-blue-500 text-white"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

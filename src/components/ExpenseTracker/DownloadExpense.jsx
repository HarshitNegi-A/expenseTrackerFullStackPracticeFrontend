import React, { useState } from "react";
import axios from "axios";
import BASE_URL from "../../utils/api"; // ✅ use central base url

export const DownloadExpense = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleDownload = async () => {
    try {
      setLoading(true);
      setFileUrl(null);

      const response = await axios.get(`${BASE_URL}/expense/download`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ send JWT token
        },
      });

      setFileUrl(response.data.fileUrl); // ✅ S3 file URL
    } catch (err) {
      console.error("Download error:", err.response?.data || err.message);
      alert("Error downloading expenses");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-2xl border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Download Your Expenses
      </h2>

      <button
        onClick={handleDownload}
        disabled={loading}
        className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-md"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
              ></path>
            </svg>
            Generating...
          </span>
        ) : (
          "Download Expense"
        )}
      </button>

      {fileUrl && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-green-700 font-medium mb-2">
            ✅ Your file is ready:
          </p>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-semibold hover:underline break-all"
          >
            {fileUrl}
          </a>
        </div>
      )}
    </div>
  );
};

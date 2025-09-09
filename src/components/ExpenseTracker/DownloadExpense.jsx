import React, { useState } from "react";
import axios from "axios";
import BASE_URL from "../../utils/api"; // ✅ use central base url

export const DownloadExpense = () => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleDownload = async () => {
    try {
      setLoading(true);

      // Step 1: Get presigned S3 URL from backend
      const response = await axios.get(`${BASE_URL}/expense/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fileUrl = response.data.fileUrl;
      if (!fileUrl) {
        alert("No file URL received from server.");
        return;
      }

      // Step 2: Fetch file as Blob
      const fileRes = await axios.get(fileUrl, { responseType: "blob" });

      // Step 3: Create blob URL and trigger download
      const blob = new Blob([fileRes.data], { type: "text/plain" });
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "expenses-report.txt"; // ✅ final filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      window.URL.revokeObjectURL(blobUrl);
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
    </div>
  );
};

import React, { useState } from "react";
import axios from "axios";
import BASE_URL from "../../utils/api"; // ✅ use central base url

export const DownloadExpense = () => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

 const handleDownload = async () => {
  try {
    setLoading(true);
    const res = await axios.get(`${BASE_URL}/expense/download`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const fileUrl = res.data.fileUrl;
    if (!fileUrl) throw new Error("No fileUrl");

    // Try blob fetch (requires S3 CORS)
    try {
      const fileRes = await axios.get(fileUrl, { responseType: "blob" });
      const contentDisposition = fileRes.headers["content-disposition"];
      let filename = "expenses-report.txt";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename\*?=UTF-8''(.+)|filename="?([^"]+)"?/);
        if (match) filename = decodeURIComponent(match[1] || match[2]);
      } else {
        const parts = fileUrl.split("/");
        filename = parts[parts.length - 1].split("?")[0] || filename;
      }

      const blob = new Blob([fileRes.data], { type: fileRes.data.type || "text/plain" });
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
      return;
    } catch (xhrErr) {
      console.warn("Blob fetch failed (likely CORS). Falling back to navigation:", xhrErr);
      // Fallback: open presigned URL directly — no CORS required for navigation
      const newWindow = window.open(fileUrl, "_blank", "noopener,noreferrer");
      if (!newWindow) window.location.assign(fileUrl);
    }
  } catch (err) {
    console.error("Download error:", err);
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

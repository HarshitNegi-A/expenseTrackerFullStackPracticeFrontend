import React, { useState, useContext } from "react";
import axios from "axios";
import UserContext from "../context/user-context"; // context for token

export const DownloadExpense = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
const token = localStorage.getItem("token");
  const handleDownload = async () => {
    try {
      setLoading(true);
      setFileUrl(null);

      const response = await axios.get("http://localhost:3000/expense/download", {
        headers: {
          Authorization: `Bearer ${token}`, // send JWT token
        },
      });

      setFileUrl(response.data.fileUrl); // S3 file URL
    } catch (err) {
      console.error(err);
      alert("Error downloading expenses");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleDownload}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Generating..." : "Download Expense"}
      </button>

      {fileUrl && (
        <div className="mt-4">
          <p className="text-green-600 font-medium">Your file is ready:</p>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {fileUrl}
          </a>
        </div>
      )}
    </div>
  );
};

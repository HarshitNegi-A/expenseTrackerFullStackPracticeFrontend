import React, { useState } from "react";

const ReportGeneration = ({ expenseList }) => {
  const [filter, setFilter] = useState("all"); // all, daily, weekly, monthly
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Dynamic

  // Helper: get start date for filter
  const getStartDate = () => {
    const now = new Date();
    if (filter === "daily") {
      now.setHours(0, 0, 0, 0);
      return now;
    }
    if (filter === "weekly") {
      const day = now.getDay(); // 0=Sunday
      now.setDate(now.getDate() - day);
      now.setHours(0, 0, 0, 0);
      return now;
    }
    if (filter === "monthly") {
      now.setDate(1);
      now.setHours(0, 0, 0, 0);
      return now;
    }
    return null; // all
  };

  const startDate = getStartDate();

  // Filter expenses
  const filteredExpenses = expenseList.filter((expense) => {
    if (!startDate) return true;
    const expenseDate = new Date(expense.createdAt);
    return expenseDate >= startDate;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredExpenses.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Change items per page
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to page 1
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
      <h1 className="text-2xl font-extrabold mb-6 text-gray-800 border-b pb-2">
        📊 Expense Report
      </h1>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6">
        {["all", "daily", "weekly", "monthly"].map((type) => (
          <button
            key={type}
            onClick={() => {
              setFilter(type);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
              filter === type
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Items Per Page Selector */}
      <div className="mb-6 flex items-center">
        <label className="mr-3 font-semibold text-gray-700">Items per page:</label>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[5, 10, 15, 20].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* Expense List */}
      <ul className="space-y-4">
        {currentItems.map((expense) => (
          <li
            key={expense.id}
            className="border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gray-50"
          >
            <p className="text-lg font-semibold text-blue-700">
              💰 Amount: ₹{expense.amount}
            </p>
            <p className="text-gray-700">
              <strong>Category:</strong> {expense.category}
            </p>
            <p className="text-gray-600">
              <strong>Description:</strong> {expense.description}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Date:</strong>{" "}
              {new Date(expense.createdAt).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => goToPage(index + 1)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportGeneration;

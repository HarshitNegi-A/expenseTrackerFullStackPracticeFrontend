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
    <div>
      <h1 className="text-xl font-bold mb-4">Expense Report</h1>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-4">
        {["all", "daily", "weekly", "monthly"].map((type) => (
          <button
            key={type}
            onClick={() => {
              setFilter(type);
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded ${
              filter === type ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Items Per Page Selector */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Items per page:</label>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="border p-1 rounded"
        >
          {[5, 10, 15, 20].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* Expense List */}
      <ul>
        {currentItems.map((expense) => (
          <li key={expense.id} className="border p-2 mb-2 rounded">
            <p><strong>Amount:</strong> ₹{expense.amount}</p>
            <p><strong>Category:</strong> {expense.category}</p>
            <p><strong>Description:</strong> {expense.description}</p>
            <p><strong>Date:</strong> {new Date(expense.createdAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => goToPage(index + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportGeneration;

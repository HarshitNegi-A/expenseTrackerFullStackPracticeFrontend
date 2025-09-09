import React, { useEffect, useState } from "react";
import ExpenseList from "./ExpenseList";
import axios from "axios";
import BASE_URL from "../../utils/api"; // ✅ central base url

const ExpenseForm = ({ expenseList, setExpenseList }) => {
  const [category, setCategory] = useState([
    "None",
    "Food",
    "Petrol",
    "Salary",
  ]);
  const token = localStorage.getItem("token");
  const [newCat, setNewCat] = useState("");

  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "None",
  });

  // ✅ Fetch expenses
  const fetchExpense = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/expense`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenseList(res.data.expenses);
    } catch (err) {
      console.error("Fetch expense error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchExpense();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Add category
  const handleAddCategory = () => {
    if (newCat === "") {
      alert("Add a valid category");
      return;
    }
    if (!category.includes(newCat)) {
      setCategory([...category, newCat]);
      setNewCat("");
    } else {
      alert("Category already included");
    }
  };

  // ✅ Add expense
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !formData.amount ||
        !formData.description ||
        !formData.category ||
        formData.category === "None"
      ) {
        alert("Fill all the fields");
        return;
      }

      await axios.post(`${BASE_URL}/expense/add-expense`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchExpense();

      setFormData({
        amount: "",
        description: "",
        category: "None",
      });
    } catch (err) {
      console.error("Add expense error:", err.response?.data || err.message);
    }
  };

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Add Expense
      </h3>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="col-span-1 md:col-span-1">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              required
              name="amount"
              onChange={handleChange}
              id="amount"
              value={formData.amount}
              type="number"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="₹ 0"
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              required
              name="description"
              onChange={handleChange}
              value={formData.description}
              id="description"
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="e.g., Grocery, Uber, Salary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              required
              name="category"
              onChange={handleChange}
              value={formData.category}
              id="category"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              {category.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex gap-3">
            <div className="flex-1">
              <label htmlFor="newCategory" className="block text-sm font-medium text-gray-700 mb-1">
                Add other category
              </label>
              <input
                id="newCategory"
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                placeholder="Enter category name"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
              />
            </div>

            <div className="flex-shrink-0 self-end">
              <button
                type="button"
                onClick={handleAddCategory}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition disabled:opacity-60"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={formData.category === "None"}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              formData.category === "None"
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow"
            }`}
          >
            Add Expense
          </button>
        </div>
      </form>

      <div className="mt-6">
        <h4 className="text-md font-semibold text-gray-700 mb-3">Your Expenses</h4>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
          <ExpenseList lists={expenseList} />
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;

import React, { useContext, useState } from "react";
import axios from "axios";
import BASE_URL from "../../utils/api";
import UserContext from "../context/user-context";
import { DownloadExpense } from "./DownloadExpense";

const ExpenseList = ({ lists = [], setExpenseList }) => {
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("token");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    amount: "",
    description: "",
    category: "",
  });
  const [loadingId, setLoadingId] = useState(null);

  const startEdit = (expense) => {
    setEditingId(expense.id);
    setEditForm({
      amount: expense.amount,
      description: expense.description,
      category: expense.category,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ amount: "", description: "", category: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((p) => ({ ...p, [name]: value }));
  };

  const handleSave = async (id) => {
    try {
      setLoadingId(id);
      const payload = {
        amount: editForm.amount,
        description: editForm.description,
        category: editForm.category,
      };

      await axios.put(`${BASE_URL}/expense/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ update local state
      setExpenseList((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...payload } : e))
      );

      cancelEdit();
    } catch (err) {
      console.error("Edit error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to edit expense");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      setLoadingId(id);

      await axios.delete(`${BASE_URL}/expense/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ remove from local state
      setExpenseList((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to delete expense");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="mt-6">
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {lists.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No expenses yet.
                </td>
              </tr>
            ) : (
              lists.map((list) => {
                const isEditing = editingId === list.id;
                return (
                  <tr
                    key={list.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-3 text-gray-800 font-medium w-28">
                      {isEditing ? (
                        <input
                          name="amount"
                          value={editForm.amount}
                          onChange={handleChange}
                          type="number"
                          step="0.01"
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      ) : (
                        <span>₹ {list.amount}</span>
                      )}
                    </td>

                    <td className="px-6 py-3 text-gray-700">
                      {isEditing ? (
                        <input
                          name="description"
                          value={editForm.description}
                          onChange={handleChange}
                          type="text"
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      ) : (
                        <div className="truncate max-w-[36ch]">
                          {list.description}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-3 text-gray-500 w-36">
                      {isEditing ? (
                        <input
                          name="category"
                          value={editForm.category}
                          onChange={handleChange}
                          type="text"
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      ) : (
                        <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs">
                          {list.category}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-3 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleSave(list.id)}
                            disabled={loadingId === list.id}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-60"
                          >
                            {loadingId === list.id ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => startEdit(list)}
                            className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(list.id)}
                            disabled={loadingId === list.id}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-60"
                          >
                            {loadingId === list.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {user?.isPremium && (
        <div className="mt-6 flex justify-end">
          <DownloadExpense lists={lists} />
        </div>
      )}
    </div>
  );
};

export default ExpenseList;

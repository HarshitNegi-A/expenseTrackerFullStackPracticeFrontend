import React, { useEffect, useState } from "react";
import ExpenseList from "./ExpenseList";
import axios from "axios";
import BASE_URL from "../../utils/api";// ✅ central base url

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
        category: "",
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
    <>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="amount">Enter Amount Spend:</label>
        <input
          required
          name="amount"
          onChange={handleChange}
          id="amount"
          value={formData.amount}
          type="number"
        />

        <label htmlFor="description">Description:</label>
        <input
          required
          name="description"
          onChange={handleChange}
          value={formData.description}
          id="description"
          type="text"
        />

        <label htmlFor="category">Category:</label>
        <select
          required
          name="category"
          onChange={handleChange}
          value={formData.category}
          id="category"
        >
          {category.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          placeholder="Enter other category"
        />
        <button type="button" onClick={handleAddCategory}>
          Add Category
        </button>
        <button disabled={formData.category === "None"}>Add Expense</button>
      </form>

      <ExpenseList lists={expenseList} />
    </>
  );
};

export default ExpenseForm;

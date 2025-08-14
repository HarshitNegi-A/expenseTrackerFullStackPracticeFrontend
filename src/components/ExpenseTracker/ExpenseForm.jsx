import React, { useEffect, useState } from "react";
import ExpenseList from "./ExpenseList";
import axios from "axios";

const ExpenseForm = ({expenseList,setExpenseList}) => {
  const [category, setCategory] = useState([
    "None",
    "Food",
    "Petrol",
    "Salary",
  ]);
  const token = localStorage.getItem("token");
  const [newCat, setNewCat] = useState("");
  // const [expenseList, setExpenseList] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "None",
  });
  const fetchExpense=async()=>{
      try{
        const res=await axios.get("http://localhost:3000/expense",{
          headers:{
            Authorization: `Bearer ${token}`
          }
        })
        setExpenseList(res.data.expenses)
      }
      catch(err){
        console.log(err)
      }
    }
  useEffect(()=>{
    fetchExpense()
  },[])
  const handleAddCategory = () => {
    if(newCat===''){
      alert("Add a valid category")
    }
    if (!category.includes(newCat)) {
      setCategory([...category, newCat]);
      setNewCat("");
    } else {
      alert("Category already included");
    }
  };
  const handleFormSubmit = async(e) => {
    e.preventDefault();
    try{
        if(!formData.amount || !formData.description || !formData.category || formData.category === "None"){
        alert("Fill all the fields")
        return;
    }

    await axios.post('http://localhost:3000/expense/add-expense',formData,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    })
    await fetchExpense();
    // setExpenseList(res.data.expense);
    // alert(res.data.message)
    setFormData({
      amount: "",
      description: "",
      category: "",
    });
    }
    catch(err){
        console.log(err)
    }
    
  };
  console.log(expenseList);
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
          {category.map((cat,index) => (
            <option key={index} value={cat}>{cat}</option>
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
        <button disabled={formData.category==="None"}>Add Expense</button>
      </form>
      <ExpenseList lists={expenseList} />
    </>
  );
};

export default ExpenseForm;

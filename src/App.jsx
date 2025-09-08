import { Route, Routes } from "react-router-dom";
import ExpenseForm from "./components/ExpenseTracker/ExpenseForm";
import SignUp from "./components/SignUp";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect, useState } from "react";
import LeaderBoard from "./components/LeaderBoard";
import ForgetPassword from "./components/ForgetPassword";
import ResetPassword from "./components/ResetPassword";
import ReportGeneration from "./components/ReportGeneration";
import axios from "axios";
import BASE_URL from "./utils/api"; // ✅ use central base url

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [expenseList, setExpenseList] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsLoggedIn(true);

    const fetchExpense = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/expense`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setExpenseList(res.data.expenses);
      } catch (err) {
        console.error("Failed to fetch expenses:", err.response?.data || err.message);
      }
    };

    fetchExpense();
  }, []);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp setIsLoggedIn={setIsLoggedIn} />} />

        <Route
          path="/expenseForm"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ExpenseForm expenseList={expenseList} setExpenseList={setExpenseList} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <LeaderBoard />
            </ProtectedRoute>
          }
        />

        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/resetpassword/:id" element={<ResetPassword />} />
        <Route path="/reportgeneration" element={<ReportGeneration expenseList={expenseList} />} />
      </Routes>
    </>
  );
}

export default App;

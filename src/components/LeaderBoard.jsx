import { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../utils/api"; // <-- import your base URL

const LeaderBoard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No token found, user might not be logged in.");
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        const res = await axios.get(`${BASE_URL}/premium/leaderboard`, config);
        setLeaderboard(res.data);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err.response?.data || err.message);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Rank</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Total Expenses</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.length > 0 ? (
            leaderboard.map((entry, index) => (
              <tr key={entry.userId} className="text-center">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{entry.User?.name}</td>
                <td className="px-4 py-2 border">{entry.User?.email}</td>
                <td className="px-4 py-2 border">₹{entry.totalExpenses}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderBoard;

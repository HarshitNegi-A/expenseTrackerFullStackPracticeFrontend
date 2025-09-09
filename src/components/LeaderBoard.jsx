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
        console.error(
          "Failed to fetch leaderboard:",
          err.response?.data || err.message
        );
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        🏆 Leaderboard
      </h1>

      <div className="overflow-x-auto rounded-2xl shadow-md border border-gray-200">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Total Expenses
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {leaderboard.length > 0 ? (
              leaderboard.map((entry, index) => (
                <tr
                  key={entry.userId}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-3 text-gray-800 font-medium">
                    {index + 1}
                  </td>
                  <td className="px-6 py-3 text-gray-700">
                    {entry.User?.name}
                  </td>
                  <td className="px-6 py-3 text-gray-500">
                    {entry.User?.email}
                  </td>
                  <td className="px-6 py-3 text-right font-semibold text-blue-600">
                    ₹{entry.totalExpenses}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderBoard;

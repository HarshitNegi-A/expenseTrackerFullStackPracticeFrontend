import { useEffect, useState } from 'react';
import axios from 'axios';

const LeaderBoard = () => {
  const [leaderboard, setLeaderboard] = useState([]);


  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const res = await axios.get('http://localhost:3000/premium/leaderboard', config);
        setLeaderboard(res.data);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
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
          {leaderboard.map((entry, index) => (
            <tr key={entry.userId} className="text-center">
              <td className="px-4 py-2 border">{index + 1}</td>
              <td className="px-4 py-2 border">{entry.User.name}</td>
              <td className="px-4 py-2 border">{entry.User.email}</td>
              <td className="px-4 py-2 border">₹{entry.totalExpenses}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderBoard;

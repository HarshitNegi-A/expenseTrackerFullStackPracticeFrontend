import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../utils/api"; // ✅ import base URL

const ResetPassword = () => {
  const { id } = useParams();
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  // ✅ Step 1: Verify if link is valid
  useEffect(() => {
    const checkLink = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/resetpassword/${id}`);
        if (res.data.message === "Valid link") {
          setIsValid(true);
        }
      } catch (err) {
        console.error(
          "❌ Reset link check failed:",
          err.response?.data || err.message
        );
        setIsValid(false);
      } finally {
        setLoading(false);
      }
    };
    checkLink();
  }, [id]);

  // ✅ Step 2: Submit new password
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/updatepassword/${id}`, {
        newPassword: newPassword,
      });

      alert("✅ Password updated successfully!");
      navigate("/login"); // redirect to login
    } catch (error) {
      console.error(
        "❌ Reset error:",
        error.response?.data || error.message
      );
      alert("Failed to reset password. Try again.");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600 font-medium">Loading...</p>
    );

  if (!isValid)
    return (
      <p className="text-center mt-10 text-red-600 font-semibold">
        ⚠️ Reset link is invalid or expired.
      </p>
    );

  // ✅ Step 3: Show password form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Reset Your Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={newPassword}
              required
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter new password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 active:scale-[0.98] transition"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

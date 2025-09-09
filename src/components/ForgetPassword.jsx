import { useState } from "react";
import axios from "axios"; // Make sure this exports your backend URL
import BASE_URL from "../utils/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/forgetpassword`, { email });
      console.log(res.data);
      setMessage("If the email exists, a reset link has been sent.");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
        Forgot Password
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="text-left">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 active:scale-[0.98] transition"
        >
          Send Reset Link
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm font-medium text-green-600">
          {message}
        </p>
      )}
    </div>
  );
};

export default ForgotPassword;

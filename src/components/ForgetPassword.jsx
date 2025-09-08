import { useState } from "react";
import axios from "axios";
import BASE_URL from "../utils/api"; // Make sure this exports your backend URL

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/password/forgotpassword`, { email });
      // You can log or handle backend response if needed
      console.log(res.data);
      setMessage("If the email exists, a reset link has been sent.");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", textAlign: "center" }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ padding: "0.6rem", background: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Send Reset Link
        </button>
      </form>
      {message && <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>}
    </div>
  );
};

export default ForgotPassword;

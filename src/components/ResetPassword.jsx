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
        console.error("❌ Reset link check failed:", err.response?.data || err.message);
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
      console.error("❌ Reset error:", error.response?.data || error.message);
      alert("Failed to reset password. Try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!isValid) return <p>⚠️ Reset link is invalid or expired.</p>;

  // ✅ Step 3: Show password form
  return (
    <div style={{ padding: "1rem" }}>
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="password">New Password:</label>
        <br />
        <input
          id="password"
          type="password"
          value={newPassword}
          required
          onChange={(e) => setNewPassword(e.target.value)}
          style={{
            padding: "0.5rem",
            marginTop: "0.5rem",
            marginBottom: "1rem",
            width: "100%",
            maxWidth: "300px",
          }}
        />
        <br />
        <button type="submit" style={{ padding: "0.6rem 1rem", marginTop: "0.5rem" }}>
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;

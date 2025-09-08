import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "./context/user-context";
import BASE_URL from "../utils/api"; // ✅ import base URL

const SignUp = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { updateUser } = useContext(UserContext);
  const [login, setLogin] = useState(false);
  const navigate = useNavigate();

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = login ? `${BASE_URL}/login` : `${BASE_URL}/signup`;

      const res = await axios.post(url, {
        name: !login ? formData.name : undefined, // only send name during signup
        email: formData.email,
        password: formData.password,
      });

      // Reset form
      setFormData({ name: "", email: "", password: "" });

      // Save auth info
      localStorage.setItem("token", res.data.token);
      updateUser(res.data.newUser);
      setIsLoggedIn(true);

      alert(res.data.message || "Success!");
      console.log("Response:", res.data);

      navigate("/expenseForm");
    } catch (err) {
      const message =
        err.response?.data?.message || // backend's message
        err.message || // axios/network message
        "Something went wrong"; // fallback
      alert(message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {!login && (
          <>
            <label htmlFor="name">Name:</label>
            <input
              required
              name="name"
              value={formData.name}
              id="name"
              type="text"
              placeholder="name"
              onChange={handleChange}
            />
          </>
        )}

        <label htmlFor="email">Email:</label>
        <input
          required
          value={formData.email}
          name="email"
          id="email"
          type="email"
          placeholder="email"
          onChange={handleChange}
        />

        <label htmlFor="password">Password:</label>
        <input
          required
          name="password"
          value={formData.password}
          id="password"
          type="password"
          placeholder="password"
          onChange={handleChange}
        />

        <button type="submit">{login ? "Log In" : "Sign Up"}</button>
      </form>

      {/* Forget password link visible only on login */}
      {login && (
        <Link to="/forgetpassword">
          <button>Forget Password?</button>
        </Link>
      )}

      {/* Toggle login/signup */}
      <button onClick={() => setLogin(!login)}>
        {login ? "New here? Sign up now" : "Already Signed up? Log in now"}
      </button>
    </>
  );
};

export default SignUp;

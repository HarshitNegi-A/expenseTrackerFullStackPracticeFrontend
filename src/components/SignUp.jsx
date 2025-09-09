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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-extrabold text-gray-800 text-center mb-4">
          {login ? "Welcome Back" : "Create your account"}
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          {login
            ? "Login to continue to your Expense Tracker"
            : "Sign up to start tracking your expenses and gain insights"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!login && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                required
                name="name"
                value={formData.name}
                id="name"
                type="text"
                placeholder="Your name"
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              required
              value={formData.email}
              name="email"
              id="email"
              type="email"
              placeholder="you@example.com"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              required
              name="password"
              value={formData.password}
              id="password"
              type="password"
              placeholder="Choose a secure password"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-1 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 active:scale-[0.99] transition"
          >
            {login ? "Log In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm">
          {login && (
            <Link to="/forgetpassword" className="text-blue-600 hover:underline">
              Forget Password?
            </Link>
          )}

          <button
            onClick={() => setLogin(!login)}
            className="ml-auto text-sm text-gray-600 hover:text-gray-800"
          >
            {login ? "New here? Sign up now" : "Already Signed up? Log in now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

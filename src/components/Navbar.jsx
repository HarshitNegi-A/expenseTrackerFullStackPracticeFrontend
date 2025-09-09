import { Link } from "react-router-dom";
import PremiumFeature from "./PremiumFeature";
import { useContext } from "react";
import UserContext from "./context/user-context";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const { user, cleanUser } = useContext(UserContext);

  const handleLogout = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      cleanUser();
      setIsLoggedIn(false);
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="text-2xl font-extrabold tracking-wide">
            <Link to="/" className="hover:text-gray-200 transition">
              Expense<span className="text-yellow-300">Tracker</span>
            </Link>
          </div>

          {/* Menu */}
          <ul className="hidden md:flex space-x-6 font-medium">
            <li>
              <Link
                to="/"
                className="hover:text-yellow-200 transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/expenseForm"
                className="hover:text-yellow-200 transition-colors duration-200"
              >
                Expense Tracker
              </Link>
            </li>
            {user?.isPremium && (
              <li>
                <Link
                  to="/leaderboard"
                  className="hover:text-yellow-200 transition-colors duration-200"
                >
                  Leaderboard
                </Link>
              </li>
            )}
            {user?.isPremium && (
              <li>
                <Link
                  to="/reportgeneration"
                  className="hover:text-yellow-200 transition-colors duration-200"
                >
                  Report Generation
                </Link>
              </li>
            )}
          </ul>

          {/* Premium Feature + Auth Button */}
          <div className="flex items-center gap-4">
            {isLoggedIn && <PremiumFeature />}
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-100 transition"
            >
              <Link to="/signup">
                {isLoggedIn ? "Logout" : "Sign Up"}
              </Link>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

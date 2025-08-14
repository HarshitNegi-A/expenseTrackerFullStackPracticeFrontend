
import { Link } from "react-router-dom";
import PremiumFeature from "./PremiumFeature";
import { useContext } from "react";
import UserContext from "./context/user-context";

const Navbar = ({isLoggedIn,setIsLoggedIn}) => {
  // const [user, setUser] = useState(
  //   JSON.parse(localStorage.getItem("user")) || null
  // );
  const {user,cleanUser}=useContext(UserContext)
  const handleLogout = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      cleanUser()
      setIsLoggedIn(false);
    }
  };
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="text-2xl font-bold">Expense Tracker</div>

          {/* Menu */}
          <ul className="hidden md:flex space-x-6">
            <li className="hover:text-gray-300 cursor-pointer">
              <Link to="/">Home</Link>
            </li>
            <li className="hover:text-gray-300 cursor-pointer">
              <Link to="/expenseForm">Expense Tracker</Link>
            </li>
            {user?.isPremium && <li className="hover:text-gray-300 cursor-pointer">
              <Link to="/leaderboard">Leaderboard</Link>
            </li>}
            {user?.isPremium && <li className="hover:text-gray-300 cursor-pointer">
              <Link to="/reportgeneration">Report Generation</Link>
            </li>}

            
          </ul>
          {isLoggedIn && <PremiumFeature />}
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
          >
            <Link to="/signup">{isLoggedIn ? "Logout" : "Sign Up"}</Link>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

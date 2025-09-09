import { Link } from "react-router-dom";
import PremiumFeature from "./PremiumFeature";
import { useContext, useEffect, useState } from "react";
import UserContext from "./context/user-context";

const DESKTOP_MIN_WIDTH = 1024; // same as Tailwind 'lg' but controlled in JS

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const { user, cleanUser } = useContext(UserContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= DESKTOP_MIN_WIDTH : false
  );

  useEffect(() => {
    const onResize = () => {
      const nowDesktop = window.innerWidth >= DESKTOP_MIN_WIDTH;
      setIsDesktop(nowDesktop);
      if (nowDesktop) setMobileOpen(false); // close mobile menu if switching to desktop
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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
          {/* Logo + tagline */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/"
              className="text-2xl font-extrabold tracking-wide hover:text-yellow-200 transition whitespace-nowrap"
            >
              Expense<span className="text-yellow-300">Tracker</span>
            </Link>
            <span className="hidden sm:inline-block text-sm text-blue-100/90 truncate">
              — simple money management
            </span>
          </div>

          {/* Desktop menu (rendered only when JS says desktop) */}
          {isDesktop ? (
            <ul className="flex space-x-6 font-medium items-center">
              <li>
                <Link to="/" className="hover:text-yellow-200 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/expenseForm" className="hover:text-yellow-200 transition-colors duration-200">
                  Expense Tracker
                </Link>
              </li>
              {user?.isPremium && (
                <li>
                  <Link to="/leaderboard" className="hover:text-yellow-200 transition-colors duration-200">
                    Leaderboard
                  </Link>
                </li>
              )}
              {user?.isPremium && (
                <li>
                  <Link to="/reportgeneration" className="hover:text-yellow-200 transition-colors duration-200">
                    Report Generation
                  </Link>
                </li>
              )}
            </ul>
          ) : (
            // placeholder so layout doesn't jump — keeps center area consistent
            <div className="flex-1" />
          )}

          {/* Right side: premium feature + auth + hamburger */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Desktop: show PremiumFeature inline */}
            {isDesktop && isLoggedIn && (
              <div className="flex items-center flex-shrink-0">
                <PremiumFeature />
              </div>
            )}

            {/* Auth button */}
            <div className="flex-shrink-0">
              <button
                onClick={handleLogout}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-100 transition whitespace-nowrap"
              >
                <Link to="/signup">{isLoggedIn ? "Logout" : "Sign Up"}</Link>
              </button>
            </div>

            {/* Hamburger — always rendered on small screens as determined by JS */}
            {!isDesktop && (
              <button
                className="ml-2 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-500/80 focus:outline-none focus:ring-2 focus:ring-white z-60"
                onClick={() => setMobileOpen((s) => !s)}
                aria-expanded={mobileOpen}
                aria-label="Toggle menu"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu panel */}
        {!isDesktop && mobileOpen && (
          <div className="mt-2 pb-4">
            <div className="bg-blue-600/95 rounded-lg px-3 py-3 shadow-inner border border-blue-500">
              <ul className="flex flex-col gap-2 text-sm">
                <li>
                  <Link to="/" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded hover:bg-blue-500/40 transition">
                    Home
                  </Link>
                </li>

                <li>
                  <Link to="/expenseForm" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded hover:bg-blue-500/40 transition">
                    Expense Tracker
                  </Link>
                </li>

                {user?.isPremium && (
                  <>
                    <li>
                      <Link to="/leaderboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded hover:bg-blue-500/40 transition">
                        Leaderboard
                      </Link>
                    </li>
                    <li>
                      <Link to="/reportgeneration" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded hover:bg-blue-500/40 transition">
                        Report Generation
                      </Link>
                    </li>
                  </>
                )}

                {/* Mobile: show PremiumFeature inside menu so it doesn't overflow */}
                {isLoggedIn && (
                  <li className="pt-2">
                    <div className="px-1">
                      <PremiumFeature />
                    </div>
                  </li>
                )}

                <li className="pt-2">
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded bg-white text-blue-600 font-semibold hover:bg-gray-100 transition"
                  >
                    {isLoggedIn ? "Logout" : "Sign Up"}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

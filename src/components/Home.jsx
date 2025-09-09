import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-3xl text-center">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          Welcome to <span className="text-blue-600">ExpenseTracker</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          A simple and powerful way to track your spending, manage categories,
          and gain insights into your financial habits. Stay in control of your
          money — every day, every month.
        </p>

        {/* Highlight Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800">Track Easily</h4>
            <p className="mt-2 text-sm text-gray-600">
              Log your expenses quickly with categories and descriptions.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800">Stay Organized</h4>
            <p className="mt-2 text-sm text-gray-600">
              Keep your spending organized and understand where your money goes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800">Gain Insights</h4>
            <p className="mt-2 text-sm text-gray-600">
              Analyze patterns and make smarter financial decisions.
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-10 text-sm text-gray-500">
          Start your journey towards smarter money management today 🚀
        </p>
      </div>
    </div>
  );
};

export default Home;

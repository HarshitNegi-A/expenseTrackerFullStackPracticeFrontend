import React, { useContext } from "react";
import { DownloadExpense } from "./DownloadExpense";
import UserContext from "../context/user-context";

const ExpenseList = ({ lists }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="mt-6">
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Amount Spend
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Category
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {lists?.map((list) => (
              <tr
                key={list.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-3 text-gray-800 font-medium">
                  ₹ {list.amount}
                </td>
                <td className="px-6 py-3 text-gray-700">{list.description}</td>
                <td className="px-6 py-3 text-gray-500">{list.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {user?.isPremium && (
        <div className="mt-6">
          <DownloadExpense lists={lists} />
        </div>
      )}
    </div>
  );
};

export default ExpenseList;

import { useContext, useEffect, useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import axios from "axios";
import UserContext from "./context/user-context";
// import { useNavigate } from "react-router-dom";

const PremiumFeature = () => {
  const [cashfree, setCashfree] = useState(null);
  const [loading, setLoading] = useState(true);
  const {user,updateUser}=useContext(UserContext)
  //      const [user, setUser] = useState(
  //   JSON.parse(localStorage.getItem("user")) || null
  // );
  // const navigate = useNavigate();
  // ✅ Load Cashfree SDK once
  useEffect(() => {
    const init = async () => {
      try {
        const cf = await load({ mode: "sandbox" }); // or "production"
        setCashfree(cf);
        console.log("✅ Cashfree SDK loaded");
      } catch (err) {
        console.error("❌ Failed to load Cashfree SDK:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // ✅ Handle payment success redirect
  useEffect(() => {
    const verifyPayment = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get("order_id");
      const status = urlParams.get("status");

      if (!orderId) return;

      if (status === "FAILED") {
        alert("❌ Payment failed. Please try again.");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const res = await axios.get(
          `http://localhost:3000/premium/verify?order_id=${orderId}`,
          config
        );

        if (res.data.status === "PAID") {
          alert("✅ Payment successful! Premium activated.");
          updateUser(res.data.user);
          // localStorage.setItem("user", JSON.stringify(res.data.user));
        } else {
          alert(`⚠️ Payment status: ${res.data.status}`);
        }
      } catch (err) {
        console.error("❌ Payment verification failed:", err);
        alert("Failed to verify payment.");
      }
    };

    verifyPayment();
  }, []);

  const handlePremium = async () => {
    try {
      if (!cashfree) {
        alert("❌ Cashfree SDK not loaded. Please refresh the page.");
        return;
      }

      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // ✅ Request backend to create order
      const res = await axios.post(
        "http://localhost:3000/premium",
        { amount: 1 }, // Pass amount or other metadata
        config
      );

      const sessionId = res.data?.payment_session_id;
      if (!sessionId) {
        alert("❌ Payment session ID not received from server.");
        return;
      }

      // ✅ Open Cashfree Checkout
      cashfree.checkout(
        {
          paymentSessionId: sessionId,
          redirectTarget: "_self", // Redirect to Cashfree page
        },
        (event) => {
          console.log("💳 Payment event:", event);
        }
      );
    } catch (err) {
      console.error("Buy premium error:", err.response?.data || err.message);
      alert("Something went wrong while starting payment.");
    }
  };

  return (
    <>
      {user?.isPremium ? (
        <p className="text-green-600 font-semibold">
          🌟 You are a Premium Member
        </p>
      ) : (
        <button
          onClick={handlePremium}
          disabled={loading || !cashfree}
          className={`px-4 py-2 rounded-lg font-semibold ${
            cashfree && !loading
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
        >
          {loading ? "Loading Payment..." : "Buy Premium Membership"}
        </button>
      )}
    </>
  );
};

export default PremiumFeature;

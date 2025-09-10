import { useContext, useEffect, useState, useCallback } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import axios from "axios";
import BASE_URL from "../utils/api"; // ✅ import your base URL
import UserContext from "./context/user-context";

const PremiumFeature = () => {
  const [cashfree, setCashfree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasVerified, setHasVerified] = useState(false); // prevents repeated verification/alerts
  const { user, updateUser } = useContext(UserContext);

  // Stable wrapper around updateUser
  const safeUpdateUser = useCallback(
    (userObj) => {
      try {
        updateUser(userObj);
      } catch (e) {
        console.warn("safeUpdateUser: updateUser failed", e);
      }
    },
    [updateUser]
  );

  // ✅ Load Cashfree SDK once
  useEffect(() => {
    const init = async () => {
      try {
        const cf = await load({ mode: "sandbox" }); // use "production" in live
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

  // ✅ Handle payment success redirect (verify only once)
  useEffect(() => {
    if (hasVerified) return;

    const verifyPayment = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get("order_id") || urlParams.get("orderId");

      if (!orderId) return; // nothing to verify

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You are not authenticated. Please login and try again.");
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        console.log("Verifying payment with order_id:", orderId);
        const res = await axios.get(`${BASE_URL}/premium/verify`, {
          params: { order_id: orderId },
          headers: config.headers,
        });

        const status = res?.data?.status;

        if (status === "PAID" || status === "SUCCESS") {
          setHasVerified(true);

          if (res.data.user) safeUpdateUser(res.data.user);

          // remove order params from URL
          const url = new URL(window.location.href);
          url.searchParams.delete("order_id");
          url.searchParams.delete("orderId");
          window.history.replaceState({}, document.title, url.toString());

          alert("✅ Payment successful! Premium activated.");
        } else if (status === "PENDING" || status === "INITIATED") {
          alert("⏳ Payment is pending. We'll confirm once it's done.");
        } else {
          alert(`⚠️ Payment status: ${status || "Unknown"}. ${res?.data?.message || ""}`);
        }
      } catch (err) {
        console.error("❌ Payment verification failed:", err.response?.data || err.message);
        const serverMsg = err?.response?.data?.message || err?.message || "Failed to verify payment.";
        alert(`Failed to verify payment: ${serverMsg}`);
      }
    };

    verifyPayment();
  }, [safeUpdateUser, hasVerified]);

  const handlePremium = async () => {
    try {
      if (!cashfree) {
        alert("❌ Cashfree SDK not loaded. Please refresh the page.");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to buy premium.");
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // ✅ Request backend to create order
      const res = await axios.post(`${BASE_URL}/premium`, { amount: 499 }, config);

      const sessionId = res.data?.payment_session_id;
      const returnedOrderId = res.data?.orderId;
      if (!sessionId) {
        console.error("premium response:", res.data);
        alert("❌ Payment session ID not received from server.");
        return;
      }

      if (returnedOrderId) {
        console.log("Created order:", returnedOrderId);
      }

      // ✅ Open Cashfree Checkout
      cashfree.checkout(
        {
          paymentSessionId: sessionId,
          redirectTarget: "_self", // Cashfree will redirect back with order_id
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
        <p className="text-green-600 font-semibold">🌟 You are a Premium Member</p>
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

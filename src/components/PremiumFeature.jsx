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

  // Stable wrapper around updateUser in case parent provides a new function each render
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
    if (hasVerified) return; // already handled a successful verification

    const verifyPayment = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get("order_id");
      if (!orderId) return;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You are not authenticated. Please login and try again.");
          return;
        }
        const config = { headers: { Authorization: `Bearer ${token}` } };

        console.log("Verifying payment for order:", orderId);
        const res = await axios.get(`${BASE_URL}/premium/verify?order_id=${orderId}`, config);
        const status = res?.data?.status;

        if (status === "PAID") {
          // mark local flag so we won't verify again
          setHasVerified(true);

          // update user in app state/context
          if (res.data.user) safeUpdateUser(res.data.user);

          // remove order_id from URL so page reloads / re-renders won't re-trigger verification
          const url = new URL(window.location.href);
          url.searchParams.delete("order_id");
          window.history.replaceState({}, document.title, url.toString());

          // show a single success UI / toast / redirect
          alert("✅ Payment successful! Premium activated.");
          // Optionally: navigate to a success page instead of alert
          // navigate("/premium/success");
        } else if (status === "PENDING") {
          // keep hasVerified false so you could poll later if you want
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
      const res = await axios.post(`${BASE_URL}/premium`, { amount: 1 }, config);

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

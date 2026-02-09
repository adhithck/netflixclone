import Navbar from "../components/layout/Navbar";
import { useNavigate } from "react-router-dom";

export default function PremiumPayment() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-32 flex justify-center">
        <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Premium Subscription
          </h1>

          <p className="text-white/70 mb-6 text-center">
            Complete your payment to unlock all movies.
          </p>

          <button
            onClick={() => alert("Razorpay will open here")}
            className="w-full rounded bg-red-600 py-3 font-semibold hover:bg-red-700"
          >
            Pay ₹199
          </button>

          <button
            onClick={() => navigate("/browse")}
            className="mt-4 w-full rounded bg-white/10 py-2 text-sm"
          >
            Cancel
          </button>
        </div>
      </main>
    </div>
  );
}

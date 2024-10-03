import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Key, Loader, ArrowLeft } from "lucide-react";
import BusinessLogoBlack from "../assets/NeemaCollection-color_black.svg";

const VerifyResetCode = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      setMessage({ text: "Please enter a 6-digit code", type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/verify-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (response.ok) {
        setMessage({ text: "Code verified successfully", type: "success" });
        setTimeout(() => {
          navigate("/auth/reset-password", { state: { email, code } });
        }, 1500);
      } else {
        const data = await response.json();
        setMessage({ text: data.message || "Invalid code", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "An error occurred. Please try again later.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ type: 'tween', ease: 'anticipate', duration: 0.5 }}
      className="bg-off-white min-h-screen flex flex-col items-center pt-10 px-4"
    >
      <h1 className="font-Pacifico text-lg text-gray mb-10">neema collection</h1>
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-8">
        <img src={BusinessLogoBlack} alt="Neema Collection logo" className="w-44 mb-6 mx-auto" />
        <h2 className="text-2xl font-bold text-center mb-6">Verify Reset Code</h2>
        <p className="text-center mb-4">
          Please enter the 6-digit code sent to {email}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Key className="absolute top-3 left-3 text-gray-400" size={20} />
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-light-pink text-center text-2xl tracking-widest"
              placeholder="------"
              maxLength="6"
            />
          </div>
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`text-sm p-2 rounded ${
                  message.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                }`}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-light-pink text-white font-bold py-2 px-4 rounded-md flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin mr-2" size={20} />
                Verifying
              </>
            ) : (
              "Verify Code"
            )}
          </motion.button>
        </form>
        <motion.div 
          className="mt-4 text-center"
          whileHover={{ scale: 1.05 }}
        >
          <button
            onClick={() => navigate("/auth/forgot-password")}
            className="text-light-pink hover:underline flex items-center justify-center mx-auto"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Forgot Password
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VerifyResetCode;
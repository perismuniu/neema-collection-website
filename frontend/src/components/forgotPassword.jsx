import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader } from "lucide-react";
import BusinessLogoBlack from "../assets/NeemaCollection-color_black.svg";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage({ text: "Please enter your email address", type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      await axios.post("http://localhost:3002/api/forgot-password", { email });
      setMessage({ text: "Password reset instructions sent to your email", type: "success" });
      setEmail("");
      setTimeout(() => {
        navigate("/auth/verify-reset-code", { state: { email } });
      }, 2000);
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
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute top-3 left-3 text-gray-400" size={20} />
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-light-pink"
              placeholder="Enter your email address"
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
                Sending
              </>
            ) : (
              "Reset Password"
            )}
          </motion.button>
        </form>
        <motion.div 
          className="mt-4 text-center"
          whileHover={{ scale: 1.05 }}
        >
          <Link to="/auth" className="text-light-pink hover:underline">
            Back to Login
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
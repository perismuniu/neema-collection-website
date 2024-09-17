import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import BusinessLogoBlack from "../assets/NeemaCollection-color_black.svg";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate()

  const showMessage = (message, severity) => {
    toast.current.show({
      severity: severity,
      summary: severity === "error" ? "Error" : "Success",
      detail: message,
      life: 3000,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      showMessage("Please enter your email address", "error");
      return;
    }

    setIsLoading(true);
    try {
      // Here you would typically call an API to handle the password reset
      await axios.post("http://localhost:3000/api/forgot-password", {
        email,
      })
      showMessage("Password reset instructions sent to your email", "success");
      setEmail("");
      //navigate to /auth/verify-reset-code and passing email as a parameter
      navigate("/auth/verify-reset-code", { state: { email } });
    } catch (error) {
      showMessage("An error occurred. Please try again later.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-off-white bg-cover absolute inset-0 h-screen w-full text-lg">
      <Toast ref={toast} position="top-right" />
      <h1 className="font-Pacifico mt-10 text-center text-lg text-gray">
        neema collection
      </h1>
      <div className="flex justify-center mt-10 font-Outfit">
        <div className="bg-white rounded-md w-96 p-8">
          <img
            src={BusinessLogoBlack}
            alt="Neema Collection logo"
            className="w-44 mb-6 mx-auto"
          />
          <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <label
              htmlFor="email"
              className="font-bold text-lg mb-2 text-gray"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-light w-full p-2 mb-4 focus:outline-none text-base rounded"
              placeholder="Enter your email address"
            />
            <button
              type="submit"
              className="bg-light-pink w-full mt-2 h-10 text-center text-white font-bold rounded-md text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  Sending
                  <ProgressSpinner
                    style={{ width: "20px", height: "20px", marginLeft: "10px" }}
                    strokeWidth="4"
                    fill="var(--surface-ground)"
                    animationDuration=".5s"
                  />
                </span>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/auth/login" className="text-light-pink hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

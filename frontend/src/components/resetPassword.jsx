
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import BusinessLogoBlack from "../assets/NeemaCollection-color_black.svg";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, code } = location.state || {};

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
    if (newPassword !== confirmPassword) {
      showMessage("Passwords do not match", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });

      if (response.ok) {
        showMessage("Password reset successfully", "success");
        setTimeout(() => navigate("/auth/login"), 2000);
      } else {
        const data = await response.json();
        showMessage(data.message || "An error occurred", "error");
      }
    } catch (error) {
      showMessage("An error occurred. Please try again later.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=> {
    if (!email || !code) {
        navigate("/auth/forgot-password");
        return null;
      }
  })

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
          <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <label
              htmlFor="newPassword"
              className="font-bold text-lg mb-2 text-gray"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-gray-light w-full p-2 mb-4 focus:outline-none text-base rounded"
              placeholder="Enter your new password"
            />
            <label
              htmlFor="confirmPassword"
              className="font-bold text-lg mb-2 text-gray"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-gray-light w-full p-2 mb-4 focus:outline-none text-base rounded"
              placeholder="Confirm your new password"
            />
            <button
              type="submit"
              className="bg-light-pink w-full mt-2 h-10 text-center text-white font-bold rounded-md text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  Resetting
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
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import BusinessLogoBlack from "../assets/NeemaCollection-color_black.svg";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const VerifyResetCode = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();
  const location = useLocation()
  const { email } = location.state || {}


  console.log(email)

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
    if (code.length !== 6) {
      showMessage("Please enter a 6-digit code", "error");
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
        showMessage("Code verified successfully", "success");
        navigate("/auth/reset-password", {state: {email, code}}); // Navigate to password reset page
      } else {
        const data = await response.json();
        showMessage(data.message || "Invalid code", "error");
      }
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
          <h2 className="text-2xl font-bold text-center mb-6">Verify Reset Code</h2>
          <p className="text-center mb-4">
            Please enter the 6-digit code sent to {email}
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value/*.replace(/\D/g, "").slice(0, 6) */)}
              className="bg-gray-light w-full p-2 mb-4 focus:outline-none text-base rounded text-center text-2xl tracking-widest"
              placeholder="------"
              maxLength="6"
            />
            <button
              type="submit"
              className="bg-light-pink w-full mt-2 h-10 text-center text-white font-bold rounded-md text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  Verifying
                  <ProgressSpinner
                    style={{ width: "20px", height: "20px", marginLeft: "10px" }}
                    strokeWidth="4"
                    fill="var(--surface-ground)"
                    animationDuration=".5s"
                  />
                </span>
              ) : (
                "Verify Code"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyResetCode;

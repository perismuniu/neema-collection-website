
import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { connect, useDispatch, useSelector } from "react-redux";
import SignUp from "../assets/signup.png";
import BusinessLogoBlack from "../assets/NeemaCollection-color_black.svg";
import GoogleLogo from "../assets/google.png";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import axios from "axios";

const Signup = () => {
  const ErrorToast = useRef(null);
  const [signupData, setSignupData] = useState({ username: "", email: "", password: "" });
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.auth.signupLoading);
  const signupError = useSelector((state) => state.auth.signupError);
  const navigate = useNavigate();

  const showMessage = (message, ref, severity) => {
    ref.current.show({
      severity: severity,
      summary: severity === "error" ? "Error" : "Success",
      detail: message,
      life: 3000,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   try {
     axios.post("http://localhost:3000/api/auth/register", {
      username: signupData.username,
      email: signupData.email,
      password: signupData.password
     })
   } catch (error) {
    console.log(error.data)
   }
    showMessage("Successfully signed up", ErrorToast, "success");
    navigate("/auth/login");
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <div className="bg-off-white bg-cover absolute inset-0 h-screen w-full text-lg">
      <Toast ref={ErrorToast} position="top-right" />
      <h1 className="font-Pacifico mt-10 text-center text-lg text-gray">
        neema collection
      </h1>
      <div className="flex flex-row mt-10 justify-center font-Outfit">
        <div className="bg-gray-light hidden flex-row w-96 rounded-l-md h-96 md:flex">
          <img src={SignUp} key="signup" className="w-64 mx-auto my-auto h-56" alt="Signup illustration" />
          <div className="mt-32 flex flex-col content-end ml-3 px-auto py-auto">
            <Link to="/auth/login">
              <button className="text-gray-800 font-bold text-lg text-gray">
                Login
              </button>
            </Link>
            <button className="text-white bg-light-pink font-bold rounded-l-md text-lg px-2 py-1 mt-4">
              SignUp
            </button>
          </div>
        </div>
        <div className="rounded-r-md bg-white w-96">
          <img
            src={BusinessLogoBlack}
            key="business-logo"
            className="w-44 mb-0 flex-2 mx-auto"
            alt="Neema Collection logo"
          />
          <div className="flex flex-col flex-1">
            <form onSubmit={handleSubmit} className="flex flex-col">
              <label
                htmlFor="username"
                className="font-bold text-lg ml-24 text-gray"
              >
                Username
              </label>
              <input
                name="username"
                value={signupData.username}
                onChange={(e) =>
                  setSignupData({ ...signupData, username: e.target.value })
                }
                id="username"
                className="bg-gray-light w-52 text-left ml-24 focus:outline-none text-base rounded"
              />
              <label
                htmlFor="email"
                className="font-bold text-lg mt-3 ml-24 text-gray"
              >
                Email
              </label>
              <input
                name="email"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
                id="email"
                className="bg-gray-light w-52 text-left ml-24 focus:outline-none text-base rounded"
              />
              <label
                htmlFor="password"
                className="font-bold text-lg mt-3 text-left ml-24 text-gray"
              >
                Password
              </label>
              <input
                name="password"
                type="password"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
                id="password"
                className="bg-gray-light w-52 h-6 text-left ml-24 focus:outline-none text-base rounded"
              />
              <button
                type="submit"
                className="bg-light-pink w-24 mt-3 h-8 mx-auto text-center text-white font-bold rounded-md text-lg py-1"
              >
                {isLoading ? (
                  <span>
                    Loading{" "}
                    <ProgressSpinner
                      style={{ width: "20px", height: "20px" }}
                      strokeWidth="8"
                      fill="var(--surface-ground)"
                      animationDuration=".5s"
                    />
                  </span>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>
            <hr className="border-gray mt-8"></hr>
            <button onClick={handleGoogleSignup} className="flex justify-center items-center">
              <img
                src={GoogleLogo}
                key="google-logo"
                className="w-5 mx-auto mt-4"
                alt="Google signup"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConnectedSignup = connect()(Signup);

export default ConnectedSignup;

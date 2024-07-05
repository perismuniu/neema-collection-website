import { Link, useNavigate } from "react-router-dom";
import SignUp from "../assets/signup.png";
import BusinessLogoBlack from "../assets/NeemaCollection-color_black.svg";
import GoogleLogo from "../assets/google.png";
import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { connect, useDispatch, useSelector } from "react-redux";
import { login } from "../redux/userSlice";
import { ProgressSpinner } from 'primereact/progressspinner';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";




const Login = () => {
  const ErrorToast = useRef(null);
  const [loginData, setLoginData] = useState({ email: "", password: "" }); // Initialize as empty object
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.auth.loginLoading);
  const loginError = useSelector((state) => state.auth.loginError);
  // const loggedInUser = useSelector((state) => state.user);
  const navigate = useNavigate();

  const showMessage = (event, ref, severity) => {
    const { statusText, data } = event;

    ref.current.show({
      severity: severity,
      summary: statusText,
      detail: data,
      life: 3000,
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await login(loginData, dispatch);
    if (loginError) {
      showMessage(loginError, ErrorToast, "error");
    }
    if (user) {
      showMessage("Successfuly logged in", ErrorToast, "success")
    if (user.isAdmin) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }
  };

  return (
    <div className="bg-off-white bg-cover absolute inset-0 h-screen w-full text-lg">
      <Toast ref={ErrorToast} position="top-right" />
      <h1 className="font-Pacifico mt-10 text-center text-lg text-gray">
        neema collection
      </h1>
      <div className="flex flex-row mt-10 justify-center font-Outfit">
        <div className="bg-gray-light hidden flex-row w-96 rounded-l-md h-96 md:flex">
          <img
            src={SignUp}
            key="signup"
            className="w-64 mx-auto my-auto h-56"
          />
          <div className="mt-32 flex flex-col content-end ml-3 px-auto py-auto">
            <button className="text-white bg-light-pink font-bold rounded-l-md text-lg px-2 py-1">
              Login
            </button>
            <Link to="/auth/signup">
              <button className="text-gray-800 mt-4 font-bold text-lg text-gray">
                SignUp
              </button>
            </Link>
          </div>
        </div>
        <div className="rounded-r-md bg-white w-96">
          <img
            src={BusinessLogoBlack}
            key="business-logo"
            className="w-44 mb-0 flex-2 mx-auto"
          />
          <div className="flex flex-col flex-1">
            <form onSubmit={handleSubmit} className="flex flex-col">
              <label
                htmlFor="email"
                className="font-bold text-lg ml-24 text-gray"
              >
                Email
              </label>
              <input
                name="email"
                value={loginData.email} // Add value prop
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
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
                value={loginData.password} // Add value prop
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                id="password"
                className="bg-gray-light w-52 h-6  text-left ml-24 focus:outline-none text-base rounded"
              />
              <button
                type="submit"
                className="bg-light-pink w-24 mt-3 h-8 mx-auto text-center text-white font-bold rounded-md text-lg py-1"
              >
                {isLoading ? <span>Loading             <ProgressSpinner style={{width: '20px', height: '20px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" />
                </span> : "Welcome"}
              </button>
            </form>
            <hr className="border-gray mt-8"></hr>
            <img
              src={GoogleLogo}
              key="google-logo"
              className="w-5 mx-auto mt-4"
            ></img>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConnectedLogin = connect()(Login);

export default ConnectedLogin;

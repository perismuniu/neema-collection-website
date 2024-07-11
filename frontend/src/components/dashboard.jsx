//dashboard.jsx
import {  useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
 import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { inSight, setUserCart } from "../redux/userActionSlice";
import axios from "axios";
import { setCredentials, setUser } from "../redux/userSlice";
import { persistor } from "../redux/store";


const Dashboard = () => {
  const dispatch = useDispatch()
  const location = useLocation().pathnam
  const token = useSelector((state) => state.token);
  const navigate = useNavigate()

  useEffect(() => {
    inSight(dispatch)
  }, []);


  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3001/api/auth/logout", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(() => {
        dispatch(setUserCart({})); // clear user cart
      dispatch(setCredentials(null)); // clear token
      dispatch(setUser(null)); // clear user data
      persistor.purge(); // clear persisted state
      navigate("/", {replace: true})
      })
    } catch (error) {
      alert("Error Logging out!")
    }
  }


  const components = [

     "overview", "reports","notifications","products"
  ];
  return (
      <div className="text-[#333]">
      <div className="flex bg-[#F6EDF3] gap-3 h-[calc(100vh-72px)] ">
        <aside className="max-w-[30%] min-w-[20%] text-white h-[calc(100vh-72px)] flex flex-col justify-between border-r-4 border-t-4 border-b-4 rounded-tr-2xl rounded-br-2xl">
          <div>
            <h1 className="text-[#333] font-extrabold text-3xl pl-4 mb-4">
              Dashboard
            </h1>
            <ul>
              {components.map((component) => (
                <li
                  key={component}
                  className={`px-4 py-2 ${
                    component === location ? "bg-light-pink" : ""
                  } text-[#333]`}
                >
                  <Link
                    to={component}
                  >
                    {component.charAt(0).toUpperCase() + component.slice(1)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-center mb-5">
            <button className="bg-light-pink text-white py-3 px-6 rounded-2xl" onClick={ () => handleLogout()}>
              Logout
            </button>
          </div>
        </aside>
        <main className="w-full h-[calc(100vh-72px)]">
          <div className="w-full border-x-4 border-y-4 rounded-2xl h-full">
            <Outlet />
          </div>
        </main>
      </div>
      <div className="flex items-center justify-center w-full bg-[#F6EDF3] h-24">
        <p>© 2024 Neema Collection</p>
      </div>
    </div>
  );
};

export default Dashboard;

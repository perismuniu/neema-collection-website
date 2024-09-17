import { useState, useRef, useEffect } from "react";
import Logo from "../assets/NeemaCollection-Logo-color_white.svg";
import Cart from "../assets/cart.svg";
import Person from "../assets/person.svg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserCart } from "../redux/userActionSlice";
import { setSearchQuery } from "../redux/searchSlice";
import { persistor } from "../redux/store";
import { setCredentials, setUser } from "../redux/userSlice";
import axios from "axios";

// Navbar component for user navigation
const Navbar = () => {
  const [menuVisibility, setMenuVisibility] = useState(false);
  const [searchVisibility, setSearchVisibility] = useState(false);
  const searchInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state selectors
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.auth.user);
  const userCart = useSelector((state) => state.data.userCart);
  const searchQuery = useSelector((state) => state.search.query) || "";

  // User options for the dropdown menu
  const userOptions = [
    { name: "Profile", action: "/user/profile" },
    { name: "Orders", action: "/user/orders" },
    { name: "Settings", action: "/user/settings" },
    { name: "Logout", action: "/user/logout" },
  ];

  // Handle navigation to cart view
  const handleCartView = () => {
    navigate("/user/cart");
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3001/api/auth/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setUserCart({})); // Clear user cart
      dispatch(setCredentials(null)); // Clear token
      dispatch(setUser(null)); // Clear user data
      persistor.purge(); // Clear persisted state
      navigate("/", { replace: true });
    } catch (error) {
      alert("Error Logging out!");
    }
  };

  // Calculate total quantity of items in the cart
  const totalQuantity = userCart.items?.reduce(
    (acc, item) => acc + item.buyingQuantity,
    0
  );

  // Handle search input visibility
  const handleSearchClick = () => {
    setSearchVisibility(true);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Close search input when clicking outside of it
  const handleClickOutside = (event) => {
    if (
      searchInputRef.current &&
      !searchInputRef.current.contains(event.target)
    ) {
      setSearchVisibility(false);
    }
  };

  // Effect to handle click outside of the search input
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="h-14 bg-gray flex flex-row items-center px-4">
      <Link to="/">
        <img src={Logo} className="h-14 w-52" alt="Logo" />
      </Link>

      <div className="flex-grow flex justify-center">
        {!searchVisibility ? (
          <h1 className="text-white cursor-pointer" onClick={handleSearchClick}>
            Search
          </h1>
        ) : (
          <input
            ref={searchInputRef}
            type="text"
            className="p-2 border rounded"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Type to search..."
          />
        )}
      </div>

      <div className="flex flex-row items-center">
        <div className={`relative ${!menuVisibility ? "my-auto" : ""}`}>
          <img
            src={Person}
            className="h-10 my-auto cursor-pointer"
            onClick={() =>
              user
                ? setMenuVisibility(!menuVisibility)
                : navigate("/auth/login")
            }
            alt="User"
          />
          {menuVisibility && (
            <div className="absolute flex flex-col right-0 top-14 bg-gray w-40 text-off-white items-center text-center rounded-br-lg rounded-bl-lg">
              <ul className="w-full">
                {userOptions.map((option, index) => (
                  <li
                    className={`text-center w-full hover:bg-gray-light cursor-pointer hover:text-black ${
                      option.name === "Logout" ? "mb-3" : ""
                    }`}
                    onClick={() => {
                      setMenuVisibility(false);
                      option.name === "Logout"
                        ? handleLogout()
                        : navigate(option.action);
                    }}
                    key={index}
                  >
                    {option.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <h1 className="text-white hidden md:flex my-auto ml-5">
          Kshs. {user ? user.wallet : 3000}
        </h1>
        <div className="relative items-center justify-center flex">
          <img
            src={Cart}
            className="h-7 md:h-10 my-auto ml-5 mr-5 cursor-pointer"
            onClick={handleCartView}
            alt="Cart"
          />
          <div
            className={`absolute flex flex-col right-2 top-2 ${
              !user ? "hidden" : ""
            } bg-red-700 w-4 h-4 text-sm md:right-14 md:w-5 md:h-5 text-off-white items-center text-center rounded-full`}
          >
            {totalQuantity}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

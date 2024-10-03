import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Home, LogIn, UserPlus, ShoppingCart, Search, User, Settings, FileText, LogOut, Menu, X } from 'lucide-react';
import { setSearchQuery, setCredentials, setUser, clearCart } from "../redux/slices";
import { persistor } from "../redux/store";
import axios from "axios";
import { toast } from 'react-toastify';
import api from "./utils/api";

const Navbar = () => {
  const [menuVisibility, setMenuVisibility] = useState(false);
  const [searchVisibility, setSearchVisibility] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation().pathname;

  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);
  const searchQuery = useSelector((state) => state.search.query);

  const userOptions = [
    { name: "Profile", action: "/user/profile", icon: User },
    { name: "Orders", action: "/user/orders", icon: FileText },
    { name: "Settings", action: "/user/settings", icon: Settings },
    { name: "Logout", action: "/user/logout", icon: LogOut },
  ];

  const handleCartView = () => {
    navigate("/user/cart");
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      dispatch(clearCart());
      dispatch(setCredentials(null));
      dispatch(setUser(null));
      persistor.purge();
      toast.success('Successfully logged out!');
      navigate("/", { replace: true });
    } catch (error) {
      toast.error('Error logging out. Please try again.');
    }
  };

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchClick = () => {
    setSearchVisibility(true);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setSearchVisibility(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (location.includes("dashboard")) return null;

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray text-white p-4 shadow-lg"
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 hover:text-gray-300 transition-colors">
          <Home className="h-6 w-6" />
          <span className="text-xl font-bold">NeemaCollection</span>
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="relative">
            {!searchVisibility ? (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearchClick} 
                className="flex items-center space-x-1 bg-gray-700 px-3 py-2 rounded-full hover:bg-gray-600 transition-colors"
              >
                <Search className="h-5 w-5" />
                <span>Search</span>
              </motion.button>
            ) : (
              <motion.input
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                ref={searchInputRef}
                type="text"
                className="p-2 border rounded-full w-64 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                placeholder="Type to search..."
              />
            )}
          </div>

          {user ? (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMenuVisibility(!menuVisibility)}
                className="flex items-center space-x-1 bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <User className="h-5 w-5" />
                <span>{user.name}</span>
              </motion.button>
              <AnimatePresence>
                {menuVisibility && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-[#333] rounded-md shadow-lg py-1 z-10"
                  >
                    {userOptions.map((option, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ backgroundColor: "#fa61d0" }}
                        onClick={() => {
                          setMenuVisibility(false);
                          option.name === "Logout" ? handleLogout() : navigate(option.action);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 w-full text-left"
                      >
                        <option.icon className="h-4 w-4" />
                        <span>{option.name}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/auth")}
                className="flex items-center space-x-1 bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/auth")}
                className="flex items-center space-x-1 bg-green-600 px-4 py-2 rounded-full hover:bg-green-700 transition-colors"
              >
                <UserPlus className="h-5 w-5" />
                <span>Sign Up</span>
              </motion.button>
            </>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCartView}
            className="relative flex items-center space-x-1 bg-yellow-600 px-4 py-2 rounded-full hover:bg-yellow-700 transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Cart</span>
            {totalQuantity > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                {totalQuantity}
              </motion.span>
            )}
          </motion.button>

        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4"
          >
            <div className="flex flex-col space-y-4">
              <motion.input
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                type="text"
                className="p-2 border rounded-full w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                placeholder="Type to search..."
              />
              {user ? (
                userOptions.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ backgroundColor: "#374151" }}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      option.name === "Logout" ? handleLogout() : navigate(option.action);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-white w-full text-left rounded-md"
                  >
                    <option.icon className="h-5 w-5" />
                    <span>{option.name}</span>
                  </motion.button>
                ))
              ) : (
                <>
                  <motion.button
                    whileHover={{ backgroundColor: "#374151" }}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/auth");
                    }}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-white w-full text-left rounded-md"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Login</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ backgroundColor: "#374151" }}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate("/auth");
                    }}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-white w-full text-left rounded-md"
                  >
                    <UserPlus className="h-5 w-5" />
                    <span>Sign Up</span>
                  </motion.button>
                </>
              )}
              <motion.button
                whileHover={{ backgroundColor: "#374151" }}
                onClick={handleCartView}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-white w-full text-left rounded-md"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Cart ({totalQuantity})</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Auth from "./components/auth";
import Dashboard from "./components/dashboard";
import Login from "./components/login";
import Navbar from "./components/Navbar2";
import Homepage from "./components/Homepage";
import Overview from "./components/dashboard/overview";
import Analitics from "./components/dashboard/analitics";
import Reports from "./components/dashboard/reports";
import Notifications from "./components/dashboard/notifications";
import Products from "./components/dashboard/products";
import AddProducts from "./components/products/addProducts";
import ProductList from "./components/products/productlist";
import Orders from "./components/orders";
import OrderList from "./components/Orderlist";
import Settings from "./components/Settings"
import { useSelector } from "react-redux";
import ShoppingCart from "./components/userCart";
import ProductDetail from "./components/productsPage";
import Payment from "./components/payment";
import React from "react";
import ForgotPassword from "./components/forgotPassword";
import ResetPassword from "./components/resetPassword";
import VerifyResetCode from "./components/verifyResetCode";


function App() {
  
  const user = useSelector((state) => state.auth.user)

  console.log (user)

  console.log(`App.jsx user verification ${Boolean(user)}`)
  // const navigate = useNavigate()


function RequireAdmin ({ children }) {

  if (!user.isAdmin ) {
    return <Navigate to="/auth/login" replace={true} />
  }
  return children;
}

function RequireAuth({ children }) {
  
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
}

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/auth/signup" element={<Auth />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/auth/verify-reset-code" element={<VerifyResetCode />} />
          <Route path="/dashboard" element={<RequireAdmin><Dashboard /></RequireAdmin>} >
            <Route
              index
              element={
                <Navigate to="overview" replace />
              }
           />
            <Route path="overview" element={<Overview />}/>
            <Route path="products/*" element={<Products />} >
            <Route
            index
            element={
              <Navigate to="productslist" replace />
            }
          />
              <Route path="productslist" element={<ProductList />} />
              <Route path="add" element={<AddProducts />} />
            </Route>
            <Route path="analitics" element={<Analitics />}/>
            <Route path="reports" element={<Reports />}/>
            <Route path="notifications" element={<Notifications />}/>
          </Route>            
          <Route path="/" element={<Homepage />} />
          <Route path="cart/checkout" element={ <RequireAuth> <Payment /></RequireAuth> } />
          <Route path="orderlist" element={<RequireAuth><OrderList OrderDate={undefined} OrderNumber={undefined} Price={undefined} image={undefined} Title={undefined} Status={undefined}/></RequireAuth>} />
          <Route path="orders" element={<RequireAuth><Orders /></RequireAuth>} />
          <Route path="user/settings" element={<RequireAuth><Settings /></RequireAuth>} />
          <Route path="user/cart" element={<RequireAuth><ShoppingCart /></RequireAuth>} />
          <Route path="/products/*" element={<ProductDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}


export default App;
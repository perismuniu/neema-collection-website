import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./components/auth";
import Dashboard from "./components/dashboard";
import ConnectedLogin from "./components/login";
import Navbar from "./components/Navbar2";
import Homepage from "./components/Homepage";
import Overview from "./components/dashboard/overview";
import Analitics from "./components/dashboard/analitics";
import Reports from "./components/dashboard/reports";
import Notifications from "./components/dashboard/notifications";
import Products from "./components/dashboard/products";
import AddProducts from "./components/products/addProducts";
import ProductList from "./components/products/productlist";
import Checkout from "./components/Checkout";
import Orders from "./components/orders";
import OrderList from "./components/Orderlist";
import Settings from "./components/Settings"
import { useSelector } from "react-redux";

function App() {
  const user = useSelector(state => state.user)


function RequireAdmin ({ children }) {

  if (!user.isAdmin ) {
    return <Navigate to="/auth/login" replace />;
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
          <Route path="/auth/login" element={<ConnectedLogin />} />
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
          <Route path="checkout" element={ <RequireAuth> <Checkout /></RequireAuth> } />
          <Route path="user/orderlist" element={<RequireAuth><OrderList /></RequireAuth>} />
          <Route path="orders" element={<Orders />} />
          <Route path="user/settings" element={<RequireAuth><Settings /></RequireAuth>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}


// Higher-order component to protect routes


// Higher-order component to protect admin routes

export default App;
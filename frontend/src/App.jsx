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
import  { NamedCheckout } from "./components/Checkout";
import Orders from "./components/orders";
import  { NamedOrderList } from "./components/Orderlist";
import { NamedSetting } from "./components/Settings"
import { useSelector } from "react-redux";
import  { NamedUserCart } from "./components/userCart";
import ProductsPage from "./components/productsPage";

function App() {
  const user = useSelector(state => state.auth.user)


function RequireAdmin ({ children }) {

  if (!user.isAdmin ) {
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
          <Route path="checkout" element={ <NamedCheckout /> } />
          <Route path="user/orders" element={<NamedOrderList />} />
          <Route path="orders" element={<Orders />} />
          <Route path="user/settings" element={<NamedSetting />} />
          {/* <Route path="user/profile" element={<RequireAuth><Profile /></RequireAuth>} /> */}
          <Route path="user/cart" element={<NamedUserCart/>} />
          <Route path="/products/*" element={<ProductsPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}


export default App;
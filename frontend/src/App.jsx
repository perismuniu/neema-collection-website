import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Auth from "./components/auth";
import Navbar from "./components/Navbar2";
import Footer from "./components/Footer";
import Homepage from "./components/Homepage";
import ErrorBoundary from "./components/utils/errorBoundary";
import ProductPage from "./components/productPage";
import Cart from "./components/cart";
import Checkout from "./components/Checkout";
import OrderSuccess from "./components/OrderSuccesPage";
import PaymentStatus from "./components/paymentStatus";
import OrderFailed from "./components/OrderFailedPage";
import Settings from "./components/Settings";
import Notfound from "./components/Notfound";
import Orders from "./components/orders";
import ContactSupport from "./components/support";
import ForgotPassword from "./components/forgotPassword";
import VerifyResetCode from "./components/verifyResetCode";
import ResetPassword from "./components/resetPassword";
import Profile from "./components/profile";
import Dashboard, {
  NotificationContent,
  Overview,
} from "./components/dashboard";
import Products from "./components/dashboard/products";
import CustomersComponent from "./components/customer";
import SettingsComponent from "./components/adminSettings";
import ProtectedRoute from "./components/protectedRoute";
import NotificationSoundManager from "./components/utils/notificationSound";
import AdminProtectedRoute from "./components/adminProtectedRoute";

const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith("/auth");
  const isDashboardPage = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!isAuthPage && !isDashboardPage && <Navbar />}
      {children}
      {!isAuthPage && !isDashboardPage && <Footer />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Layout>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/user/cart" element={<Cart />} />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/auth/*" element={<Auth />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/verify-reset-code" element={<VerifyResetCode />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/payment-status" element={<PaymentStatus />} />
              <Route 
                path="user/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="user/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route path="/order-failed" element={<OrderFailed />} />
              <Route 
                path="/user/orders" 
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } 
              />
              <Route path="/support" element={<ContactSupport />} />
              
              {/* Dashboard routes wrapped with AdminProtectedRoute */}
              <Route
                path="/dashboard/*"
                element={
                  <AdminProtectedRoute>
                    <Dashboard />
                  </AdminProtectedRoute>
                }
              >
                <Route
                  index
                  element={<Navigate to="/dashboard/overview" replace />}
                />
                <Route path="overview" element={<Overview />} />
                <Route path="notifications" element={<NotificationContent />} />
                <Route path="products" element={<Products />} />
                <Route path="customers" element={<CustomersComponent />} />
                <Route path="settings" element={<SettingsComponent />} />
              </Route>
              
              <Route path="*" element={<Notfound />} />
            </Routes>
          </AnimatePresence>
        </Layout>
        <NotificationSoundManager />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
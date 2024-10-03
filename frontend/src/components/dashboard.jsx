import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Settings,
  LogOut,
  Home,
  Package,
  Users,
  MessageCircle,
  ShoppingBag,
  Bell,
} from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/products/UIComponents";
import api from "./utils/api";
import ErrorBoundary from "./utils/errorBoundary";
import { persistor } from "../redux/store";

const MotionButton = motion.create("button");

const NavItem = ({ icon: Icon, label, isActive, onClick, className }) => {

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      // Clear local storage
      localStorage.removeItem('token');
      // Clear Redux state
      persistor.purge();
      // Redirect to login page or home
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
  <MotionButton
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center space-x-2 px-4 py-2 rounded-md w-full ${
      isActive ? "bg-pink text-white" : "text-gray-700 hover:bg-gray-100"
    } ${className}`}
    onClick={label === "Logout" ? handleLogout : onClick}
  >
    <Icon size={20} />
    <span>{label}</span>
  </MotionButton>
)};

const Sidebar = ({ activeTab, setActiveTab }) => (
  <div className="w-64 bg-white p-4 flex flex-col h-full">
    <h1 className="text-2xl font-bold mb-8">Neema Collections</h1>
    <nav className="space-y-2 flex-grow">
      <Link to="/dashboard/overview">
        <NavItem
          icon={Home}
          label="Overview"
          isActive={activeTab === "overview"}
          onClick={() => setActiveTab("overview")}
        />
      </Link>
      <Link to="/dashboard/products">
        <NavItem
          icon={Package}
          label="Products"
          isActive={activeTab === "products"}
          onClick={() => setActiveTab("products")}
        />
      </Link>
      <Link to="/dashboard/customers">
        <NavItem
          icon={Users}
          label="Customers"
          isActive={activeTab === "customers"}
          onClick={() => setActiveTab("customers")}
        />
      </Link>
      <Link to="/dashboard/notifications">
        <NavItem
          icon={Bell}
          label="Notifications"
          isActive={activeTab === "notifications"}
          onClick={() => setActiveTab("notifications")}
          className="md:hidden" // Hide on medium screens and above
        />
      </Link>
      <Link to="/dashboard/settings">
        <NavItem
          icon={Settings}
          label="Settings"
          isActive={activeTab === "settings"}
          onClick={() => setActiveTab("settings")}
        />
      </Link>
    </nav>
    <NavItem icon={LogOut} label="Logout" />
  </div>
);


const StatCard = ({ title, value, change, bgColor }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`${bgColor} p-4 rounded-lg text-white`}
  >
    <h3 className="text-sm mb-2">{title}</h3>
    <p className="text-3xl font-bold">{value}</p>
    <p className="text-sm">{change}</p>
  </motion.div>
);

const RevenueChart = () => {
  const [timeframe, setTimeframe] = useState("month");
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/dashboard/revenue?timeframe=${timeframe}`);
        setRevenueData(response.data);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        setError("Failed to load revenue data");
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, [timeframe]);

  const formatYAxis = (value) => `KsHs ${value.toLocaleString()}`;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Revenue vs Orders</h3>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {loading ? (
        <div className="h-[300px] flex items-center justify-center">
          Loading...
        </div>
      ) : error ? (
        <div className="h-[300px] flex items-center justify-center text-red-500">
          {error}
        </div>
      ) : revenueData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatYAxis} />
            <Tooltip 
              formatter={(value, name) => [
                name === 'revenue' ? `KsHs ${value.toLocaleString()}` : value,
                name === 'revenue' ? 'Revenue' : 'Orders'
              ]}
            />
            <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
            <Bar dataKey="orders" name="Orders" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center">
          No data available
        </div>
      )}
    </div>
  );
};

export const NotificationContent = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await api.get("/notifications");
        setNotifications(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        Loading notifications...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Notifications</h2>
      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className="flex items-start space-x-3 bg-white p-4 rounded-lg shadow"
            >
              {notification.type === "order" && <ShoppingBag className="text-pink" />}
              {notification.type === "message" && <MessageCircle className="text-pink" />}
              <div>
                <p className="font-semibold">{notification.title}</p>
                <p className="text-gray-600">{notification.content}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No notifications found</div>
        )}
      </div>
    </div>
  );
};

const TopProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/dashboard/top-products");
        setProducts(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching top products:", error);
        setError("Failed to load top products");
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  if (loading) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[200px] flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="mb-6 bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4">Top Products</h3>
      {products.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-2 font-semibold">Item</th>
                <th className="pb-2 font-semibold">Price</th>
                <th className="pb-2 font-semibold">Sold</th>
                <th className="pb-2 font-semibold">Sales</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b last:border-b-0">
                  <td className="py-3">{product.title}</td>
                  <td className="py-3">KsHs {product.price.toLocaleString()}</td>
                  <td className="py-3">{product.soldCount || 0}</td>
                  <td className="py-3">
                    KsHs {((product.soldCount || 0) * product.price).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-[100px] flex items-center justify-center">
          No products available
        </div>
      )}
    </div>
  );
};

export const Overview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function ErrorFallback({ error }) {
    return (
      <div className="text-red-500 p-4">
        <p>Something went wrong:</p>
        <pre>{error.message}</pre>
      </div>
    );
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get("/dashboard/stats");
        setStats(response.data);
        setError(null);
      } catch (error) {
        // console.error("Error fetching dashboard stats:", error);
        setError("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        Loading overview...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="h-full flex items-center justify-center">
        No data available
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">
        Welcome back, {stats.userName}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <StatCard
          title="Total Sales"
          value={`KsHs ${stats.totalSales.toLocaleString()}`}
          change={`${stats.salesChange}% Last month`}
          bgColor="bg-pink"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          change={`${stats.ordersChange}% Last month`}
          bgColor="bg-blue-500"
        />
      </div>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <RevenueChart />
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <TopProducts />
      </ErrorBoundary>
    </>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <div className="hidden md:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="flex-grow p-8 overflow-y-auto">
        <Outlet />
      </div>
      <div className="hidden lg:block w-80 bg-white p-4 overflow-y-auto">
        <NotificationContent />
      </div>
      {/* Mobile notification toggle */}
      <button
        className="md:hidden fixed bottom-4 right-4 bg-pink text-white p-3 rounded-full shadow-lg"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell size={24} />
      </button>
      {/* Mobile notification sidebar */}
      {showNotifications && (
        <div className="md:hidden fixed inset-0  bg-gray-100 p-4 overflow-y-auto">
          <NotificationContent />
          <button
            className="absolute top-4 right-4 bg-pink text-white p-3 rounded-full shadow-lg"
            onClick={() => setShowNotifications(false)}
          >
            <Bell size={24} />
          </button>
        </div>
      )}
    </div>
  );
};


export default Dashboard;

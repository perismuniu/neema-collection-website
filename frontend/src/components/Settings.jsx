import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Mail, Lock, CreditCard, ChevronDown, ChevronUp, Edit2, AlertTriangle, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import {toast} from 'react-toastify';
import { updateProfile } from '../redux/slices';
import api from './utils/api'

const Settings = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [isEditing, setIsEditing] = useState({});
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const returnTo = location.state?.returnTo;
  const message = location.state?.message;

  const [formData, setFormData] = useState({
    username: user?.username || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
  });

  useEffect(() => {
    if (message) {
      toast.info(message);
    }
  }, [message]);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleEdit = (field) => {
    setIsEditing(prev => ({ ...prev, [field]: true }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (field) => {
    // console.log(field, formData[field])
    try {
      // console.log("trying")
      const response = await api.put('/update-profile', {
        [field]: formData[field]
      });
      // console.log(response)
      // console.log("trying 1")
      // Dispatch the update to Redux
      dispatch(updateProfile({ [field]: formData[field] }));
      
      setIsEditing(prev => ({ ...prev, [field]: false }));
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
      
      if (returnTo) {
        navigate(returnTo);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const currentPassword = e.target.currentPassword.value;
    const newPassword = e.target.newPassword.value;

    if (!currentPassword || !newPassword) {
      toast.error('Both current and new passwords are required');
      return;
    }

    try {
      await api.put('/update-password', {
        currentPassword,
        newPassword
      });
      toast.success('Password updated successfully');
      e.target.reset();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    }
  };

  const EditableField = ({ label, value, name, icon: Icon }) => (
    <div className="flex items-center mb-4">
      <Icon className="mr-4 text-gray-500" size={20} />
      <div className="flex-grow">
        <p className="text-sm text-gray-600">{label}</p>
        {isEditing[name] ? (
          <div className="flex items-center">
            <input
              type="text"
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="flex-grow p-2 border rounded mr-2"
            />
            <motion.button
              onClick={() => handleUpdate(name)}
              className="text-green-500"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              save
              <Save size={16} />
            </motion.button>
          </div>
        ) : (
          <div className="flex items-center">
            <p className="font-semibold">{value}</p>
            <motion.button
              onClick={() => handleEdit(name)}
              className="ml-4 text-pink-500 flex items-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit2 size={16} className="mr-1" />
              <span className="text-sm">Edit</span>
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );

  const SectionHeader = ({ icon: Icon, title, section }) => (
    <motion.button
      className="w-full bg-white shadow-md rounded-lg p-4 mt-4 flex items-center justify-between"
      onClick={() => toggleSection(section)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center">
        <Icon className="mr-4 text-pink-500" size={24} />
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      {activeSection === section ? <ChevronUp /> : <ChevronDown />}
    </motion.button>
  );

  // // Use loading state in UI
  // if (loading) {
  //   return <LoadingSpinner />;
  // }

  // // Use error state in UI
  // if (error) {
  //   toast.error(error);
  // }

  return (
    <div className="max-w-2xl mx-auto pt-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Account Settings</h1>

      <SectionHeader icon={User} title="Personal Information" section="personal" />
      <AnimatePresence>
        {activeSection === 'personal' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white shadow-md rounded-lg p-6 mt-2"
          >
            <EditableField label="Username" value={user.username} name="username" icon={User} />
            <EditableField label="Phone Number" value={user.phone} name="phone" icon={Phone} />
            <EditableField label="Email Address" value={user.email} name="email" icon={Mail} />
            <EditableField label="Delivery Address" value={user.address} name="address" icon={CreditCard} />
          </motion.div>
        )}
      </AnimatePresence>

      <SectionHeader icon={Lock} title="Password Settings" section="password" />
      <AnimatePresence>
        {activeSection === 'password' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white shadow-md rounded-lg p-6 mt-2"
          >
            <form onSubmit={handlePasswordUpdate}>
              <div className="mb-4">
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                <input type="password" id="currentPassword" name="currentPassword" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                <input type="password" id="newPassword" name="newPassword" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
              </div>
              <motion.button
                type="submit"
                className="w-full bg-pink-500 text-white py-2 rounded-md font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Update Password
              </motion.button>
            </form>
            <p className="mt-4 text-sm text-gray-600">
              Can't remember your current password? <Link to="/auth/forgot-password" className="text-pink-500 font-semibold">Reset your password</Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
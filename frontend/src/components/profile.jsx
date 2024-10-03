import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Mail, Camera, Save, X } from 'lucide-react';
import { updateProfile } from '../redux/slices';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username,
    phone: user.phone,
    email: user.email,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
    setIsEditing(false);
  };

  const ProfileField = ({ icon: Icon, label, value, name }) => (
    <div className="flex items-center mb-4">
      <Icon className="mr-4 text-pink-500" size={24} />
      <div className="flex-grow">
        <p className="text-sm text-gray-600">{label}</p>
        {isEditing ? (
          <input
            type="text"
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        ) : (
          <p className="font-semibold">{value}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto pt-10 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-md rounded-lg p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Profile</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-md ${
              isEditing ? 'bg-gray-200 text-gray-800' : 'bg-pink-500 text-white'
            }`}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </motion.button>
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={user.profilePicture || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover"
            />
            {isEditing && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-0 right-0 bg-pink-500 text-white p-2 rounded-full"
              >
                <Camera size={20} />
              </motion.button>
            )}
          </div>
          <h2 className="mt-4 text-2xl font-semibold">{user.username}</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <ProfileField icon={User} label="Username" value={user.username} name="username" />
          <ProfileField icon={Phone} label="Phone Number" value={user.phone} name="phone" />
          <ProfileField icon={Mail} label="Email Address" value={user.email} name="email" />

          <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full bg-pink-500 text-white py-2 rounded-md font-semibold flex items-center justify-center"
                >
                  <Save className="mr-2" size={20} />
                  Save Changes
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;
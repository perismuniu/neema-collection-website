import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import api from './utils/api'

const ContactSupport = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [contactMethod, setContactMethod] = useState('whatsapp');
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        name: user.username || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      switch (contactMethod) {
        case 'whatsapp':
          // Send notification to backend first
          await api.post('/contact/whatsapp', {
            name: formData.name,
            phoneNumber: '23353260111', // You might want to make this configurable
            message: formData.message
          });
          
          // Then open WhatsApp
          const whatsappMessage = encodeURIComponent(formData.message);
          const whatsappNumber = '23353260111';
          window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');
          toast.success('Redirecting to WhatsApp...');
          break;
          
        case 'email':
          await api.post('/contact/email', {
            name: formData.name,
            email: formData.email,
            message: formData.message
          });
          toast.success('Your email has been sent. We\'ll get back to you soon!');
          setFormData({ ...formData, message: '' });
          break;
          
        case 'inapp':
          toast.info('In-app messaging is a future feature and not yet available.');
          break;
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Error sending message:', error);
    }
  };

  const handleWhatsAppClick = async () => {
    try {
      // Send notification to backend first
      await api.post('/contact/whatsapp', {
        name: formData.name,
        phoneNumber: '23353260111',
        message: formData.message
      });
      
      // Then open WhatsApp
      const supportMessage = encodeURIComponent(formData.message);
      const whatsappNumber = '23353260111';
      window.open(`https://wa.me/${whatsappNumber}?text=${supportMessage}`, '_blank');
      toast.success('Opening WhatsApp...');
    } catch (error) {
      toast.error('Failed to send notification. Please try again.');
      console.error('Error sending notification:', error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-5 text-center">Contact Support</h2>
      <div className="mb-4">
        <label className="block mb-2">Contact Method</label>
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setContactMethod('whatsapp')}
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${contactMethod === 'whatsapp' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            <MessageCircle className="mr-2" size={20} />
            WhatsApp
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setContactMethod('inapp')}
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${contactMethod === 'inapp' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            <Send className="mr-2" size={20} />
            In-App
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setContactMethod('email')}
            className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center ${contactMethod === 'email' ? 'bg-pink text-white' : 'bg-gray-200'}`}
          >
            <Mail className="mr-2" size={20} />
            Email
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {contactMethod === 'whatsapp' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center justify-center space-y-4"
          >
            <MessageCircle size={100} className="text-green-500" />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWhatsAppClick}
              className="w-full bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 transition-colors text-lg font-semibold"
            >
              WhatsApp Message Now
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {contactMethod !== 'whatsapp' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence>
            {contactMethod === 'email' && (
              <>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label htmlFor="name" className="block mb-1">Name</label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label htmlFor="email" className="block mb-1">Email</label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink"
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
          <div>
            <label htmlFor="message" className="block mb-1">Message</label>
            <motion.textarea
              whileFocus={{ scale: 1.02 }}
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink"
              rows="4"
            ></motion.textarea>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-pink text-white py-2 rounded-md hover:bg-pink-600 transition-colors flex items-center justify-center"
          >
            {contactMethod === 'inapp' ? (
              <>
                <Send className="mr-2" size={20} />
                Send In-App Message
              </>
            ) : (
              <>
                <Mail className="mr-2" size={20} />
                Send Email
              </>
            )}
          </motion.button>
        </form>
      )}
    </motion.div>
  );
};

export default ContactSupport;
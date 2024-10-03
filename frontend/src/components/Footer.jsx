import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.footer 
      className="mt-28 bg-gray text-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold mb-4">NEEMA COLLECTIONS</h2>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                +254 797 528 444
              </li>
              <li className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Sawa Mall, Shop C8, 3rd floor
              </li>
              <li className="ml-7">Moi Avenue, Nairobi</li>
              <li className="ml-7">Kenya</li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-xl font-bold mb-4">MY ACCOUNT</h2>
            <ul className="space-y-2">
              <li><Link to="/user/profile" className="hover:text-pink transition-colors">My Profile</Link></li>
              <li><Link to="/user/orders" className="hover:text-pink transition-colors">My Orders</Link></li>
              <li><Link to="/user/settings" className="hover:text-pink transition-colors">Account Settings</Link></li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-xl font-bold mb-4">USEFUL LINKS</h2>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-pink transition-colors">About Us</Link></li>
              {/* <li><Link to="/blog" className="hover:text-pink transition-colors">Blog</Link></li> */}
              <li><Link to="/faq" className="hover:text-pink transition-colors">FAQs</Link></li>
              <li><Link to="/support" className="hover:text-pink transition-colors">Contact Support</Link></li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-xl font-bold mb-4">CUSTOMER SERVICE</h2>
            <ul className="space-y-2">
              <li><Link to="/terms" className="hover:text-pink transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-pink transition-colors">Privacy Policy</Link></li>
              <li><Link to="/shipping" className="hover:text-pink transition-colors">Shipping Information</Link></li>
            </ul>
          </motion.div>
        </div>

        <motion.div 
          className="mt-12 pt-8 border-t border-gray-700"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400">Your choice, is our best option</p>
            </div>
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <span className="flex items-center">
                <CreditCard className="w-6 h-6 mr-2" />
                Payment Options:
              </span>
              <img src="/path/to/mpesa-logo.png" alt="M-Pesa" className="h-8" />
              <img src="/path/to/stripe-logo.png" alt="Stripe" className="h-8" />
            </div>
            <div className="flex space-x-4">
              <motion.a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="hover:text-pink transition-colors"
              >
                <Facebook />
              </motion.a>
              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="hover:text-pink transition-colors"
              >
                <Instagram />
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="hover:text-pink transition-colors"
              >
                <Twitter />
              </motion.a>
            </div>
          </div>
          <div className="mt-4 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Neema Collection. All rights reserved.</p>
            <p>Designed and built by KashTech Solutions</p>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
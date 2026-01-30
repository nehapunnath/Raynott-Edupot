// src/components/layout/Header.jsx
import React, { useState } from 'react';
import { Menu, X, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { 
      label: 'Home', 
      href: '/'
    },
    { 
      label: 'About Us', 
      href: '/about'
    },
    { 
      label: 'Features', 
      href: '/features'
    },
    { 
      label: 'Contact', 
      href: '/contact'
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-amber-700  shadow-2xl backdrop-blur-lg border-b border-amber-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3 group cursor-pointer"
          >
           
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Raynott Edupot
              </h1>
              <p className="text-amber-100 text-sm font-medium">School Financial Management</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="relative group"
              >
                <span className="text-white font-medium text-lg hover:text-amber-100 transition-colors px-2 py-1">
                  {item.label}
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-white to-amber-200 group-hover:w-full transition-all duration-300"></div>
              </a>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-6"
              >
                <div className="text-right">
                  <p className="text-white font-medium">Welcome back!</p>
                  <p className="text-amber-200 text-sm">{user.name}</p>
                </div>
                <motion.button
                  onClick={onLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl hover:shadow-2xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg"
                >
                  Go to Dashboard
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-6"
              >
                <motion.a
                  href="/login"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-white to-amber-50 text-amber-700 font-bold rounded-xl hover:shadow-2xl hover:from-amber-50 hover:to-white transition-all shadow-lg border border-amber-200"
                >
                  Login / Register
                </motion.a>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-3 bg-white/20 rounded-xl text-white hover:bg-white/30 transition backdrop-blur-sm"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-gradient-to-b from-white to-amber-50 rounded-2xl shadow-2xl border border-amber-200 overflow-hidden mt-2 backdrop-blur-sm"
            >
              <div className="px-4 py-6 space-y-1">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block px-4 py-3 text-amber-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-amber-100 hover:text-amber-800 rounded-lg transition-colors font-medium text-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                {!user && (
                  <a
                    href="/login"
                    className="block px-4 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-lg hover:from-amber-700 hover:to-amber-800 transition text-center mt-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login / Register
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
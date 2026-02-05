// src/components/layout/Footer.jsx
import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Heart,
  ArrowUp,
  BookOpen,
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Features', href: '/features' },
    { label: 'Contact', href: '/contact' },
    { label: 'Login', href: '/login' },
    { label: 'Dashboard', href: '/dashboard' },
    // { label: 'Admin Dashboard', href: '/admin/dashboard' }

  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Instagram, href: '#', label: 'Instagram' }
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'hello@raynottedupot.com',
      color: 'from-amber-500/10 to-amber-600/10'
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+91 98765 43210',
      color: 'from-amber-600/10 to-amber-700/10'
    },
    {
      icon: MapPin,
      title: 'Address',
      value: '123 Education Street, Knowledge City',
      color: 'from-amber-700/10 to-amber-800/10'
    }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-amber-600 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Main Footer Content - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand Column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-800 rounded-2xl blur opacity-50"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-r from-amber-700 to-amber-900 rounded-2xl flex items-center justify-center shadow-xl">
                    <BookOpen className="text-white" size={28} />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Raynott Edupot</h3>
                  <p className="text-amber-200 font-medium">School Financial Management</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Transforming school financial management with innovative technology 
                and exceptional user experience.
              </p>
              
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-amber-600 hover:to-amber-700 transition-all hover:scale-110 border border-gray-700 hover:border-amber-500"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-gray-400 hover:text-white" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Links Column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-amber-300 transition-colors flex items-center group"
                    >
                      <span className="w-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-400 group-hover:w-3 mr-3 transition-all"></span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Contact Column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-lg font-bold mb-6 text-white">Contact Us</h4>
              <div className="space-y-4">
                {contactInfo.map((contact, idx) => (
                  <div key={idx} className="flex items-center space-x-4 text-gray-400 group">
                    <div className={`w-12 h-12 bg-gradient-to-r ${contact.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <contact.icon className="text-amber-400 group-hover:text-amber-300" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-amber-200 group-hover:text-amber-100">{contact.title}</p>
                      <p className="group-hover:text-white transition-colors text-sm">{contact.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 text-gray-500 mb-4 md:mb-0">
            <span>© {new Date().getFullYear()} Raynott Edupot. All rights reserved.</span>
            <Heart className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <a href="/privacy" className="hover:text-amber-300 transition">Privacy Policy</a>
            <a href="/terms" className="hover:text-amber-300 transition">Terms of Service</a>
            <a href="/cookies" className="hover:text-amber-300 transition">Cookie Policy</a>
          </div>

         
        </div>
      </div>
    </footer>
  );
};

export default Footer;
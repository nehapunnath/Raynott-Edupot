// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, School, Calculator, ShieldCheck, LogIn } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      onLogin({ 
        email: formData.email, 
        name: formData.email.split('@')[0] || 'Admin User' 
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-amber-100/30 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl bg-gradient-to-br from-white to-amber-50 rounded-3xl shadow-2xl overflow-hidden border border-amber-200"
      >
        <div className="flex flex-col lg:flex-row">
          {/* Brand Section */}
          <div className="lg:w-2/5 bg-gradient-to-br from-amber-800 via-amber-700 to-amber-600 p-8 md:p-12 text-white flex flex-col justify-center relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 bg-amber-300 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-amber-400 rounded-full blur-3xl"></div>
            </div>

            <div className="relative mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-400 rounded-2xl blur opacity-50"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-r from-amber-600 to-amber-800 rounded-2xl flex items-center justify-center shadow-xl">
                    <BookOpen className="text-white" size={30} />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Raynott Edupot</h1>
                  <p className="text-amber-200 font-medium">School Financial Management</p>
                </div>
              </div>
              <p className="text-amber-100/90 leading-relaxed">
                Join thousands of schools using our platform to streamline fee management, 
                track payments, and improve financial operations.
              </p>
            </div>
            
            <div className="relative space-y-6">
              {[
                {
                  icon: School,
                  title: "School Management",
                  description: "Complete control over student data and fee structures",
                  color: "from-amber-500 to-amber-600"
                },
                {
                  icon: Calculator,
                  title: "Smart Calculations",
                  description: "Automatic fee calculations and installment tracking",
                  color: "from-amber-600 to-amber-700"
                },
                {
                  icon: ShieldCheck,
                  title: "Enterprise Security",
                  description: "Bank-level encryption and data protection",
                  color: "from-amber-700 to-amber-800"
                }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-4 group">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <feature.icon className="text-white" size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-amber-100 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-amber-200/80">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative mt-8 pt-8 border-t border-amber-500/30">
              <div className="flex items-center justify-center space-x-8 text-center">
                <div>
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm text-amber-200/80">Schools</div>
                </div>
                <div className="h-8 w-px bg-amber-500/50"></div>
                <div>
                  <div className="text-2xl font-bold">99.9%</div>
                  <div className="text-sm text-amber-200/80">Uptime</div>
                </div>
                <div className="h-8 w-px bg-amber-500/50"></div>
                <div>
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm text-amber-200/80">Support</div>
                </div>
              </div>
            </div>
          </div>

          {/* Login Form Section */}
          <div className="lg:w-3/5 p-8 md:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">
                  Welcome 
                </h2>
                <p className="text-gray-600 mt-2">
                  Sign in to access your school dashboard
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gradient-to-b from-white to-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                    placeholder="Enter your Email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gradient-to-b from-white to-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-amber-700 hover:to-amber-800 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <LogIn size={20} />
                  <span>Sign In</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
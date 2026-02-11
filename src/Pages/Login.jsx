// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, School, Calculator, ShieldCheck, LogIn } from 'lucide-react';
import AuthApi from '../service/AuthApi';   // ← import here
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate=useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // clear error when typing
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  const result = await AuthApi.login(formData.email.trim(), formData.password);

  setLoading(false);

  if (result.success) {
    const user = result.user;

    toast.success("Logged in successfully!");

    // Redirect based on role
    if (user.isAdmin) {
      navigate('/admin/dashboard');           // super admin
    } else if (user.schoolId && user.role === 'school_admin') {
      navigate('/dashboard');                 // school admin dashboard
      // You can also store schoolId in context/localStorage if needed
      localStorage.setItem('schoolId', user.schoolId);
    } else {
      toast.warning("Unknown user role. Contact support.");
      // Or redirect to a generic page
      navigate('/');
    }
  } else {
    setError(result.error || 'Login failed. Please try again.');
  }
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
          {/* Brand Section - unchanged */}
          <div className="lg:w-2/5 bg-gradient-to-br from-amber-800 via-amber-700 to-amber-600 p-8 md:p-12 text-white flex flex-col justify-center relative overflow-hidden">
            {/* ... background pattern, logo, features, stats ... */}
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
                Join thousands of schools using our platform to streamline fee management, track payments, and improve financial operations.
              </p>
            </div>

            <div className="relative space-y-6">
              {[
                { icon: School, title: "School Management", description: "Complete control over student data and fee structures", color: "from-amber-500 to-amber-600" },
                { icon: Calculator, title: "Smart Calculations", description: "Automatic fee calculations and installment tracking", color: "from-amber-600 to-amber-700" },
                { icon: ShieldCheck, title: "Enterprise Security", description: "Bank-level encryption and data protection", color: "from-amber-700 to-amber-800" },
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center space-x-4 group">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <feature.icon className="text-white" size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-amber-100 transition-colors">{feature.title}</h3>
                    <p className="text-sm text-amber-200/80">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative mt-8 pt-8 border-t border-amber-500/30">
              <div className="flex items-center justify-center space-x-8 text-center">
                <div><div className="text-2xl font-bold">500+</div><div className="text-sm text-amber-200/80">Schools</div></div>
                <div className="h-8 w-px bg-amber-500/50"></div>
                <div><div className="text-2xl font-bold">99.9%</div><div className="text-sm text-amber-200/80">Uptime</div></div>
                <div className="h-8 w-px bg-amber-500/50"></div>
                <div><div className="text-2xl font-bold">24/7</div><div className="text-sm text-amber-200/80">Support</div></div>
              </div>
            </div>
          </div>

          {/* Login Form Section */}
          <div className="lg:w-3/5 p-8 md:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Welcome</h2>
                <p className="text-gray-600 mt-2">Sign in to access your school dashboard</p>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gradient-to-b from-white to-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                    placeholder="Enter your Email"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gradient-to-b from-white to-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 ${
                    loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-amber-700 hover:to-amber-800'
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={20} />
                      <span>Sign In</span>
                    </>
                  )}
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
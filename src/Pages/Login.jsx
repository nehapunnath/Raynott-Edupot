// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, School, Calculator, Receipt, Lock, ShieldCheck, LogIn, UserPlus } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    schoolName: '',
    role: 'admin'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    onLogin({ email: formData.email, name: formData.name || 'Admin' });
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

          {/* Form Section */}
          <div className="lg:w-3/5 p-8 md:p-12">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-gray-600 mt-2">
                  {isLogin ? 'Sign in to your school dashboard' : 'Start your journey with us'}
                </p>
              </div>
              <div className="flex space-x-2 bg-gradient-to-r from-amber-100 to-amber-50 rounded-xl p-1 border border-amber-200">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${isLogin ? 'bg-white text-amber-700 shadow' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${!isLogin ? 'bg-white text-amber-700 shadow' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  Register
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gradient-to-b from-white to-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                        placeholder="Enter your full name"
                        required={!isLogin}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        School Name
                      </label>
                      <input
                        type="text"
                        name="schoolName"
                        value={formData.schoolName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gradient-to-b from-white to-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                        placeholder="Enter school name"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

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
                  placeholder="Enter your email"
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

              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gradient-to-b from-white to-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                      placeholder="Confirm your password"
                      required={!isLogin}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gradient-to-b from-white to-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition appearance-none"
                    >
                      <option value="admin">Administrator</option>
                      <option value="accountant">Accountant</option>
                      <option value="teacher">Teacher</option>
                      <option value="principal">Principal</option>
                    </select>
                  </div>
                </motion.div>
              )}

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-amber-600 bg-gradient-to-b from-white to-amber-50 border-amber-300 rounded focus:ring-amber-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                {isLogin && (
                  <a href="#" className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                    Forgot your password?
                  </a>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-amber-700 hover:to-amber-800 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                {isLogin ? (
                  <>
                    <LogIn size={20} />
                    <span>Sign In to Dashboard</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-amber-200">
              <div className="text-center">
                <p className="text-gray-600">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-amber-600 font-semibold hover:text-amber-700"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>

              {/* <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-amber-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl text-gray-700 hover:bg-amber-50 transition flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl text-gray-700 hover:bg-amber-50 transition flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Facebook</span>
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
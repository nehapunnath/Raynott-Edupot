// src/pages/HomePage.jsx
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Users, 
  TrendingUp, 
  Cloud,
  Smartphone,
  Globe,
  CheckCircle,
  ArrowRight,
  Award,
  Rocket,
  Calculator,
  Calendar,
  Receipt,
  Wallet,
  PieChart,
  CreditCard,
  School,
  BookOpen,
  GraduationCap,
  FileText,
  Lock,
  BarChart3,
  MessageSquare,
  Headphones,
  UserPlus,
  Sparkles,
  Target,
  Clock,
  Bell,
  Star,
  Quote,
  Shield,
  FileCheck,
  Database,
  Key,
  EyeOff
} from 'lucide-react';
import { motion } from 'framer-motion';

const Home = ({ user, onLogout }) => {
  const [email, setEmail] = useState('');

  const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="group relative bg-gradient-to-br from-white to-amber-50/50 rounded-2xl shadow-xl p-8 border border-amber-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 via-amber-100/0 to-amber-200/0 group-hover:from-amber-50/20 group-hover:via-amber-100/10 group-hover:to-amber-200/5 transition-all duration-500"></div>
      
      <div className="relative">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 rounded-xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
          <div className="relative w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
            <Icon className="text-white" size={32} />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-amber-700 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed mb-6">{description}</p>
        
        <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-amber-500 to-amber-700 group-hover:w-full transition-all duration-500"></div>
      </div>
    </motion.div>
  );

  const ValueProp = ({ icon: Icon, title, description, gradient }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white rounded-2xl shadow-lg p-8 border border-amber-100 hover:shadow-2xl transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 to-amber-100/0 group-hover:from-amber-50/30 group-hover:to-amber-100/20 transition-all duration-500"></div>
      
      <div className="relative flex items-start space-x-6">
        <div className={`p-4 ${gradient} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="text-white" size={28} />
        </div>
        <div className="flex-1">
          <h4 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-amber-700 transition-colors duration-300">
            {title}
          </h4>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-amber-50/20">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700">
        <div className="absolute inset-0">
          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-amber-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-amber-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-500"></div>
          
          {/* Geometric patterns */}
          <div className="absolute top-20 right-20 w-40 h-40 border-2 border-amber-500/30 rounded-3xl rotate-45"></div>
          <div className="absolute bottom-40 left-20 w-24 h-24 border-2 border-amber-400/30 rounded-2xl rotate-12"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-full mb-8 border border-white/20">
                <Sparkles className="mr-3" size={20} />
                <span className="font-semibold">Trusted by 500+ Schools Nationwide</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
                Modern Fee Management
                <span className="block text-amber-200 mt-4">for Modern Schools</span>
              </h1>
              
              <p className="text-xl text-amber-100/90 mb-10 max-w-2xl leading-relaxed">
                Raynott Edupot transforms school financial management with elegant design, 
                powerful features, and intuitive workflows. Say goodbye to spreadsheets and 
                hello to efficiency.
              </p>

              <div className="flex flex-wrap gap-6">
                <motion.a
                  href="/login"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl hover:shadow-2xl transition-all shadow-xl group flex items-center space-x-3 hover:from-amber-600 hover:to-amber-700"
                >
                  <Rocket size={24} />
                  <span>Get Start Now</span>
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
                </motion.a>
                
                
              </div>

              <div className="mt-16 grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                  <div className="text-amber-200/80 font-medium">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">24/7</div>
                  <div className="text-amber-200/80 font-medium">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">5min</div>
                  <div className="text-amber-200/80 font-medium">Setup</div>
                </div>
              </div>
            </motion.div>

            {/* Testimonials Section in Hero */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-600/20 to-amber-400/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-gradient-to-br from-white to-amber-50 rounded-3xl shadow-2xl p-8 border border-amber-200/50 backdrop-blur-sm">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-r from-amber-600 to-amber-800 rounded-2xl flex items-center justify-center shadow-lg">
                    <Quote className="text-white" size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">What Schools Say</h3>
                    <p className="text-gray-600">Trusted by educators nationwide</p>
                  </div>
                </div>
                
                <div className="space-y-8">
                  {[
                    {
                      name: "Dr. Sarah Johnson",
                      role: "Principal, Greenwood High",
                      content: "Raynott Edupot has transformed how we manage finances. What used to take days now takes minutes.",
                      rating: 5
                    },
                    {
                      name: "Michael Chen",
                      role: "Bursar, Oakridge International",
                      content: "The reporting features alone have saved us hundreds of hours each semester. Incredible tool.",
                      rating: 5
                    }
                  ].map((testimonial, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className="bg-gradient-to-r from-amber-50/80 to-amber-100/50 rounded-2xl p-6 border border-amber-200/50"
                    >
                      <div className="flex items-center mb-4">
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                          ))}
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700">{testimonial.rating}.0</span>
                      </div>
                      <p className="text-gray-700 italic mb-4">"{testimonial.content}"</p>
                      <div>
                        <div className="font-bold text-gray-800">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                    </motion.div>
                  ))}
                  
                  <div className="pt-6 border-t border-amber-200/50">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">Average Rating</div>
                      <div className="flex items-center">
                        <div className="text-2xl font-bold text-gray-800 mr-2">4.9</div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-gradient-to-b from-white to-amber-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 rounded-full mb-6 border border-amber-300/50">
              <Award className="mr-3" size={22} />
              <span className="font-semibold">Why Schools Love Us</span>
            </div>
            <h2 className="text-5xl font-bold text-gray-800 mb-8">
              Simplicity Meets <span className="text-amber-700">Power</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We combine elegant design with powerful functionality to make school finance 
              management effortless and enjoyable.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueProp
              icon={Wallet}
              title="Complete Financial Control"
              description="Manage all student fees, track payments, and generate reports from a single dashboard."
              gradient="bg-gradient-to-r from-amber-500 to-amber-700"
            />
            <ValueProp
              icon={ShieldCheck}
              title="Enterprise Security"
              description="Bank-level encryption, regular backups, and compliance with educational regulations."
              gradient="bg-gradient-to-r from-emerald-500 to-emerald-700"
            />
            <ValueProp
              icon={TrendingUp}
              title="Real-time Analytics"
              description="Beautiful dashboards with insights on collections, pending amounts, and trends."
              gradient="bg-gradient-to-r from-blue-500 to-blue-700"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-white to-amber-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full mb-6 shadow-lg">
              <Zap className="mr-3" size={22} />
              <span className="font-semibold">Powerful Features</span>
            </div>
            <h2 className="text-5xl font-bold text-gray-800 mb-8">
              Everything Your School <span className="text-amber-700">Needs</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A comprehensive suite of tools designed specifically for educational institutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={GraduationCap}
              title="Student Management"
              description="Complete student profiles with academic records, fee structures, and communication history."
              delay={0.1}
            />
            <FeatureCard
              icon={Calculator}
              title="Custom Fee Structures"
              description="Define flexible fee structures with tuition, books, activities, and additional charges."
              delay={0.2}
            />
            <FeatureCard
              icon={Calendar}
              title="Smart Installments"
              description="Automated installment tracking with reminders and flexible payment schedules."
              delay={0.3}
            />
            <FeatureCard
              icon={Receipt}
              title="Professional Invoices"
              description="Generate beautiful, customizable receipts and invoices automatically."
              delay={0.4}
            />
            <FeatureCard
              icon={PieChart}
              title="Advanced Analytics"
              description="Deep insights into financial performance with beautiful visualizations."
              delay={0.5}
            />
            <FeatureCard
              icon={Smartphone}
              title="Mobile Optimized"
              description="Access from any device with our responsive, mobile-first design."
              delay={0.6}
            />
            <FeatureCard
              icon={Lock}
              title="Military-grade Security"
              description="End-to-end encryption, 2FA, and regular security audits."
              delay={0.7}
            />
            <FeatureCard
              icon={Cloud}
              title="Cloud Powered"
              description="Always available with automatic updates and 99.9% uptime."
              delay={0.8}
            />
            <FeatureCard
              icon={MessageSquare}
              title="Parent Portal"
              description="Direct communication with parents through automated reminders and updates."
              delay={0.9}
            />
          </div>
        </div>
      </section>

      {/* Security & Compliance Section */}
      <section className="py-24 bg-gradient-to-br from-amber-900/5 via-amber-800/5 to-amber-700/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 rounded-full mb-6 border border-amber-300/50">
              <Shield className="mr-3" size={22} />
              <span className="font-semibold">Security & Compliance</span>
            </div>
            <h2 className="text-5xl font-bold text-gray-800 mb-8">
              Your Data is <span className="text-amber-700">Safe With Us</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We take security and compliance seriously with enterprise-grade protection
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Database,
                title: "Daily Backups",
                description: "Automatic daily backups with 30-day retention",
                color: "from-blue-500 to-blue-700"
              },
              {
                icon: Lock,
                title: "End-to-End Encryption",
                description: "All data encrypted both at rest and in transit",
                color: "from-emerald-500 to-emerald-700"
              },
              {
                icon: FileCheck,
                title: "GDPR Compliant",
                description: "Full compliance with data protection regulations",
                color: "from-amber-600 to-amber-800"
              },
              {
                icon: EyeOff,
                title: "Zero-Knowledge Architecture",
                description: "We never store sensitive payment information",
                color: "from-purple-500 to-purple-700"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative bg-white rounded-2xl shadow-lg p-8 border border-amber-100 hover:shadow-2xl transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-amber-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-3xl p-8 border border-amber-200/50"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-700 mb-2">SOC 2</div>
                <div className="text-gray-700">Type II Certified</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-700 mb-2">ISO 27001</div>
                <div className="text-gray-700">Information Security</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-700 mb-2">PCI DSS</div>
                <div className="text-gray-700">Level 1 Compliant</div>
              </div>
            </div>
          </motion.div> */}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-b from-white to-amber-50/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 rounded-full mb-6 border border-amber-300/50"
            >
              <Clock className="mr-3" size={22} />
              <span className="font-semibold">Quick Start</span>
            </motion.div>
            <h2 className="text-5xl font-bold text-gray-800 mb-8">
              Get Started in <span className="text-amber-700">Minutes</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple setup, powerful results. Start managing your school finances today.
            </p>
          </div>

          <div className="relative">
            {/* Connection lines */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500/20 via-amber-600/20 to-amber-500/20 -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  number: 1,
                  icon: UserPlus,
                  title: "Sign Up & Setup",
                  description: "Create your account, add school details, and configure settings in minutes.",
                  color: "from-emerald-500 to-emerald-700"
                },
                {
                  number: 2,
                  icon: BookOpen,
                  title: "Add Your Data",
                  description: "Import students, set up fee structures, and customize to your needs.",
                  color: "from-blue-500 to-blue-700"
                },
                {
                  number: 3,
                  icon: BarChart3,
                  title: "Manage & Grow",
                  description: "Track payments, generate reports, and optimize your financial workflow.",
                  color: "from-amber-600 to-amber-800"
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="relative text-center"
                >
                  <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-2xl blur-xl"></div>
                    <div className={`relative w-24 h-24 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-xl`}>
                      {step.number}
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                      <step.icon className="text-white" size={20} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
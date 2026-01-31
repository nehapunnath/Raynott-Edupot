// src/pages/FeaturesPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator,
  Calendar,
  Receipt,
  Wallet,
  PieChart,
  CreditCard,
  GraduationCap,
  BookOpen,
  FileText,
  Lock,
  BarChart3,
  MessageSquare,
  Headphones,
  Smartphone,
  Cloud,
  Users,
  Target,
  CheckCircle,
  Shield,
  Zap,
  Globe,
  Database,
  Bell,
  Award,
  TrendingUp
} from 'lucide-react';

const Features = () => {
  const mainFeatures = [
    {
      icon: GraduationCap,
      title: "Student Management",
      description: "Complete student profiles with personal details, academic information, and fee structures all in one place.",
      features: ["Complete student profiles", "Academic records", "Fee structure assignment", "Attendance tracking"],
      color: "from-amber-500 to-amber-600"
    },
    {
      icon: Calculator,
      title: "Fee Structure Setup",
      description: "Define custom fee structures with tuition, books, uniform, and additional charges for different grades and sections.",
      features: ["Custom fee structures", "Installment planning", "Late fee calculation", "Discount management"],
      color: "from-amber-600 to-amber-700"
    },
    {
      icon: Calendar,
      title: "Installment Tracking",
      description: "Track multiple installments with exact amounts, due dates, and payment status for each student.",
      features: ["Multiple installments", "Due date tracking", "Payment reminders", "Late payment alerts"],
      color: "from-amber-700 to-amber-800"
    },
    {
      icon: Receipt,
      title: "Automated Receipts",
      description: "Generate professional receipts automatically for every payment transaction with customizable templates.",
      features: ["Professional receipts", "Custom templates", "Auto-generation", "Digital delivery"],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: PieChart,
      title: "Financial Reports",
      description: "Comprehensive reports showing collections, pending amounts, and financial analytics with beautiful visualizations.",
      features: ["Collection reports", "Pending amounts", "Revenue analytics", "Export to PDF/Excel"],
      color: "from-green-500 to-green-600"
    },
    {
      icon: Smartphone,
      title: "Mobile Access",
      description: "Access the system from any device with our responsive mobile-friendly design. No app installation required.",
      features: ["Mobile responsive", "Any device access", "Real-time sync", "Offline support"],
      color: "from-purple-500 to-purple-600"
    }
  ];

  const advancedFeatures = [
    {
      icon: Lock,
      title: "Data Security",
      description: "Enterprise-grade security with end-to-end encryption, regular backups, and role-based access controls.",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: Cloud,
      title: "Cloud-Based",
      description: "Access your data from anywhere with automatic updates, backups, and 99.9% uptime guarantee.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: MessageSquare,
      title: "Parent Communication",
      description: "Send automated reminders, payment notifications, and updates directly to parents via SMS and email.",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Live dashboards with insights on collections, pending amounts, and financial performance trends.",
      color: "from-amber-500 to-amber-600"
    },
    {
      icon: Database,
      title: "Data Backup",
      description: "Automatic daily backups with 30-day retention ensuring your data is always safe and recoverable.",
      color: "from-gray-500 to-gray-600"
    },
    {
      icon: Globe,
      title: "Multi-branch Support",
      description: "Manage multiple school branches from a single dashboard with consolidated reporting.",
      color: "from-teal-500 to-teal-600"
    }
  ];

  const benefits = [
    {
      title: "Save Time",
      description: "Reduce administrative work by up to 90% with automated processes",
      icon: Zap,
      color: "text-green-500"
    },
    {
      title: "Increase Accuracy",
      description: "Eliminate manual errors with automated calculations and tracking",
      icon: Target,
      color: "text-blue-500"
    },
    {
      title: "Improve Cash Flow",
      description: "Get paid faster with automated reminders and online payment options",
      icon: TrendingUp,
      color: "text-amber-500"
    },
    {
      title: "Better Insights",
      description: "Make data-driven decisions with comprehensive financial reports",
      icon: Award,
      color: "text-purple-500"
    }
  ];

  const testimonials = [
    {
      name: "Greenwood International School",
      role: "School Administration",
      content: "Raynott Edupot has transformed how we manage finances. What used to take days now takes minutes.",
      rating: 5
    },
    {
      name: "Oakridge Public School",
      role: "Accountant",
      content: "The reporting features alone have saved us hundreds of hours each semester. Incredible tool.",
      rating: 5
    },
    {
      name: "Sunrise Academy",
      role: "Principal",
      content: "Parent communication has never been easier. Automated reminders have improved our collection rate by 40%.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-amber-50/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-800 via-amber-700 to-amber-600 pt-32 pb-24">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full mb-8 border border-white/20">
              <Zap className="mr-3" size={22} />
              <span className="font-semibold">Powerful Features</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Everything Your School <span className="text-amber-200">Needs</span>
            </h1>
            
            <p className="text-xl text-amber-100/90 max-w-3xl mx-auto leading-relaxed">
              A comprehensive suite of tools designed specifically for educational institutions 
              to manage finances efficiently and effectively.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 rounded-full mb-6 border border-amber-300/50">
              <Award className="mr-3" size={22} />
              <span className="font-semibold">Core Features</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              Complete Financial <span className="text-amber-700">Management</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              All the tools you need to manage school finances from admission to graduation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-lg p-8 border border-amber-100 hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 via-amber-100/0 to-amber-200/0 group-hover:from-amber-50/20 group-hover:via-amber-100/10 group-hover:to-amber-200/5 transition-all duration-500"></div>
                
                <div className="relative">
                  <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 rounded-xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                    <div className={`relative w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      <feature.icon className="text-white" size={32} />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-amber-700 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <CheckCircle className="text-green-500 mr-3 flex-shrink-0" size={18} />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-amber-50/30 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full mb-6 shadow-lg">
              <TrendingUp className="mr-3" size={22} />
              <span className="font-semibold">Key Benefits</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              Why Schools <span className="text-amber-700">Love Us</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl shadow-lg p-8 border border-amber-100 hover:shadow-2xl transition-all duration-300 text-center"
              >
                <div className={`w-14 h-14 ${benefit.color} bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <benefit.icon className={benefit.color} size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 rounded-full mb-6 border border-amber-300/50">
              <Shield className="mr-3" size={22} />
              <span className="font-semibold">Advanced Features</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              Enterprise-Grade <span className="text-amber-700">Capabilities</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional features for schools that demand the best
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advancedFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-lg p-8 border border-amber-100 hover:shadow-2xl transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-amber-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-amber-50/30 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full mb-6 shadow-lg">
              <Users className="mr-3" size={22} />
              <span className="font-semibold">School Testimonials</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              Trusted by <span className="text-amber-700">500+ Schools</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-lg p-8 border border-amber-100 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-500 fill-amber-500" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6">"{testimonial.content}"</p>
                <div>
                  <div className="font-bold text-gray-800">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 rounded-full mb-6 border border-amber-300/50">
              <CheckCircle className="mr-3" size={22} />
              <span className="font-semibold">Traditional vs Raynott Edupot</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              Why Choose <span className="text-amber-700">Modern Solutions</span>
            </h2>
          </motion.div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl shadow-lg overflow-hidden border border-amber-200">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="bg-gradient-to-br from-amber-600 to-amber-700 text-white p-8">
                <h3 className="text-2xl font-bold mb-6">Traditional Methods</h3>
                <ul className="space-y-4">
                  {[
                    "Manual spreadsheets",
                    "Paper receipts & records",
                    "No real-time tracking",
                    "Error-prone calculations",
                    "Limited reporting",
                    "Time-consuming processes"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-amber-200 rounded-full mr-3"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-amber-700 to-amber-800 text-white p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 text-center py-2 bg-amber-600">
                  <span className="font-bold">Raynott Edupot</span>
                </div>
                <div className="pt-8">
                  <ul className="space-y-4">
                    {[
                      "Automated systems",
                      "Digital records",
                      "Real-time tracking",
                      "Accurate calculations",
                      "Comprehensive reports",
                      "Time-saving automation"
                    ].map((item, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-amber-200 mr-3" />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-white to-amber-50 p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Benefits</h3>
                <ul className="space-y-4">
                  {[
                    "90% time savings",
                    "100% accuracy",
                    "Better cash flow",
                    "Improved parent relations",
                    "Data-driven decisions",
                    "Scalable growth"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <TrendingUp className="w-5 h-5 text-green-500 mr-3" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
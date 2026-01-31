// src/pages/AboutPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Users, 
  Award, 
  CheckCircle,
  Shield,
  Heart,
  BookOpen,
  GraduationCap,
  BarChart3,
  Clock,
  Globe,
  Sparkles,
  Calculator,
  Receipt,
  PieChart,
  Smartphone,
  Lock,
  Cloud,
  MessageSquare
} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To simplify school financial management through innovative technology, making it accessible and efficient for educational institutions of all sizes.",
      color: "from-amber-500 to-amber-600"
    },
    {
      icon: Users,
      title: "Our Vision",
      description: "To become the leading financial management platform for educational institutions globally, empowering schools to focus on education rather than administration.",
      color: "from-amber-600 to-amber-700"
    },
    {
      icon: Award,
      title: "Our Values",
      description: "Integrity, innovation, and impact drive everything we do. We believe in creating solutions that make a real difference in education.",
      color: "from-amber-700 to-amber-800"
    }
  ];

  const features = [
    {
      icon: Calculator,
      title: "Complete Fee Management",
      description: "Track all student fees, installments, and payments in one place",
      color: "from-amber-500 to-amber-600"
    },
    {
      icon: Receipt,
      title: "Automated Invoicing",
      description: "Generate professional receipts and invoices automatically",
      color: "from-amber-600 to-amber-700"
    },
    {
      icon: PieChart,
      title: "Financial Analytics",
      description: "Get real-time insights into collections and pending amounts",
      color: "from-amber-700 to-amber-800"
    },
    {
      icon: Smartphone,
      title: "Mobile Access",
      description: "Access your financial data anytime, anywhere from any device",
      color: "from-amber-800 to-amber-900"
    }
  ];

  const benefits = [
    {
      icon: Lock,
      title: "Security & Privacy",
      description: "Bank-level encryption and compliance with educational regulations",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: Cloud,
      title: "Cloud-Based",
      description: "No installation required, automatic updates and backups",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: MessageSquare,
      title: "Parent Communication",
      description: "Automated reminders and notifications to parents",
      color: "from-purple-500 to-purple-600"
    }
  ];

  const stats = [
    { number: "500+", label: "Schools", icon: GraduationCap },
    { number: "99.9%", label: "Uptime", icon: Clock },
    { number: "50k+", label: "Students", icon: Users },
    { number: "₹10Cr+", label: "Managed", icon: BarChart3 }
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
              <BookOpen className="mr-3" size={22} />
              <span className="font-semibold">Our Story</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              About <span className="text-amber-200">Raynott Edupot</span>
            </h1>
            
            <p className="text-xl text-amber-100/90 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to transform how schools manage their finances. Founded by 
              educators for educators, we understand the unique challenges schools face and 
              have built solutions that truly make a difference.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-100 to-amber-200 rounded-2xl mb-4">
                    <stat.icon className="text-amber-600" size={28} />
                  </div>
                  <div className="text-4xl font-bold text-gray-800 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 bg-gradient-to-b from-white to-amber-50/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 rounded-full mb-6 border border-amber-300/50">
              <Sparkles className="mr-3" size={22} />
              <span className="font-semibold">What We Offer</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              Comprehensive <span className="text-amber-700">Solutions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything your school needs for efficient financial management
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-lg p-8 border border-amber-100 hover:shadow-2xl transition-all duration-300 text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform mx-auto`}>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.4 }}
                whileHover={{ scale: 1.05 }}
                className="group relative bg-white rounded-2xl shadow-lg p-8 border border-amber-100 hover:shadow-2xl transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r ${benefit.color} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <benefit.icon className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-amber-700 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full mb-6 shadow-lg">
              <Heart className="mr-3" size={22} />
              <span className="font-semibold">What Drives Us</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              Our Core <span className="text-amber-700">Values</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-lg p-8 border border-amber-100 hover:shadow-2xl transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <value.icon className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-amber-700 transition-colors">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-amber-900/5 via-amber-800/5 to-amber-700/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full mb-6 shadow-lg">
              <Shield className="mr-3" size={22} />
              <span className="font-semibold">Why Choose Us</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              Built for <span className="text-amber-700">Schools</span>, by <span className="text-amber-700">Educators</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {[
                "Deep understanding of school operations",
                "Designed specifically for educational institutions",
                "Scalable for schools of all sizes",
                "Continuous improvement based on feedback"
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="text-white" size={18} />
                  </div>
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-white to-amber-50 rounded-2xl p-8 border border-amber-200 shadow-lg"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-amber-600 to-amber-800 rounded-2xl flex items-center justify-center">
                  <Globe className="text-white" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Our Commitment</h3>
                  <p className="text-gray-600">To schools everywhere</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                We're committed to providing schools with tools that save time, reduce errors, 
                and provide valuable insights. Our platform evolves with your needs, ensuring 
                you always have the best tools for financial management.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
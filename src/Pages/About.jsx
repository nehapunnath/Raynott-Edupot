// src/pages/AboutPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Users, 
  Award, 
  TrendingUp, 
  CheckCircle,
  Shield,
  Heart,
  BookOpen,
  GraduationCap,
  BarChart3,
  Clock,
  Globe,
  Sparkles
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

  const milestones = [
    {
      year: "2020",
      title: "Founded",
      description: "Started with a vision to transform school financial management"
    },
    {
      year: "2021",
      title: "First Launch",
      description: "Launched our first version with 50+ schools"
    },
    {
      year: "2022",
      title: "Growth",
      description: "Expanded to 500+ schools nationwide"
    },
    {
      year: "2023",
      title: "Innovation",
      description: "Introduced AI-powered analytics and mobile app"
    },
    {
      year: "2024",
      title: "Expansion",
      description: "Going international with multi-language support"
    }
  ];

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      description: "Former school administrator with 15+ years of experience",
      color: "from-amber-500 to-amber-600"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      description: "Tech entrepreneur with expertise in educational technology",
      color: "from-amber-600 to-amber-700"
    },
    {
      name: "Priya Sharma",
      role: "Product Lead",
      description: "Former teacher turned product designer",
      color: "from-amber-700 to-amber-800"
    },
    {
      name: "David Miller",
      role: "Customer Success",
      description: "Dedicated to ensuring every school succeeds",
      color: "from-amber-800 to-amber-900"
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
      {/* <section className="py-16 bg-white">
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
      </section> */}

      {/* Our Story */}
      {/* <section className="py-20 bg-gradient-to-b from-white to-amber-50/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 rounded-full mb-6 border border-amber-300/50">
              <Sparkles className="mr-3" size={22} />
              <span className="font-semibold">Our Journey</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              From Vision to <span className="text-amber-700">Reality</span>
            </h2>
          </motion.div>

          <div className="relative">
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-amber-200 via-amber-300 to-amber-400"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className="absolute left-1/2 transform -translate-x-1/2 md:relative md:left-0 md:transform-none z-10">
                    <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-xl">
                      <span className="text-white font-bold text-xl">{milestone.year}</span>
                    </div>
                  </div>

                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                    <div className="mt-10 md:mt-0">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
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

      {/* CTA */}
      {/* <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl p-12 border border-amber-200"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Ready to Transform Your School's Finances?
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Join hundreds of schools already using Raynott Edupot to streamline their financial operations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-xl hover:shadow-2xl transition-all shadow-lg hover:from-amber-700 hover:to-amber-800"
              >
                Get in Touch
              </motion.a>
              
              <motion.a
                href="/features"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-white text-amber-700 font-bold rounded-xl hover:shadow-2xl transition-all shadow-lg border border-amber-200 hover:bg-amber-50"
              >
                Explore Features
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section> */}
    </div>
  );
};

export default About;
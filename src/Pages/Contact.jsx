// src/pages/ContactPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Clock,
  Headphones,
  Globe,
  Shield,
  Users,
  Award,
  ArrowRight
} from 'lucide-react';

const Contact = () => {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get detailed responses to your queries",
      value: "support@raynottedupot.com",
      color: "from-amber-500 to-amber-600",
      action: "mailto:support@raynottedupot.com"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our support team",
      value: "+91 98765 43210",
      color: "from-amber-600 to-amber-700",
      action: "tel:+919876543210"
    },
    {
      icon: MessageSquare,
      title: "Sales Inquiry",
      description: "For pricing and implementation questions",
      value: "sales@raynottedupot.com",
      color: "from-amber-700 to-amber-800",
      action: "mailto:sales@raynottedupot.com"
    },
    {
      icon: MapPin,
      title: "Office Address",
      description: "Visit our headquarters",
      value: "123 Education Street, Knowledge City",
      color: "from-amber-800 to-amber-900",
      action: "https://maps.google.com"
    }
  ];

  const supportHours = [
    {
      day: "Monday - Friday",
      hours: "9:00 AM - 6:00 PM"
    },
    {
      day: "Saturday",
      hours: "10:00 AM - 2:00 PM"
    },
    {
      day: "Sunday",
      hours: "Closed"
    }
  ];

  const teamContacts = [
    {
      name: "Sales Team",
      role: "Pricing & Implementation",
      email: "sales@raynottedupot.com",
      phone: "+91 98765 43211"
    },
    {
      name: "Technical Support",
      role: "Platform Assistance",
      email: "support@raynottedupot.com",
      phone: "+91 98765 43212"
    },
    {
      name: "Customer Success",
      role: "Account Management",
      email: "success@raynottedupot.com",
      phone: "+91 98765 43213"
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
              <Headphones className="mr-3" size={22} />
              <span className="font-semibold">Get in Touch</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Contact <span className="text-amber-200">Us</span>
            </h1>
            
            <p className="text-xl text-amber-100/90 max-w-3xl mx-auto leading-relaxed">
              Reach out to our team for support, sales inquiries, or to learn more about 
              how Raynott Edupot can transform your school's financial management.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 rounded-full mb-6 border border-amber-300/50">
              <MessageSquare className="mr-3" size={22} />
              <span className="font-semibold">Contact Options</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              Multiple Ways to <span className="text-amber-700">Connect</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the contact method that works best for you
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.action}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-lg p-8 border border-amber-100 hover:shadow-2xl transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <method.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-amber-700 transition-colors">
                  {method.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{method.description}</p>
                <p className="text-gray-800 font-medium">{method.value}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Team Contacts & Support Hours */}
      <section className="py-20 bg-gradient-to-b from-amber-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Team Contacts */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-amber-200"
            >
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl flex items-center justify-center">
                  <Users className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Team Contacts</h2>
                  <p className="text-gray-600">Reach the right team for your needs</p>
                </div>
              </div>

              <div className="space-y-6">
                {teamContacts.map((team, index) => (
                  <div key={index} className="bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl p-6 border border-amber-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{team.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{team.role}</p>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-700">
                        <Mail className="w-4 h-4 text-amber-600 mr-3" />
                        <a href={`mailto:${team.email}`} className="hover:text-amber-700">
                          {team.email}
                        </a>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Phone className="w-4 h-4 text-amber-600 mr-3" />
                        <a href={`tel:${team.phone.replace(/\s+/g, '')}`} className="hover:text-amber-700">
                          {team.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Support Hours */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-8 border border-amber-200">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl flex items-center justify-center">
                    <Clock className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Support Hours</h2>
                    <p className="text-gray-600">When we're available to help you</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {supportHours.map((time, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-white rounded-lg border border-amber-200">
                      <span className="font-medium text-gray-800">{time.day}</span>
                      <span className="text-amber-700 font-bold">{time.hours}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-amber-300/50">
                  <div className="flex items-center justify-center space-x-8 text-center">
                    <div>
                      <div className="text-2xl font-bold text-amber-700 mb-2">4</div>
                      <div className="text-sm text-gray-600">Hours Max Response</div>
                    </div>
                    <div className="h-8 w-px bg-amber-300/50"></div>
                    <div>
                      <div className="text-2xl font-bold text-amber-700 mb-2">24/7</div>
                      <div className="text-sm text-gray-600">Emergency Support</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guarantee */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border border-emerald-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                    <Award className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Our Guarantee</h3>
                    <p className="text-gray-700">
                      We respond to all inquiries within 4 hours during business hours. 
                      Your satisfaction is our priority.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map & Location */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full mb-6 shadow-lg">
              <Globe className="mr-3" size={22} />
              <span className="font-semibold">Our Location</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              Visit Our <span className="text-amber-700">Office</span>
            </h2>
          </motion.div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl overflow-hidden border border-amber-200 shadow-xl">
            {/* Map Placeholder */}
            <div className="h-80 bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full blur-xl opacity-50"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-r from-amber-700 to-amber-800 rounded-full flex items-center justify-center shadow-2xl">
                      <MapPin className="text-white" size={32} />
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-amber-900 font-bold text-xl">123 Education Street</p>
                    <p className="text-amber-800">Knowledge City</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Getting Here</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                      <span>10 minutes from Central Station</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                      <span>Ample parking available</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                      <span>Metro: Blue Line - Education Station</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Office Features</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                      <span>Conference room for demos</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                      <span>Free Wi-Fi for visitors</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                      <span>Accessible facilities</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <a 
                      href="https://maps.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-3 bg-white text-amber-700 font-medium rounded-lg hover:bg-amber-50 transition border border-amber-200 group"
                    >
                      <span>Get Directions</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a 
                      href="tel:+919876543210"
                      className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium rounded-lg hover:from-amber-700 hover:to-amber-800 transition group"
                    >
                      <span>Call for Appointment</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     
    </div>
  );
};

export default Contact;
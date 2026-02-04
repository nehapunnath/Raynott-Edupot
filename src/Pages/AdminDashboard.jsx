// src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  LogOut, Building2, Users, UserPlus, Shield, 
  Key, Phone, Search, Download, Edit, Trash2, 
  Eye, Lock, Unlock, CheckCircle, AlertCircle,
  BarChart3, X, Copy, ChevronDown, ChevronUp
} from 'lucide-react';
import { toast } from 'react-toastify';

const AdminDashboard = ({ user, onLogout }) => {
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [activeTab, setActiveTab] = useState('schools');
  const [expandedSchools, setExpandedSchools] = useState([]);

  // Sample initial data
  const sampleSchools = [
    {
      id: 1,
      schoolId: 'SCH001',
      name: 'Raynott International School',
      email: 'admin@raynott.edu.in',
      password: 'Raynott@123',
      phone: '9876543210',
      status: 'active',
      createdAt: '2024-01-15',
      lastLogin: '2024-10-20'
    },
    {
      id: 2,
      schoolId: 'SCH002',
      name: 'St. Mary\'s Convent School',
      email: 'admin@stmarys.edu.in',
      password: 'Stmarys@456',
      phone: '9876543211',
      status: 'active',
      createdAt: '2024-02-10',
      lastLogin: '2024-10-19'
    },
    {
      id: 3,
      schoolId: 'SCH003',
      name: 'Delhi Public School',
      email: 'admin@dps.edu.in',
      password: 'Dps@789',
      phone: '9876543212',
      status: 'active',
      createdAt: '2024-03-05',
      lastLogin: '2024-10-18'
    },
    {
      id: 4,
      schoolId: 'SCH004',
      name: 'Kendriya Vidyalaya',
      email: 'admin@kv.edu.in',
      password: 'Kv@012',
      phone: '9876543213',
      status: 'inactive',
      createdAt: '2024-04-20',
      lastLogin: '2024-09-30'
    }
  ];

  useEffect(() => {
    setSchools(sampleSchools);
    setFilteredSchools(sampleSchools);
  }, []);

  // Search schools
  useEffect(() => {
    const filtered = schools.filter(school => 
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.phone.includes(searchTerm)
    );
    setFilteredSchools(filtered);
  }, [searchTerm, schools]);

  const handleAddSchool = (newSchool) => {
    const schoolWithDefaults = {
      ...newSchool,
      id: schools.length + 1,
      schoolId: `SCH${String(schools.length + 1).padStart(3, '0')}`,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: null
    };
    
    const updatedSchools = [...schools, schoolWithDefaults];
    setSchools(updatedSchools);
    setFilteredSchools(updatedSchools);
    setShowAddSchool(false);
  };

  const handleDeleteSchool = (schoolId) => {
    if (window.confirm('Are you sure you want to delete this school account?')) {
      const updatedSchools = schools.filter(s => s.id !== schoolId);
      setSchools(updatedSchools);
      setFilteredSchools(updatedSchools);
    }
  };

  const handleToggleStatus = (schoolId) => {
    const updatedSchools = schools.map(school => 
      school.id === schoolId 
        ? { 
            ...school, 
            status: school.status === 'active' ? 'inactive' : 'active',
            lastLogin: school.status === 'active' ? null : new Date().toISOString().split('T')[0]
          }
        : school
    );
    setSchools(updatedSchools);
    setFilteredSchools(updatedSchools);
  };

  const handleResetPassword = (schoolId) => {
    const newPassword = generatePassword();
    const updatedSchools = schools.map(school => 
      school.id === schoolId 
        ? { ...school, password: newPassword }
        : school
    );
    setSchools(updatedSchools);
    setFilteredSchools(updatedSchools);
    
    // Show the new password
    setSelectedSchool(updatedSchools.find(s => s.id === schoolId));
    setShowCredentials(true);
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    // Start with capital letter
    password += chars.charAt(Math.floor(Math.random() * 26));
    // Add 7 more random characters
    for (let i = 0; i < 7; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const toggleSchoolExpand = (schoolId) => {
    setExpandedSchools(prev => 
      prev.includes(schoolId) 
        ? prev.filter(id => id !== schoolId)
        : [...prev, schoolId]
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.warning('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-600 shadow-lg">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Raynott Edupot</h1>
            <p className="text-amber-100">Admin Dashboard</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="font-semibold text-lg text-white">Welcome, Admin</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="text-white" size={20} />
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 backdrop-blur-sm text-white"
              >
                <LogOut size={18} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="px-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-4 font-medium text-sm transition-all relative ${activeTab === 'dashboard' 
                ? 'text-amber-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center space-x-2">
                <BarChart3 size={18} />
                <span>Dashboard</span>
              </div>
              {activeTab === 'dashboard' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('schools')}
              className={`px-4 py-4 font-medium text-sm transition-all relative ${activeTab === 'schools' 
                ? 'text-amber-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center space-x-2">
                <Building2 size={18} />
                <span>Schools ({schools.length})</span>
              </div>
              {activeTab === 'schools' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"></div>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Schools</p>
                    <p className="text-3xl font-bold text-gray-800">{schools.length}</p>
                  </div>
                  <div className="p-3 bg-amber-200 rounded-lg">
                    <Building2 className="text-amber-600" size={24} />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  <span className="text-green-600 font-medium">
                    {schools.filter(s => s.status === 'active').length} active
                  </span>
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Schools</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {schools.filter(s => s.status === 'active').length}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-200 rounded-lg">
                    <Users className="text-blue-600" size={24} />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Currently active</p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Inactive Schools</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {schools.filter(s => s.status === 'inactive').length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-200 rounded-lg">
                    <Lock className="text-green-600" size={24} />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Deactivated accounts</p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Recent Activity</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {schools.filter(s => s.lastLogin).length}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-200 rounded-lg">
                    <CheckCircle className="text-purple-600" size={24} />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Logged in today</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setShowAddSchool(true)}
                  className="px-6 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl hover:from-amber-700 hover:to-amber-800 flex items-center justify-center space-x-3 transition-all"
                >
                  <UserPlus size={20} />
                  <span className="font-medium">Add New School</span>
                </button>
                <button
                //   onClick={() => {
                //     const csvContent = schools.map(s => `${s.name},${s.email},${s.password},${s.phone},${s.status}`).join('\n');
                //     const blob = new Blob([csvContent], { type: 'text/csv' });
                //     const url = URL.createObjectURL(blob);
                //     const link = document.createElement('a');
                //     link.href = url;
                //     link.download = 'schools_data.csv';
                //     link.click();
                //   }}
                  className="px-6 py-4 border border-amber-300 text-amber-700 rounded-xl hover:bg-amber-50 flex items-center justify-center space-x-3"
                >
                  <Download size={20} />
                  <span className="font-medium">Export Data</span>
                </button>
                <button
                  onClick={() => setActiveTab('schools')}
                  className="px-6 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 flex items-center justify-center space-x-3"
                >
                  <Building2 size={20} />
                  <span className="font-medium">View All Schools</span>
                </button>
              </div>
            </div>

            {/* Recent Schools */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Recent Schools</h3>
              <div className="space-y-4">
                {schools.slice(0, 3).map(school => (
                  <div key={school.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Building2 className="text-amber-600" size={24} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{school.name}</p>
                        <p className="text-sm text-gray-600">{school.email}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      school.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {school.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Schools Management Tab */}
        {activeTab === 'schools' && (
          <div className="space-y-6">
            {/* Header with Actions */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">School Management</h2>
                <p className="text-gray-600">Manage school accounts and credentials</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddSchool(true)}
                  className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-medium hover:from-amber-700 hover:to-amber-800 flex items-center space-x-3"
                >
                  <UserPlus size={18} />
                  <span>Add School</span>
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by school name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Schools List */}
            <div className="space-y-4">
              {filteredSchools.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Building2 className="text-gray-400" size={32} />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">No schools found</h4>
                  <p className="text-gray-600">
                    {searchTerm ? "Try adjusting your search term" : "No schools have been added yet"}
                  </p>
                </div>
              ) : (
                filteredSchools.map((school) => (
                  <div key={school.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Building2 className="text-amber-600" size={28} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">{school.name}</h3>
                            <p className="text-gray-600 text-sm">
                              ID: {school.schoolId} • Created: {school.createdAt}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleSchoolExpand(school.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                          >
                            {expandedSchools.includes(school.id) ? (
                              <ChevronUp size={20} />
                            ) : (
                              <ChevronDown size={20} />
                            )}
                          </button>
                          <button
                            onClick={() => handleResetPassword(school.id)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 text-sm flex items-center space-x-2"
                          >
                            <Key size={16} />
                            <span>Reset Password</span>
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Email</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="font-medium">{school.email}</p>
                            <button
                              onClick={() => copyToClipboard(school.email)}
                              className="text-gray-400 hover:text-gray-600"
                              title="Copy email"
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Password</p>
                          <div className="flex items-center justify-between mt-1">
                            <code className="font-mono text-gray-800">{school.password}</code>
                            <button
                              onClick={() => copyToClipboard(school.password)}
                              className="text-gray-400 hover:text-gray-600"
                              title="Copy password"
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Phone</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="font-medium">{school.phone}</p>
                            <button
                              onClick={() => copyToClipboard(school.phone)}
                              className="text-gray-400 hover:text-gray-600"
                              title="Copy phone"
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Status</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              school.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {school.status}
                            </span>
                            <button
                              onClick={() => handleToggleStatus(school.id)}
                              className={`p-1 rounded ${
                                school.status === 'active' 
                                  ? 'text-red-600 hover:text-red-800 hover:bg-red-50' 
                                  : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                              }`}
                              title={school.status === 'active' ? 'Deactivate' : 'Activate'}
                            >
                              {school.status === 'active' ? <Lock size={16} /> : <Unlock size={16} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedSchools.includes(school.id) && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-gray-600">Last Login</p>
                              <p className="font-medium">{school.lastLogin || 'Never'}</p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedSchool(school);
                                  setShowCredentials(true);
                                }}
                                className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 flex items-center space-x-2"
                              >
                                <Eye size={16} />
                                <span>View Credentials</span>
                              </button>
                              <button
                                onClick={() => handleDeleteSchool(school.id)}
                                className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 flex items-center space-x-2"
                              >
                                <Trash2 size={16} />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add School Modal */}
      {showAddSchool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Add New School</h3>
                  <p className="text-gray-600">Create school account with login credentials</p>
                </div>
                <button
                  onClick={() => setShowAddSchool(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const newSchool = {
                  name: formData.get('name'),
                  email: formData.get('email'),
                  password: formData.get('password'),
                  phone: formData.get('phone')
                };
                handleAddSchool(newSchool);
              }}>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
                    <h4 className="font-semibold text-gray-800 mb-4">School Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          School Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Enter school name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="9876543210"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <h4 className="font-semibold text-gray-800 mb-4">Login Credentials</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="admin@school.edu.in"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Password *
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const passwordField = document.querySelector('input[name="password"]');
                              passwordField.value = generatePassword();
                            }}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Generate Password
                          </button>
                        </div>
                        <input
                          type="text"
                          name="password"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Create a strong password"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowAddSchool(false)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-medium hover:from-amber-700 hover:to-amber-800 flex items-center space-x-2"
                    >
                      <CheckCircle size={20} />
                      <span>Create School Account</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Credentials Modal */}
      {showCredentials && selectedSchool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Login Credentials</h3>
                  <p className="text-gray-600">Provide these credentials to {selectedSchool.name}</p>
                </div>
                <button
                  onClick={() => {
                    setShowCredentials(false);
                    setSelectedSchool(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Key className="text-amber-600" size={32} />
                    </div>
                    <p className="font-bold text-lg">{selectedSchool.name}</p>
                  </div>

                  <div className="space-y-4">
                  

                    <div>
                      <label className="text-sm text-gray-500 mb-2 block">Email Address</label>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <code className="text-gray-800 font-mono">{selectedSchool.email}</code>
                        <button
                          onClick={() => copyToClipboard(selectedSchool.email)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-500 mb-2 block">Password</label>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <code className="text-green-600 font-mono">{selectedSchool.password}</code>
                        <button
                          onClick={() => copyToClipboard(selectedSchool.password)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-2 flex items-center">
                    <AlertCircle size={16} className="mr-2" />
                    Important Instructions
                  </h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Share these credentials securely</li>
                    {/* <li>• Recommend changing password on first login</li> */}
                    <li>• Keep this information confidential</li>
                  </ul>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      const content = `School: ${selectedSchool.name}\nLogin URL: https://raynottedupot.com/login\nEmail: ${selectedSchool.email}\nPassword: ${selectedSchool.password}`;
                      copyToClipboard(content);
                    }}
                    className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50"
                  >
                    Copy All
                  </button>
                  <button
                    onClick={() => {
                      setShowCredentials(false);
                      setSelectedSchool(null);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
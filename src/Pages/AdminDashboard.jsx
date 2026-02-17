// src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  LogOut, Building2, UserPlus, Shield,
  Key, Phone, Search, Download, Trash2,
  Lock, Unlock, CheckCircle, AlertCircle,
  BarChart3, X, Copy,
  Users,
  Eye
} from 'lucide-react';
import { toast } from 'react-toastify';
import { auth } from '../service/firebase';
import SchoolApi from '../service/SchoolApi';  
import { useNavigate } from 'react-router-dom';

const AdminDashboard = ({ user, onLogout }) => {
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCredentials, setSelectedCredentials] = useState(null);
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [activeTab, setActiveTab] = useState('schools');
  const [loading, setLoading] = useState(false);

  const navigate=useNavigate()

  // Load real schools from backend
  const loadSchools = async () => {
    setLoading(true);
    const result = await SchoolApi.getAllSchools();
    setLoading(false);

    if (result.success) {
      const formatted = result.schools.map(school => ({
        ...school,
        createdAt: school.createdAt
          ? new Date(school.createdAt).toLocaleDateString('en-GB')
          : '—',
        lastLogin: school.lastLogin
          ? new Date(school.lastLogin).toLocaleDateString('en-GB')
          : 'Never',
      }));
      setSchools(formatted);
      setFilteredSchools(formatted);
    } else {
      toast.error(result.error || "Couldn't load schools");
    }
  };

  useEffect(() => {
    loadSchools();
  }, [activeTab]);

  // Search filter
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = schools.filter(s =>
      (s.name || '').toLowerCase().includes(term) ||
      (s.email || '').toLowerCase().includes(term) ||
      (s.phone || '').includes(term)
    );
    setFilteredSchools(filtered);
  }, [searchTerm, schools]);

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let pw = chars.charAt(Math.floor(Math.random() * 26));
    for (let i = 0; i < 11; i++) {
      pw += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pw;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.warning('Copied to clipboard!');
  };

  const handleCreateSchool = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const newSchool = {
      name: formData.get('name')?.trim(),
      email: formData.get('email')?.trim(),
      password: formData.get('password')?.trim(),
      phone: formData.get('phone')?.trim() || undefined,
    };

    if (!newSchool.name || !newSchool.email || !newSchool.password) {
      toast.error("Name, email and password are required");
      return;
    }

    setLoading(true);
    const result = await SchoolApi.createSchool(newSchool);
    setLoading(false);

    if (result.success) {
      toast.success("School created successfully!");
      setShowAddSchool(false);

      // Show credentials (password visible)
      setSelectedCredentials({
        name: newSchool.name,
        email: result.email || newSchool.email,
        password: newSchool.password,
      });
      setShowCredentials(true);
      loadSchools();
    } else {
      toast.error(result.error || "Failed to create school");
    }
  };

  const handleResetPassword = async (school) => {
    const newPassword = generatePassword();

    setLoading(true);
    const result = await SchoolApi.resetSchoolPassword(school.schoolId, newPassword);
    setLoading(false);

    if (result.success) {
      setSelectedCredentials({
        name: school.name,
        email: school.email,
        password: newPassword,
      });
      setShowCredentials(true);
      toast.success("Password reset successfully");
    } else {
      toast.error(result.error || "Password reset failed");
    }
  };

  const handleToggleStatus = async (school) => {
    const newStatus = school.status === 'active' ? 'inactive' : 'active';

    setLoading(true);
    const result = await SchoolApi.toggleSchoolStatus(school.schoolId, newStatus);
    setLoading(false);

    if (result.success) {
      toast.success(`School is now ${newStatus}`);
      loadSchools();
    } else {
      toast.error(result.error || "Could not change status");
    }
  };

  const handleDeleteSchool = async (schoolId) => {
    if (!window.confirm("Delete this school and its admin account permanently?")) return;

    setLoading(true);
    const result = await SchoolApi.deleteSchool(schoolId);
    setLoading(false);

    if (result.success) {
      toast.success("School deleted");
      loadSchools();
    } else {
      toast.error(result.error || "Delete failed");
    }
  };
  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('user');           // clear any stored user data
      localStorage.removeItem('schoolId');       // if you stored this
      toast.success("Logged out successfully");
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
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
                onClick={handleLogout}
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
              className={`px-4 py-4 font-medium text-sm transition-all relative ${activeTab === 'dashboard' ? 'text-amber-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center space-x-2">
                <BarChart3 size={18} />
                <span>Dashboard</span>
              </div>
              {activeTab === 'dashboard' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"></div>}
            </button>
            <button
              onClick={() => setActiveTab('schools')}
              className={`px-4 py-4 font-medium text-sm transition-all relative ${activeTab === 'schools' ? 'text-amber-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center space-x-2">
                <Building2 size={18} />
                <span>Schools ({schools.length})</span>
              </div>
              {activeTab === 'schools' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"></div>}
            </button>
          </nav>
        </div>
      </div>

      <div className="p-6">
        {loading && (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && !loading && (
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
                      {schools.filter(s => s.lastLogin !== 'Never').length}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-200 rounded-lg">
                    <CheckCircle className="text-purple-600" size={24} />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Schools with login activity</p>
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
                  <div key={school.schoolId} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Building2 className="text-amber-600" size={24} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{school.name}</p>
                        <p className="text-sm text-gray-600">{school.email}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${school.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
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
        {activeTab === 'schools' && !loading && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">School Management</h2>
                <p className="text-gray-600">Manage school accounts and credentials</p>
              </div>
              <button
                onClick={() => setShowAddSchool(true)}
                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-medium hover:from-amber-700 hover:to-amber-800 flex items-center space-x-3"
              >
                <UserPlus size={18} />
                <span>Add School</span>
              </button>
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
                  <div key={school.schoolId} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
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
                            onClick={() => {
                              setSelectedCredentials({
                                name: school.name,
                                email: school.email,
                                phone: school.phone,
                                status: school.status,
                                createdAt: school.createdAt,
                                lastLogin: school.lastLogin,
                                schoolId: school.schoolId,
                                // No password here — we'll show the message instead
                              });
                              setShowCredentials(true);
                            }}
                            className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 flex items-center space-x-2"
                          >
                            <Eye size={16} />
                            <span>View Info</span>
                          </button>

                          <button
                            onClick={() => handleDeleteSchool(school.schoolId)}
                            className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 flex items-center space-x-2"
                          >
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Email</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="font-medium break-all">{school.email}</p>
                            <button onClick={() => copyToClipboard(school.email)} title="Copy email">
                              <Copy size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Phone</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="font-medium">{school.phone || '-'}</p>
                            {school.phone && (
                              <button onClick={() => copyToClipboard(school.phone)} title="Copy phone">
                                <Copy size={14} />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Status</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${school.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                              {school.status}
                            </span>
                            <button
                              onClick={() => handleToggleStatus(school)}
                              className={`p-1 rounded ${school.status === 'active' ? 'text-red-600 hover:text-red-800 hover:bg-red-50' : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                                }`}
                              title={school.status === 'active' ? 'Deactivate' : 'Activate'}
                            >
                              {school.status === 'active' ? <Lock size={16} /> : <Unlock size={16} />}
                            </button>
                          </div>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Reset Password</p>
                          <button
                            onClick={() => handleResetPassword(school)}
                            className="mt-1 px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center space-x-2"
                          >
                            <Key size={14} />
                            <span>Reset</span>
                          </button>
                        </div>
                      </div>
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
                <button onClick={() => setShowAddSchool(false)}>
                  <X size={24} className="text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleCreateSchool}>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
                    <h4 className="font-semibold text-gray-800 mb-4">School Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">School Name *</label>
                        <input
                          type="text"
                          name="name"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Enter school name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
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
                          <label className="block text-sm font-medium text-gray-700">Password *</label>
                          <button
                            type="button"
                            onClick={() => {
                              const field = document.querySelector('input[name="password"]');
                              if (field) field.value = generatePassword();
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
                      disabled={loading}
                      className={`px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-medium hover:from-amber-700 hover:to-amber-800 flex items-center space-x-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <CheckCircle size={20} />
                      <span>{loading ? 'Creating...' : 'Create School Account'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showCredentials && selectedCredentials && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {selectedCredentials.isNew ? "New Login Credentials" : "School Account Info"}
                  </h3>
                  <p className="text-gray-600">
                    {selectedCredentials.isNew
                      ? "Provide these credentials to the school"
                      : "School admin login details"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowCredentials(false);
                    setSelectedCredentials(null);
                  }}
                >
                  <X size={24} className="text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Key className="text-amber-600" size={32} />
                    </div>
                    <p className="font-bold text-lg">{selectedCredentials.name}</p>
                  </div>

                  <div className="space-y-4">
                    {/* Email – always shown */}
                    <div>
                      <label className="text-sm text-gray-500 mb-2 block">Email Address</label>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <code className="text-gray-800 font-mono">{selectedCredentials.email}</code>
                        <button onClick={() => copyToClipboard(selectedCredentials.email)}>
                          <Copy size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Password section – different for create/reset vs view info */}
                    {selectedCredentials.password ? (
                      // This block shows only after create or reset
                      <div>
                        <label className="text-sm text-gray-500 mb-2 block">Password</label>
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <code className="text-green-600 font-mono font-bold">
                            {selectedCredentials.password}
                          </code>
                          <button onClick={() => copyToClipboard(selectedCredentials.password)}>
                            <Copy size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-amber-700 mt-1">
                          Copy this securely — it will not be shown again
                        </p>
                      </div>
                    ) : (
                      // This block shows when user clicks "View Info"
                      <div>
                        <label className="text-sm text-gray-500 mb-2 block">Password</label>
                        <div className="p-3 bg-gray-50 rounded-lg border text-gray-700 italic">
                          Password is shown only once after creation or reset.
                          <br />
                          If you need access, please use the <strong>Reset Password</strong> button.
                        </div>
                        <button
                          onClick={() => {
                            // Close current modal and trigger reset
                            setShowCredentials(false);
                            handleResetPassword({
                              schoolId: selectedCredentials.schoolId,
                              name: selectedCredentials.name,
                              email: selectedCredentials.email
                            });
                          }}
                          className="mt-3 px-4 py-2 bg-amber-600 text-white text-sm rounded hover:bg-amber-700 flex items-center space-x-2"
                        >
                          <Key size={16} />
                          <span>Reset Password Now</span>
                        </button>
                      </div>
                    )}

                    
                  </div>
                </div>

                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-2 flex items-center">
                    <AlertCircle size={16} className="mr-2" />
                    Important Instructions
                  </h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• This password is shown only once</li>
                    {/* <li>• Share these credentials securely</li> */}
                    <li>• Keep and share this information confidential and securely</li>
                    {/* <li>• If password is lost → use Reset Password button</li> */}
                  </ul>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      const content = `School: ${selectedCredentials.name}\nEmail: ${selectedCredentials.email}\nPassword: ${selectedCredentials.password}`;
                      copyToClipboard(content);
                    }}
                    className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50"
                  >
                    Copy All
                  </button>
                  <button
                    onClick={() => {
                      setShowCredentials(false);
                      setSelectedCredentials(null);
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
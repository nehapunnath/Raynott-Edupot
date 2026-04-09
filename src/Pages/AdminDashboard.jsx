// src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  LogOut, Building2, UserPlus, Shield,
  Key, Phone, Search, Download, Trash2,
  Lock, Unlock, CheckCircle, AlertCircle,
  BarChart3, X, Copy,
  Users, Eye, Plus, Settings, ChevronDown, ChevronUp,
  User
} from 'lucide-react';
import { toast } from 'react-toastify';
import { auth } from '../service/firebase';
import SchoolApi from '../service/SchoolApi';  
import { useNavigate } from 'react-router-dom';

const AVAILABLE_TABS = [
  { id: 'search', name: 'Search Students', icon: '🔍', description: 'Search and filter students' },
  { id: 'allStudents', name: 'All Students', icon: '📋', description: 'View complete student list' },
  { id: 'addStudent', name: 'Add Student', icon: '➕', description: 'Register new students' },
  { id: 'fees', name: 'Fees Management', icon: '💰', description: 'Manage fees and installments' },
  { id: 'marks', name: 'Marks & Grades', icon: '📊', description: 'Record and view marks' },
  { id: 'assessments', name: 'Assessments', icon: '📝', description: 'Manage assessments' }
];

const AdminDashboard = ({ user, onLogout }) => {
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCredentials, setSelectedCredentials] = useState(null);
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedSchoolForUser, setSelectedSchoolForUser] = useState(null);
  const [showTabConfig, setShowTabConfig] = useState(false);
  const [selectedUserForTabs, setSelectedUserForTabs] = useState(null);
  const [showCredentials, setShowCredentials] = useState(false);
  const [activeTab, setActiveTab] = useState('schools');
  const [loading, setLoading] = useState(false);
  const [expandedSchools, setExpandedSchools] = useState({});
  const [schoolUsers, setSchoolUsers] = useState({});
  const [tempSelectedTabs, setTempSelectedTabs] = useState([]);

  const navigate = useNavigate();

  // Load schools
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
      
      // Load users for each school
      formatted.forEach(school => {
        loadSchoolUsers(school.schoolId);
      });
    } else {
      toast.error(result.error || "Couldn't load schools");
    }
  };

    const handleTabToggle = (tabId) => {
    setTempSelectedTabs(prev => 
      prev.includes(tabId) 
        ? prev.filter(id => id !== tabId)
        : [...prev, tabId]
    );
  };

  const loadSchoolUsers = async (schoolId) => {
    const result = await SchoolApi.getSchoolUsers(schoolId);
    if (result.success) {
      setSchoolUsers(prev => ({
        ...prev,
        [schoolId]: result.users || []
      }));
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
    let pw = '';
    for (let i = 0; i < 12; i++) {
      pw += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pw;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.info('Copied to clipboard!');
  };

  // Create New School (School Admin - Full Access)
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

      setSelectedCredentials({
        name: newSchool.name,
        email: result.email || newSchool.email,
        password: newSchool.password,
        isNew: true,
        role: "School Admin (Full Access)"
      });
      setShowCredentials(true);
      setShowAddSchool(false);
      loadSchools();
    } else {
      toast.error(result.error || "Failed to create school");
    }
  };

  // Add Limited User
  const handleCreateSchoolUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const newUser = {
      name: formData.get('name')?.trim(),
      email: formData.get('email')?.trim(),
      password: formData.get('password')?.trim(),
      schoolId: selectedSchoolForUser.schoolId,
    };

    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Name, email and password are required");
      return;
    }

    setLoading(true);
    const result = await SchoolApi.createSchoolUser(newUser);
    setLoading(false);

    if (result.success) {
      toast.success(`User "${newUser.name}" created successfully!`);
      setSelectedCredentials({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        isNew: true,
        role: "Limited Access User"
      });
      setShowCredentials(true);
      setShowAddUser(false);
      loadSchoolUsers(selectedSchoolForUser.schoolId);
    } else {
      toast.error(result.error || "Failed to create user");
    }
  };

  // Reset Password - Auto generate
  const handleResetPassword = async (school, isUser = false, userData = null) => {
    const newPassword = generatePassword();

    if (isUser && userData) {
      // Reset user password logic here
      const result = await SchoolApi.resetSchoolUserPassword(userData.uid, newPassword);
      if (result.success) {
        setSelectedCredentials({
          name: userData.name,
          email: userData.email,
          password: newPassword,
          isNew: false,
          role: "User Password Reset"
        });
        setShowCredentials(true);
        toast.success("User password reset successfully");
      } else {
        toast.error(result.error || "Password reset failed");
      }
    } else {
      setLoading(true);
      const result = await SchoolApi.resetSchoolPassword(school.schoolId, newPassword);
      setLoading(false);

      if (result.success) {
        setSelectedCredentials({
          name: school.name,
          email: school.email,
          password: newPassword,
          isNew: false,
          role: "School Admin Password Reset"
        });
        setShowCredentials(true);
        toast.success("New password generated successfully");
      } else {
        toast.error(result.error || "Password reset failed");
      }
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
    if (!window.confirm("Delete this school and all its associated data permanently?")) return;
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

  const handleDeleteUser = async (uid, userName) => {
    if (!window.confirm(`Delete user "${userName}" permanently?`)) return;
    setLoading(true);
    const result = await SchoolApi.deleteSchoolUser(uid);
    setLoading(false);
    if (result.success) {
      toast.success(`User "${userName}" deleted`);
      // Reload users for the school
      const schoolId = Object.keys(schoolUsers).find(key => 
        schoolUsers[key].some(u => u.uid === uid)
      );
      if (schoolId) loadSchoolUsers(schoolId);
    } else {
      toast.error(result.error || "Delete failed");
    }
  };

const handleCustomizeUserTabs = (user, school) => {
  setSelectedUserForTabs({ user, school });
  setTempSelectedTabs(user.enabledTabs || []); // ← This line is critical
  setShowTabConfig(true);
};

  const toggleSchoolExpand = (schoolId) => {
    setExpandedSchools(prev => ({
      ...prev,
      [schoolId]: !prev[schoolId]
    }));
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('user');
      localStorage.removeItem('schoolId');
      toast.success("Logged out successfully");
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

   const saveUserTabConfig = async () => {
    if (!selectedUserForTabs) return;
    
    const result = await SchoolApi.updateUserTabConfig(
      selectedUserForTabs.user.uid, 
      tempSelectedTabs
    );
    
    if (result.success) {
      toast.success(`Tab configuration updated for ${selectedUserForTabs.user.name}`);
      setShowTabConfig(false);
      setSelectedUserForTabs(null);
      setTempSelectedTabs([]);
      // Reload users to reflect changes
      if (selectedUserForTabs.school) {
        loadSchoolUsers(selectedUserForTabs.school.schoolId);
      }
    } else {
      toast.error(result.error || "Failed to update tab configuration");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-600 shadow-lg sticky top-0 z-30">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Raynott Edupot</h1>
            <p className="text-amber-100">Admin Dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 backdrop-blur-sm text-white"
          >
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 bg-white shadow-sm sticky top-[73px] z-20">
        <div className="px-6">
          <nav className="flex space-x-8">
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

        {/* Schools Management Tab */}
        {activeTab === 'schools' && !loading && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">School Management</h2>
                <p className="text-gray-600">Manage schools, their users, and configurations</p>
              </div>
              <button
                onClick={() => setShowAddSchool(true)}
                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-medium hover:from-amber-700 hover:to-amber-800 flex items-center space-x-3 shadow-md transition-all"
              >
                <UserPlus size={18} />
                <span>Add School</span>
              </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
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
                  <div key={school.schoolId} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {/* School Header */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Building2 className="text-amber-600" size={28} />
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-bold text-gray-800">{school.name}</h3>
                              <button
  onClick={() => toggleSchoolExpand(school.schoolId)}
  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
    expandedSchools[school.schoolId] 
      ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-md' 
      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
  }`}
  title={expandedSchools[school.schoolId] ? "Collapse users" : "Expand users"}
>
  {expandedSchools[school.schoolId] ? (
    <>
      <ChevronUp size={18} />
      <span className="text-sm font-medium">Hide Users</span>
    </>
  ) : (
    <>
      <ChevronDown size={18} />
      <span className="text-sm font-medium">
        Show Users ({schoolUsers[school.schoolId]?.filter(user => user.role !== 'school_admin').length || 0})
      </span>
    </>
  )}
</button>
                            </div>
                            <p className="text-gray-600 text-sm">
                              ID: {school.schoolId} • Created: {school.createdAt}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Add User */}
                          <button
                            onClick={() => {
                              setSelectedSchoolForUser(school);
                              setShowAddUser(true);
                            }}
                            className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 flex items-center gap-2 transition-colors"
                            title="Add User to School"
                          >
                            <Plus size={16} />
                            <span className="hidden md:inline">Add User</span>
                          </button>

                          {/* View Info */}
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
                              });
                              setShowCredentials(true);
                            }}
                            className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 flex items-center gap-2 transition-colors"
                            title="View School Info"
                          >
                            <Eye size={16} />
                            <span className="hidden md:inline">Info</span>
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteSchool(school.schoolId)}
                            className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 flex items-center gap-2 transition-colors"
                            title="Delete School"
                          >
                            <Trash2 size={16} />
                            <span className="hidden md:inline">Delete</span>
                          </button>
                        </div>
                      </div>

                      {/* School Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Email</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="font-medium break-all text-sm">{school.email}</p>
                            <button onClick={() => copyToClipboard(school.email)} className="hover:text-amber-600">
                              <Copy size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Phone</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="font-medium">{school.phone || '-'}</p>
                            {school.phone && (
                              <button onClick={() => copyToClipboard(school.phone)} className="hover:text-amber-600">
                                <Copy size={14} />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Status</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${school.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {school.status}
                            </span>
                            <button
                              onClick={() => handleToggleStatus(school)}
                              className={`p-1 rounded transition-colors ${school.status === 'active' ?  'text-green-600 hover:text-green-800 hover:bg-green-50' : 'text-red-600 hover:text-red-800 hover:bg-red-50' }`}
                              title={school.status === 'active' ? 'Deactivate School' : 'Activate School'}
                            >
                              {school.status === 'active' ? <Unlock size={16} /> : <Lock size={16} />}
                            </button>
                          </div>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Admin Actions</p>
                          <button
                            onClick={() => handleResetPassword(school)}
                            className="mt-1 px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center gap-2 transition-colors w-full justify-center"
                          >
                            <Key size={14} />
                            <span>Reset Admin Password</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Users Section - Collapsible */}
                    {expandedSchools[school.schoolId] && (
                      <div className="border-t border-gray-200 bg-gray-50">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Users size={20} className="text-amber-600" />
                              <h4 className="font-semibold text-gray-800">School Users</h4>
                              <span className="text-sm text-gray-500">
                                ({schoolUsers[school.schoolId]?.length || 0} users)
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedSchoolForUser(school);
                                setShowAddUser(true);
                              }}
                              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              <Plus size={14} />
                              Add User
                            </button>
                          </div>

                          {(!schoolUsers[school.schoolId] || schoolUsers[school.schoolId].filter(user => user.role !== 'school_admin').length === 0) ? (
  <div className="text-center py-8 bg-white rounded-lg border border-dashed border-gray-300">
    <Users className="mx-auto text-gray-400 mb-2" size={32} />
    <p className="text-gray-500">No regular users added yet</p>
    <button
      onClick={() => {
        setSelectedSchoolForUser(school);
        setShowAddUser(true);
      }}
      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
    >
      Click here to add a user
    </button>
  </div>
) : (
  <div className="space-y-3">
    {schoolUsers[school.schoolId]
      .filter(user => user.role !== 'school_admin') // Filter out school admin
      .map((user) => (
        <div key={user.uid} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <User size={16} className="text-blue-500" />
                <p className="font-semibold text-gray-800 text-2xl">{user.name}</p>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {user.role === 'school_admin' ? 'School Admin' : (user.fullAccess ? 'Full Access' : 'Limited Access')}
                </span>
                {user.enabledTabs && user.enabledTabs.length > 0 && (
    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
      {user.enabledTabs.length} tabs enabled
    </span>
  )}
              </div>
              <p className="text-sm text-gray-600 break-all">{user.email}</p>
              {user.createdAt && (
                <p className="text-xs text-gray-400 mt-1">
                  Created: {new Date(user.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Customize Tabs Button - Only for regular users */}
              <button
                onClick={() => handleCustomizeUserTabs(user, school)}
                className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 flex items-center gap-1 text-sm transition-colors"
                title="Customize User Tabs"
              >
                <Settings size={14} />
                <span>Tabs</span>
              </button>
              <button
                onClick={() => handleResetPassword(school, true, user)}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 flex items-center gap-1 text-sm transition-colors"
                title="Reset User Password"
              >
                <Key size={14} />
                <span>Reset</span>
              </button>
              <button
                onClick={() => {
                  setSelectedCredentials({
                    name: user.name,
                    email: user.email,
                    role: user.role === 'school_admin' ? 'School Admin' : (user.fullAccess ? 'Full Access User' : 'Limited Access User'),
                    schoolId: school.schoolId,
                    createdAt: user.createdAt,
                  });
                  setShowCredentials(true);
                }}
                className="px-3 py-1.5 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 flex items-center gap-1 text-sm transition-colors"
                title="View User Info"
              >
                <Eye size={14} />
                <span>Info</span>
              </button>
              <button
                onClick={() => handleDeleteUser(user.uid, user.name)}
                className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 flex items-center gap-1 text-sm transition-colors"
                title="Delete User"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      ))}
  </div>
)}
                          
                        </div>
                      </div>
                    )}
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
                  <p className="text-gray-600">School Admin will get Full Dashboard Access</p>
                </div>
                <button onClick={() => setShowAddSchool(false)} className="hover:bg-gray-100 p-1 rounded">
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
                        <input type="text" name="name" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Enter school name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input type="tel" name="phone" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="9876543210" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <h4 className="font-semibold text-gray-800 mb-4">Login Credentials (School Admin)</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                        <input type="email" name="email" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="admin@school.edu.in" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">Password *</label>
                          <button type="button" onClick={() => {
                            const field = document.querySelector('input[name="password"]');
                            if (field) field.value = generatePassword();
                          }} className="text-sm text-blue-600 hover:text-blue-800">
                            Generate Password
                          </button>
                        </div>
                        <input type="text" name="password" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Create a strong password" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button type="button" onClick={() => setShowAddSchool(false)} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                      Cancel
                    </button>
                    <button type="submit" disabled={loading} className={`px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-medium hover:from-amber-700 hover:to-amber-800 flex items-center space-x-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}>
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

      {/* Add Limited User Modal */}
      {showAddUser && selectedSchoolForUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Add User to {selectedSchoolForUser.name}</h3>
                  <p className="text-gray-600">This user will have limited access based on tab configuration</p>
                </div>
                <button onClick={() => setShowAddUser(false)} className="hover:bg-gray-100 p-1 rounded">
                  <X size={24} className="text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleCreateSchoolUser}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">User Name *</label>
                    <input type="text" name="name" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="e.g., Ramesh Teacher" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input type="email" name="email" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="teacher@school.edu.in" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Password *</label>
                      <button type="button" onClick={() => {
                        const field = document.querySelector('input[name="password"]');
                        if (field) field.value = generatePassword();
                      }} className="text-sm text-blue-600 hover:text-blue-800">
                        Generate Password
                      </button>
                    </div>
                    <input type="text" name="password" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Strong password" />
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Settings size={16} className="text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-800 text-sm">Tab Access Configuration</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          After creating the user, click on the <strong>"Tabs"</strong> button next to the user's name 
                          to customize which dashboard tabs they can access. By default, new users will have no tabs enabled.
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-blue-600">
                          <span className="bg-blue-100 px-2 py-1 rounded">1. Create User</span>
                          <span>→</span>
                          <span className="bg-blue-100 px-2 py-1 rounded">2. Find user in list</span>
                          <span>→</span>
                          <span className="bg-blue-100 px-2 py-1 rounded">3. Click "Tabs" button</span>
                          <span>→</span>
                          <span className="bg-blue-100 px-2 py-1 rounded">4. Select allowed tabs</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <AlertCircle size={18} className="text-amber-600 mt-0.5" />
                      </div>
                      <div>
                        <p className="text-sm text-amber-700">
                          <strong>Note:</strong> Users will not see any dashboard tabs until you configure their access 
                          using the <strong>"Tabs"</strong> button. Make sure to set up their tab permissions after creation.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button type="button" onClick={() => setShowAddUser(false)} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                      Cancel
                    </button>
                    <button type="submit" disabled={loading} className={`px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-medium hover:from-amber-700 hover:to-amber-800 flex items-center space-x-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}>
                      <CheckCircle size={20} />
                      <span>{loading ? 'Creating...' : 'Create User'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* User Tab Configuration Modal */}
       {showTabConfig && selectedUserForTabs && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Customize Tabs for {selectedUserForTabs.user.name}</h3>
                  <p className="text-gray-600">School: {selectedUserForTabs.school.name}</p>
                  <p className="text-sm text-gray-500 mt-1">Select which tabs this user can access</p>
                </div>
                <button onClick={() => {
                  setShowTabConfig(false);
                  setSelectedUserForTabs(null);
                  setTempSelectedTabs([]);
                }} className="hover:bg-gray-100 p-1 rounded">
                  <X size={24} className="text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {AVAILABLE_TABS.map(tab => (
                    <label 
                      key={tab.id} 
                      className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        tempSelectedTabs.includes(tab.id)
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-amber-300'
                      }`}
                      onClick={() => handleTabToggle(tab.id)}
                    >
                      <input 
                        type="checkbox" 
                        className="mt-1 w-5 h-5 text-amber-600 rounded cursor-pointer"
                        checked={tempSelectedTabs.includes(tab.id)}
                        onChange={() => {}} // Handled by onClick on label
                      />
                      <div className="ml-3">
                        <div className="font-semibold">
                          <span className="mr-2">{tab.icon}</span>
                          {tab.name}
                        </div>
                        <p className="text-sm text-gray-600">{tab.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
                
                {/* Selection summary */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong className="text-amber-600">{tempSelectedTabs.length}</strong> of {AVAILABLE_TABS.length} tabs selected
                  </p>
                  {tempSelectedTabs.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      ⚠️ User won't be able to access any dashboard features
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button 
                  onClick={() => {
                    setShowTabConfig(false);
                    setSelectedUserForTabs(null);
                    setTempSelectedTabs([]);
                  }} 
                  className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveUserTabConfig} 
                  className="px-6 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Credentials Modal */}
      {showCredentials && selectedCredentials && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {selectedCredentials.role || (selectedCredentials.isNew ? "New Login Credentials" : "Account Info")}
                  </h3>
                  <p className="text-gray-600">
                    {selectedCredentials.isNew ? "Provide these credentials to the user" : "Account details"}
                  </p>
                </div>
                <button onClick={() => { setShowCredentials(false); setSelectedCredentials(null); }} className="hover:bg-gray-100 p-1 rounded">
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
                    <div>
                      <label className="text-sm text-gray-500 mb-2 block">Email Address</label>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <code className="text-gray-800 font-mono text-sm break-all">{selectedCredentials.email}</code>
                        <button onClick={() => copyToClipboard(selectedCredentials.email)} className="ml-2">
                          <Copy size={16} />
                        </button>
                      </div>
                    </div>

                    {selectedCredentials.password && (
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
                        <p className="text-xs text-amber-700 mt-1">Copy this securely — it will not be shown again</p>
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
                    <li>• Keep and share this information confidentially and securely</li>
                  </ul>
                </div>

                <div className="flex justify-end space-x-3">
                  {selectedCredentials.password && (
                    <button
                      onClick={() => {
                        const content = `Name: ${selectedCredentials.name}\nEmail: ${selectedCredentials.email}\nPassword: ${selectedCredentials.password}`;
                        copyToClipboard(content);
                      }}
                      className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50"
                    >
                      Copy All
                    </button>
                  )}
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
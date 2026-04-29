// src/components/dashboard/components/TeacherAssessmentTab.jsx
import React, { useState, useEffect } from 'react';
import { 
  Search, User, Plus, Edit2, Trash2, Save, X, 
  TrendingUp, BarChart3, BookOpen, Phone, Mail, 
  Star, Calendar, Users, Filter, Award, Percent,
  MessageSquare, FileText, CheckCircle, AlertCircle,
  Eye, Download, Printer, Clock
} from 'lucide-react';
import { toast } from 'react-toastify';

const TeachersAssessment = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    classesAssigned: [],
    phone: '',
    email: '',
    remarks: '',
    attendance: 0,
    feedback: '',
    overallPerformance: {}
  });

  // Load teachers on component mount
  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Demo data
      const demoTeachers = [
        {
          id: 'TCH001',
          name: 'Dr. Sarah Johnson',
          subject: 'Mathematics',
          classesAssigned: ['Class 3', 'Class 5'],
          phone: '+91 98765 43210',
          email: 'sarah.johnson@school.com',
          remarks: 'Experienced math teacher, excellent track record',
          attendance: 94,
          feedback: 'Very dedicated teacher. Students show great improvement in problem-solving skills.',
          overallPerformance: {
            'Class 3': { averagePercentage: 78, totalStudents: 32, examCount: 4 },
            'Class 5': { averagePercentage: 82, totalStudents: 28, examCount: 4 }
          },
          joinDate: '2020-06-15'
        },
        {
          id: 'TCH002',
          name: 'Prof. Michael Chen',
          subject: 'Physics',
          classesAssigned: ['Class 9', 'Class 10', 'Class 11'],
          phone: '+91 98765 43211',
          email: 'michael.chen@school.com',
          remarks: 'PhD in Physics, excellent at explaining concepts',
          attendance: 97,
          feedback: 'Outstanding teacher. Students consistently score above 85% in physics.',
          overallPerformance: {
            'Class 9': { averagePercentage: 85, totalStudents: 35, examCount: 4 },
            'Class 10': { averagePercentage: 88, totalStudents: 32, examCount: 4 },
            'Class 11': { averagePercentage: 76, totalStudents: 28, examCount: 4 }
          },
          joinDate: '2019-08-20'
        },
        {
          id: 'TCH003',
          name: 'Ms. Emily Rodriguez',
          subject: 'English',
          classesAssigned: ['Class 3', 'Class 4', 'Class 6'],
          phone: '+91 98765 43212',
          email: 'emily.r@school.com',
          remarks: 'Creative teaching methods, excellent communication',
          attendance: 91,
          feedback: 'Very engaging teacher. Students actively participate in class discussions.',
          overallPerformance: {
            'Class 3': { averagePercentage: 81, totalStudents: 32, examCount: 4 },
            'Class 4': { averagePercentage: 79, totalStudents: 30, examCount: 4 },
            'Class 6': { averagePercentage: 84, totalStudents: 28, examCount: 4 }
          },
          joinDate: '2021-01-10'
        },
        {
          id: 'TCH004',
          name: 'Dr. Rajesh Kumar',
          subject: 'Chemistry',
          classesAssigned: ['Class 11', 'Class 12'],
          phone: '+91 98765 43213',
          email: 'rajesh.k@school.com',
          remarks: 'Research background, excellent lab expertise',
          attendance: 88,
          feedback: 'Needs to improve practical demonstrations. Theory is well covered.',
          overallPerformance: {
            'Class 11': { averagePercentage: 72, totalStudents: 28, examCount: 4 },
            'Class 12': { averagePercentage: 74, totalStudents: 26, examCount: 4 }
          },
          joinDate: '2018-07-05'
        },
        {
          id: 'TCH005',
          name: 'Ms. Priya Sharma',
          subject: 'Computer Science',
          classesAssigned: ['Class 8', 'Class 9', 'Class 10'],
          phone: '+91 98765 43214',
          email: 'priya.s@school.com',
          remarks: 'Coding expert, robotics club coordinator',
          attendance: 96,
          feedback: 'Excellent hands-on teaching. Students are excelling in coding competitions.',
          overallPerformance: {
            'Class 8': { averagePercentage: 86, totalStudents: 34, examCount: 4 },
            'Class 9': { averagePercentage: 83, totalStudents: 35, examCount: 4 },
            'Class 10': { averagePercentage: 85, totalStudents: 32, examCount: 4 }
          },
          joinDate: '2020-11-20'
        }
      ];
      
      setTeachers(demoTeachers);
    } catch (error) {
      console.error('Load teachers error:', error);
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  // Get unique subjects and classes for filters
  const subjects = [...new Set(teachers.map(t => t.subject))];
  const allClasses = [...new Set(teachers.flatMap(t => t.classesAssigned))].sort();

  // Filter teachers
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = !searchTerm || 
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.phone.includes(searchTerm);

    const matchesSubject = !selectedSubject || teacher.subject === selectedSubject;
    const matchesClass = !selectedClass || teacher.classesAssigned.includes(selectedClass);

    return matchesSearch && matchesSubject && matchesClass;
  });

  // Calculate overall performance across all classes
  const calculateOverallPercentage = (teacher) => {
    const performances = Object.values(teacher.overallPerformance);
    if (performances.length === 0) return 0;
    const total = performances.reduce((sum, p) => sum + p.averagePercentage, 0);
    return Math.round(total / performances.length);
  };

  // Calculate average attendance
  const getAverageAttendance = () => {
    if (filteredTeachers.length === 0) return 0;
    const total = filteredTeachers.reduce((sum, t) => sum + t.attendance, 0);
    return Math.round(total / filteredTeachers.length);
  };

  // Calculate average performance
  const getAveragePerformance = () => {
    if (filteredTeachers.length === 0) return 0;
    const total = filteredTeachers.reduce((sum, t) => sum + calculateOverallPercentage(t), 0);
    return Math.round(total / filteredTeachers.length);
  };

  const handleAddTeacher = async () => {
    if (!formData.name || !formData.subject || !formData.classesAssigned.length) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const newTeacher = {
        id: `TCH${String(teachers.length + 1).padStart(3, '0')}`,
        ...formData,
        joinDate: new Date().toISOString().split('T')[0]
      };
      
      setTeachers([...teachers, newTeacher]);
      toast.success('Teacher added successfully');
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to add teacher');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTeacher = async () => {
    setLoading(true);
    try {
      setTeachers(teachers.map(t => 
        t.id === selectedTeacher.id ? { ...selectedTeacher } : t
      ));
      toast.success('Teacher updated successfully');
      setShowEditModal(false);
      setSelectedTeacher(null);
    } catch (error) {
      toast.error('Failed to update teacher');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeacher = async (teacherId) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;
    
    setLoading(true);
    try {
      setTeachers(teachers.filter(t => t.id !== teacherId));
      toast.success('Teacher deleted successfully');
    } catch (error) {
      toast.error('Failed to delete teacher');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      subject: '',
      classesAssigned: [],
      phone: '',
      email: '',
      remarks: '',
      attendance: 0,
      feedback: '',
      overallPerformance: {}
    });
  };

  const handleClassToggle = (className) => {
    const current = formData.classesAssigned;
    if (current.includes(className)) {
      setFormData({ ...formData, classesAssigned: current.filter(c => c !== className) });
    } else {
      setFormData({ ...formData, classesAssigned: [...current, className] });
    }
  };

  const handleClassPerformanceChange = (className, percentage) => {
    setSelectedTeacher({
      ...selectedTeacher,
      overallPerformance: {
        ...selectedTeacher.overallPerformance,
        [className]: {
          ...selectedTeacher.overallPerformance[className],
          averagePercentage: parseInt(percentage) || 0
        }
      }
    });
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getAttendanceColor = (attendance) => {
    if (attendance >= 90) return 'text-green-600';
    if (attendance >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Users className="text-indigo-600" size={28} />
              <h2 className="text-2xl font-bold text-gray-800">Teacher Assessment</h2>
            </div>
            <p className="text-gray-600">
              Manage teacher profiles, track attendance, feedback, and class performance percentages.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 flex items-center space-x-2 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus size={18} />
            <span>Add New Teacher</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Teachers</p>
              <p className="text-2xl font-bold text-gray-800">{filteredTeachers.length}</p>
            </div>
            <Users size={32} className="text-indigo-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Avg Attendance</p>
              <p className="text-2xl font-bold text-gray-800">{getAverageAttendance()}%</p>
            </div>
            <Clock size={32} className="text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Subjects Offered</p>
              <p className="text-2xl font-bold text-gray-800">{subjects.length}</p>
            </div>
            <BookOpen size={32} className="text-blue-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Avg Performance</p>
              <p className="text-2xl font-bold text-indigo-600">{getAveragePerformance()}%</p>
            </div>
            <Award size={32} className="text-amber-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Filter Teachers</h3>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedSubject('');
              setSelectedClass('');
            }}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-indigo-600 flex items-center space-x-1"
          >
            <Filter size={14} />
            <span>Clear Filters</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Classes</option>
            {allClasses.map(className => (
              <option key={className} value={className}>{className}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Teachers Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Teacher</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Subject</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Classes</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Attendance</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Performance</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Feedback</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTeachers.map(teacher => {
                const overallPerf = calculateOverallPercentage(teacher);
                return (
                  <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-800">{teacher.name}</p>
                        <p className="text-xs text-gray-500">{teacher.email}</p>
                        <p className="text-xs text-gray-400">{teacher.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                        {teacher.subject}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {teacher.classesAssigned.map(cls => (
                          <span key={cls} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                            {cls}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-semibold ${getAttendanceColor(teacher.attendance)}`}>
                        {teacher.attendance}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getPerformanceColor(overallPerf)}`}>
                          {overallPerf}%
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          {Object.keys(teacher.overallPerformance).length} classes
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                        {teacher.feedback || '—'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setShowViewModal(true);
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setShowEditModal(true);
                          }}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteTeacher(teacher.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredTeachers.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <User className="text-gray-400" size={32} />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">No teachers found</h4>
            <p className="text-gray-600">Click "Add New Teacher" to get started</p>
          </div>
        )}
      </div>

      {/* Add Teacher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Add New Teacher</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              {/* Personal Info */}
              <div>
                <h3 className="text-md font-semibold text-gray-800 mb-3">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter teacher name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Mathematics"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="Contact number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="Email address"
                    />
                  </div>
                </div>
              </div>

              {/* Assignment Info */}
              <div>
                <h3 className="text-md font-semibold text-gray-800 mb-3">Assignment & Performance</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Classes Assigned *</label>
                    <div className="flex flex-wrap gap-2">
                      {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map(className => (
                        <button
                          key={className}
                          type="button"
                          onClick={() => handleClassToggle(className)}
                          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                            formData.classesAssigned.includes(className)
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {className}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Attendance (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.attendance}
                      onChange={(e) => setFormData({ ...formData, attendance: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 95"
                    />
                  </div>
                </div>
              </div>

              {/* Feedback & Remarks */}
              <div>
                <h3 className="text-md font-semibold text-gray-800 mb-3">Feedback & Remarks</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teacher Feedback</label>
                    <textarea
                      rows={2}
                      value={formData.feedback}
                      onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="Write feedback about the teacher..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                    <textarea
                      rows={2}
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="Additional remarks..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTeacher}
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
              >
                {loading ? 'Saving...' : 'Add Teacher'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Teacher Modal */}
      {showEditModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Edit Teacher: {selectedTeacher.name}</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-md font-semibold text-gray-800 mb-3">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={selectedTeacher.name}
                      onChange={(e) => setSelectedTeacher({ ...selectedTeacher, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      value={selectedTeacher.subject}
                      onChange={(e) => setSelectedTeacher({ ...selectedTeacher, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={selectedTeacher.phone}
                      onChange={(e) => setSelectedTeacher({ ...selectedTeacher, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={selectedTeacher.email}
                      onChange={(e) => setSelectedTeacher({ ...selectedTeacher, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Attendance (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={selectedTeacher.attendance}
                      onChange={(e) => setSelectedTeacher({ ...selectedTeacher, attendance: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Class Performance */}
              <div>
                <h3 className="text-md font-semibold text-gray-800 mb-3">Class-wise Performance (%)</h3>
                <div className="space-y-3">
                  {selectedTeacher.classesAssigned.map(className => (
                    <div key={className} className="flex items-center space-x-4">
                      <span className="w-24 font-medium text-gray-700">{className}</span>
                      <div className="flex-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={selectedTeacher.overallPerformance[className]?.averagePercentage || 0}
                          onChange={(e) => handleClassPerformanceChange(className, e.target.value)}
                          className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          placeholder="Percentage"
                        />
                        <span className="ml-2 text-gray-500">%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              <div>
                <h3 className="text-md font-semibold text-gray-800 mb-3">Feedback & Remarks</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teacher Feedback</label>
                    <textarea
                      rows={3}
                      value={selectedTeacher.feedback || ''}
                      onChange={(e) => setSelectedTeacher({ ...selectedTeacher, feedback: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="Write feedback about the teacher..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                    <textarea
                      rows={2}
                      value={selectedTeacher.remarks || ''}
                      onChange={(e) => setSelectedTeacher({ ...selectedTeacher, remarks: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="Additional remarks..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTeacher}
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Teacher Modal */}
      {showViewModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Teacher Details</h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              {/* Header with Name & Subject */}
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{selectedTeacher.name}</h3>
                    <p className="text-indigo-600 font-medium">{selectedTeacher.subject} Teacher</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Teacher ID</p>
                    <p className="font-mono text-sm">{selectedTeacher.id}</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-gray-700">{selectedTeacher.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-gray-700">{selectedTeacher.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-gray-700">Joined: {selectedTeacher.joinDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users size={16} className="text-gray-400" />
                  <span className="text-gray-700">Classes: {selectedTeacher.classesAssigned.join(', ')}</span>
                </div>
              </div>

              {/* Performance Overview */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                  <Percent size={18} className="text-indigo-600" />
                  <span>Performance Overview</span>
                </h4>
                <div className="space-y-3">
                  {Object.entries(selectedTeacher.overallPerformance).map(([className, data]) => (
                    <div key={className}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{className} (Students: {data.totalStudents})</span>
                        <span className="font-semibold">{data.averagePercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 rounded-full h-2 transition-all"
                          style={{ width: `${data.averagePercentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Overall Average:</span>
                    <span className={`text-xl font-bold ${getPerformanceColor(calculateOverallPercentage(selectedTeacher))}`}>
                      {calculateOverallPercentage(selectedTeacher)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Attendance */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                  <Clock size={18} className="text-green-600" />
                  <span>Attendance</span>
                </h4>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className={`rounded-full h-3 transition-all ${
                        selectedTeacher.attendance >= 90 ? 'bg-green-500' :
                        selectedTeacher.attendance >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${selectedTeacher.attendance}%` }}
                    />
                  </div>
                  <span className="font-bold text-lg">{selectedTeacher.attendance}%</span>
                </div>
              </div>

              {/* Feedback */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                  <MessageSquare size={18} className="text-amber-600" />
                  <span>Feedback</span>
                </h4>
                <p className="text-gray-700 bg-amber-50 p-3 rounded-lg italic">
                  "{selectedTeacher.feedback || 'No feedback provided yet'}"
                </p>
              </div>

              {/* Remarks */}
              {selectedTeacher.remarks && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Remarks</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedTeacher.remarks}
                  </p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachersAssessment;
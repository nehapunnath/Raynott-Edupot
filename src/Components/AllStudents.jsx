// src/components/dashboard/components/AllStudents.jsx
import React, { useState } from 'react';
import { 
  Search, Filter, Download, User, Calendar, BookOpen, Hash, Phone, RefreshCw, 
  ChevronDown, ChevronRight, Users, GraduationCap, LayoutGrid, List, 
  TrendingUp, TrendingDown, Award, Clock, CheckCircle, XCircle,
  BarChart3, PieChart, DollarSign, CreditCard, AlertTriangle,
  Grid3x3, School, Layers, FolderTree,
  Eye, Trash2, ArrowLeft
} from 'lucide-react';
import StudentCard from './StudentCard';
import ClassSectionView from './ClassSectionView';

const AllStudents = ({ students, onViewDetails, onDelete, onUpdateStudent, onRefresh, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedClasses, setExpandedClasses] = useState({});
  const [viewMode, setViewMode] = useState('class'); // 'class', 'grid', 'list'
  const [sortBy, setSortBy] = useState('name');
  const [selectedClass, setSelectedClass] = useState(null); // { grade, section }
  const [selectedSectionData, setSelectedSectionData] = useState(null);

  // Get unique grades and sections
  const grades = [...new Set(students.map(s => s.basicInfo?.grade).filter(Boolean))].sort();
  const sections = [...new Set(students.map(s => s.basicInfo?.section).filter(Boolean))].sort();

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = !searchTerm || 
      student.basicInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.basicInfo?.admissionNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.basicInfo?.fatherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.basicInfo?.fatherPhone?.includes(searchTerm);

    const matchesGrade = !selectedGrade || student.basicInfo?.grade === selectedGrade;
    const matchesSection = !selectedSection || student.basicInfo?.section === selectedSection;
    const matchesStatus = !selectedStatus || student.status === selectedStatus;

    return matchesSearch && matchesGrade && matchesSection && matchesStatus;
  });

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === 'name') {
      return (a.basicInfo?.name || '').localeCompare(b.basicInfo?.name || '');
    } else if (sortBy === 'admission') {
      return (a.basicInfo?.admissionNo || '').localeCompare(b.basicInfo?.admissionNo || '');
    } else if (sortBy === 'grade') {
      return (a.basicInfo?.grade || '').localeCompare(b.basicInfo?.grade || '');
    }
    return 0;
  });

  // Group students by class and section
  const getGroupedStudents = () => {
    const groups = new Map();
    
    sortedStudents.forEach(student => {
      const grade = student.basicInfo?.grade || 'Unassigned';
      const section = student.basicInfo?.section || 'Unassigned';
      const key = `${grade}-${section}`;
      
      if (!groups.has(key)) {
        groups.set(key, {
          grade,
          section,
          students: [],
          totalFees: 0,
          totalPaid: 0,
          studentCount: 0
        });
      }
      
      const group = groups.get(key);
      group.students.push(student);
      group.totalFees += student.feeStructure?.total || 0;
      group.totalPaid += student.totalPaid || 0;
      group.studentCount++;
    });
    
    return Array.from(groups.values()).sort((a, b) => {
      if (a.grade !== b.grade) return a.grade.localeCompare(b.grade);
      return a.section.localeCompare(b.section);
    });
  };

  // Calculate statistics
  const totalStudents = students.length;
  const totalFees = students.reduce((sum, s) => sum + (s.feeStructure?.total || 0), 0);
  const totalPaid = students.reduce((sum, s) => sum + (s.totalPaid || 0), 0);
  const totalPending = totalFees - totalPaid;
  const averageProgress = totalFees > 0 ? Math.round((totalPaid / totalFees) * 100) : 0;
  
  const paidStudents = students.filter(s => (s.pendingAmount || 0) === 0).length;
  const pendingStudents = students.filter(s => (s.pendingAmount || 0) > 0).length;
  const overdueStudents = students.filter(s => (s.overdueAmount || 0) > 0).length;

  const handleDownloadAll = () => {
    const csvContent = [
      ['Name', 'Admission No', 'Grade', 'Section', 'Father Name', 'Phone', 'Total Fees', 'Paid Amount', 'Pending Amount', 'Status'],
      ...sortedStudents.map(student => [
        student.basicInfo?.name || '',
        student.basicInfo?.admissionNo || '',
        student.basicInfo?.grade || '',
        student.basicInfo?.section || '',
        student.basicInfo?.fatherName || '',
        student.basicInfo?.fatherPhone || '',
        student.feeStructure?.total || 0,
        student.totalPaid || 0,
        student.pendingAmount || 0,
        student.status || ''
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedGrade('');
    setSelectedSection('');
    setSelectedStatus('');
  };

  const toggleClass = (grade, section) => {
    const key = `${grade}-${section}`;
    setExpandedClasses(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const expandAll = () => {
    const allExpanded = {};
    getGroupedStudents().forEach(group => {
      allExpanded[`${group.grade}-${group.section}`] = true;
    });
    setExpandedClasses(allExpanded);
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
  };

  const collapseAll = () => {
    setExpandedClasses({});
  };

  // Handle class/section click
  const handleClassClick = (grade, section, studentsList) => {
    setSelectedClass({ grade, section });
    setSelectedSectionData({
      grade,
      section,
      students: studentsList,
      totalFees: studentsList.reduce((sum, s) => sum + (s.feeStructure?.total || 0), 0),
      totalPaid: studentsList.reduce((sum, s) => sum + (s.totalPaid || 0), 0),
      studentCount: studentsList.length
    });
    setViewMode('students');
  };

  // Go back to classes view
  const handleBackToClasses = () => {
    setSelectedClass(null);
    setSelectedSectionData(null);
    setViewMode('class');
  };

  // Render Class/Section View
  const renderClassView = () => {
    const groups = getGroupedStudents();
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {groups.map((group) => {
          const progress = group.totalFees > 0 ? Math.round((group.totalPaid / group.totalFees) * 100) : 0;
          
          return (
            <div 
              key={`${group.grade}-${group.section}`}
              onClick={() => handleClassClick(group.grade, group.section, group.students)}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-amber-50 to-white px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl">
                      <School size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Grade {group.grade}
                      </h3>
                      <p className="text-sm text-gray-600">Section {group.section}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-400 group-hover:text-amber-600 transition-colors" size={24} />
                </div>
              </div>
              
              {/* Card Content */}
              <div className="p-6 space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Users size={18} className="text-amber-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{group.studentCount}</p>
                    <p className="text-xs text-gray-500">Total Students</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <DollarSign size={18} className="text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{progress}%</p>
                    <p className="text-xs text-gray-500">Collection Rate</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Fee Collection</span>
                    <span className="font-medium text-amber-700">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-amber-600 h-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Fees:</span>
                    <span className="font-semibold text-gray-800">₹{group.totalFees.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600">Collected:</span>
                    <span className="font-semibold text-green-600">₹{group.totalPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600">Pending:</span>
                    <span className="font-semibold text-red-600">₹{(group.totalFees - group.totalPaid).toLocaleString()}</span>
                  </div>
                </div>

                {/* View Button */}
                <button 
                  className="w-full mt-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center space-x-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClassClick(group.grade, group.section, group.students);
                  }}
                >
                  <Eye size={16} />
                  <span>View Students</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render Students List for selected class/section
  const renderStudentsView = () => {
    if (!selectedSectionData) return null;

    const { grade, section, students: classStudents, totalFees, totalPaid, studentCount } = selectedSectionData;
    const progress = totalFees > 0 ? Math.round((totalPaid / totalFees) * 100) : 0;

    return (
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToClasses}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} className="text-gray-600" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Grade {grade} - Section {section}
                </h2>
                <p className="text-gray-500 mt-1">Managing {studentCount} students in this class</p>
              </div>
            </div>
            
            {/* Class Summary */}
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-gray-500">Collection Progress</p>
                <p className="text-2xl font-bold text-amber-600">{progress}%</p>
              </div>
              <div className="w-32">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats for the class */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-xl font-bold text-gray-800">{studentCount}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Fees</p>
                <p className="text-xl font-bold text-gray-800">₹{totalFees.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Amount</p>
                <p className="text-xl font-bold text-red-600">₹{(totalFees - totalPaid).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters for this class */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={`Search students in Grade ${grade} - Section ${section}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Students List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        ) : classStudents.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={32} className="text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">No students found</h4>
            <p className="text-gray-500">No students in this class/section</p>
          </div>
        ) : (
          <div className="space-y-3">
            {classStudents
              .filter(student => {
                if (!searchTerm) return true;
                return student.basicInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       student.basicInfo?.admissionNo?.toLowerCase().includes(searchTerm.toLowerCase());
              })
              .map(student => (
                <StudentCard
                  key={student.id || student.studentId}
                  student={student}
                  onViewDetails={() => onViewDetails(student)}
                  onDelete={() => onDelete(student.studentId || student.id)}
                  onUpdateStudent={onUpdateStudent}
                />
              ))}
          </div>
        )}
      </div>
    );
  };

  // Render Stats Cards
  const renderStatsCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Students</p>
            <p className="text-3xl font-bold text-gray-800">{totalStudents}</p>
            <p className="text-xs text-green-600 mt-2 flex items-center">
              <TrendingUp size={12} className="mr-1" />
              Active: {students.filter(s => s.status === 'active').length}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Users size={24} className="text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Fee Collection</p>
            <p className="text-3xl font-bold text-gray-800">{averageProgress}%</p>
            <p className="text-xs text-gray-600 mt-2">
              ₹{totalPaid.toLocaleString()} / ₹{totalFees.toLocaleString()}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <PieChart size={24} className="text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Pending Amount</p>
            <p className="text-3xl font-bold text-red-600">₹{totalPending.toLocaleString()}</p>
            <p className="text-xs text-orange-600 mt-2 flex items-center">
              <AlertTriangle size={12} className="mr-1" />
              {pendingStudents} students have dues
            </p>
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <DollarSign size={24} className="text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Classes/Sections</p>
            <p className="text-3xl font-bold text-gray-800">{getGroupedStudents().length}</p>
            <p className="text-xs text-amber-600 mt-2 flex items-center">
              <School size={12} className="mr-1" />
              Active Classes
            </p>
          </div>
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
            <Layers size={24} className="text-amber-600" />
          </div>
        </div>
      </div>
    </div>
  );

  // Main render - show class view or students view based on selection
  if (viewMode === 'students' && selectedSectionData) {
    return renderStudentsView();
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Student Management</h2>
          <p className="text-gray-500 text-sm mt-1">Browse classes and sections to view students</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all disabled:opacity-50 shadow-sm"
          >
            <RefreshCw size={18} className={(isRefreshing || isLoading) ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleDownloadAll}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-sm"
          >
            <Download size={16} />
            <span>Export All CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {renderStatsCards()}

      {/* Classes and Sections Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Classes & Sections
            <span className="ml-2 text-sm font-normal text-gray-500">({getGroupedStudents().length} classes)</span>
          </h3>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        ) : getGroupedStudents().length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <School size={32} className="text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">No classes found</h4>
            <p className="text-gray-500">Add students to create classes and sections</p>
          </div>
        ) : (
          renderClassView()
        )}
      </div>
    </div>
  );
};

export default AllStudents;
// src/components/dashboard/components/FeesTab.jsx
import React, { useState, useMemo } from 'react';
import { Search, Filter, User, Calendar, DollarSign, CreditCard, X, Eye, School, Users, ArrowLeft, TrendingUp, AlertCircle, ChevronRight } from 'lucide-react';
import FeesInstallment from './FeesInstallment';

const FeesTab = ({ students, onUpdateStudent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showFeesModal, setShowFeesModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSectionData, setSelectedSectionData] = useState(null);
  const [viewMode, setViewMode] = useState('class'); // 'class' or 'students'

  // Get unique grades and sections for filters
  const grades = [...new Set(students.map(s => s.basicInfo?.grade).filter(Boolean))].sort();
  const sections = [...new Set(students.map(s => s.basicInfo?.section).filter(Boolean))].sort();

  // Group students by class and section with fee summary
  const getGroupedClasses = () => {
    const groups = new Map();
    
    students.forEach(student => {
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
          totalPending: 0,
          studentCount: 0,
          paidCount: 0,
          partialCount: 0,
          pendingCount: 0
        });
      }
      
      const group = groups.get(key);
      const pending = student.pendingAmount || 0;
      const paid = student.totalPaid || 0;
      
      group.students.push(student);
      group.totalFees += student.feeStructure?.total || 0;
      group.totalPaid += paid;
      group.totalPending += pending;
      group.studentCount++;
      
      if (pending === 0) group.paidCount++;
      else if (paid > 0) group.partialCount++;
      else group.pendingCount++;
    });
    
    return Array.from(groups.values()).sort((a, b) => {
      if (a.grade !== b.grade) return a.grade.localeCompare(b.grade);
      return a.section.localeCompare(b.section);
    });
  };

  // Filter students within a selected class
  const getFilteredStudentsForClass = (studentsList) => {
    return studentsList.filter(student => {
      const pendingAmount = student.pendingAmount || 0;
      const paidAmount = student.totalPaid || 0;
      
      let feeStatus = 'pending';
      if (pendingAmount === 0) feeStatus = 'paid';
      else if (paidAmount > 0) feeStatus = 'partial';
      else if (pendingAmount > 0 && paidAmount === 0) feeStatus = 'pending';
      
      const matchesSearch = !searchTerm || 
        student.basicInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.basicInfo?.admissionNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.basicInfo?.fatherName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !selectedStatus || feeStatus === selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  };

  // Calculate overall summary statistics
  const summary = useMemo(() => {
    const total = {
      totalFees: 0,
      totalPaid: 0,
      totalPending: 0,
      paidCount: 0,
      partialCount: 0,
      pendingCount: 0,
      totalStudents: students.length,
      totalClasses: getGroupedClasses().length
    };

    students.forEach(student => {
      const pending = student.pendingAmount || 0;
      const paid = student.totalPaid || 0;
      
      total.totalFees += student.feeStructure?.total || 0;
      total.totalPaid += paid;
      total.totalPending += pending;
      
      if (pending === 0) total.paidCount++;
      else if (paid > 0) total.partialCount++;
      else total.pendingCount++;
    });

    return total;
  }, [students]);

  const handleViewFees = (student) => {
    setSelectedStudent(student);
    setShowFeesModal(true);
  };

  const handleCloseModal = () => {
    setShowFeesModal(false);
    setSelectedStudent(null);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedGrade('');
    setSelectedSection('');
    setSelectedStatus('');
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
      totalPending: studentsList.reduce((sum, s) => sum + (s.pendingAmount || 0), 0),
      studentCount: studentsList.length,
      paidCount: studentsList.filter(s => (s.pendingAmount || 0) === 0).length,
      partialCount: studentsList.filter(s => (s.pendingAmount || 0) > 0 && (s.totalPaid || 0) > 0).length,
      pendingCount: studentsList.filter(s => (s.pendingAmount || 0) > 0 && (s.totalPaid || 0) === 0).length
    });
    setViewMode('students');
  };

  // Go back to classes view
  const handleBackToClasses = () => {
    setSelectedClass(null);
    setSelectedSectionData(null);
    setViewMode('class');
    setSearchTerm('');
    setSelectedStatus('');
  };

  const getFeeStatusColor = (student) => {
    const pending = student.pendingAmount || 0;
    const paid = student.totalPaid || 0;
    
    if (pending === 0) return 'bg-green-100 text-green-800 border-green-200';
    if (paid > 0) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getFeeStatusText = (student) => {
    const pending = student.pendingAmount || 0;
    const paid = student.totalPaid || 0;
    
    if (pending === 0) return 'Paid';
    if (paid > 0) return 'Partial';
    return 'Pending';
  };

  // Render Class/Section View
  const renderClassView = () => {
    const groups = getGroupedClasses();
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {groups.map((group) => {
          const progress = group.totalFees > 0 ? Math.round((group.totalPaid / group.totalFees) * 100) : 0;
          
          return (
            <div 
              key={`${group.grade}-${group.section}`}
              onClick={() => handleClassClick(group.grade, group.section, group.students)}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group-hover"
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

                {/* Status Summary */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Paid:</span>
                    <span className="font-semibold text-green-600">{group.paidCount}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Partial:</span>
                    <span className="font-semibold text-amber-600">{group.partialCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pending:</span>
                    <span className="font-semibold text-red-600">{group.pendingCount}</span>
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
                    <span className="font-semibold text-red-600">₹{group.totalPending.toLocaleString()}</span>
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
                  <span>View Fee Details</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render Students View for selected class
  const renderStudentsView = () => {
    if (!selectedSectionData) return null;
    
    const filteredClassStudents = getFilteredStudentsForClass(selectedSectionData.students);
    const { grade, section, totalFees, totalPaid, totalPending, studentCount, paidCount, partialCount, pendingCount } = selectedSectionData;
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
                  Fee Details: Grade {grade} - Section {section}
                </h2>
                <p className="text-gray-500 mt-1">Managing fees for {studentCount} students</p>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
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
                <AlertCircle size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Amount</p>
                <p className="text-xl font-bold text-red-600">₹{totalPending.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <CreditCard size={20} className="text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Collection Rate</p>
                <p className="text-xl font-bold text-amber-600">{progress}%</p>
              </div>
            </div>
          </div>

          {/* Status Summary Chips */}
          <div className="flex flex-wrap gap-3 pt-4">
            <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
              Paid: {paidCount}
            </div>
            <div className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium">
              Partial: {partialCount}
            </div>
            <div className="px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-medium">
              Pending: {pendingCount}
            </div>
          </div>
        </div>

        {/* Search and Filters for this class */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={`Search students in Grade ${grade} - Section ${section}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500"
              >
                <option value="">All Fee Status</option>
                <option value="paid">Paid (No Dues)</option>
                <option value="partial">Partial Payment</option>
                <option value="pending">Pending (No Payment)</option>
              </select>
            </div>
          </div>

          {(searchTerm || selectedStatus) && (
            <div className="flex justify-end mt-3">
              <button
                onClick={handleClearFilters}
                className="text-sm text-amber-600 hover:text-amber-700"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Students ({filteredClassStudents.length})
          </h3>
        </div>

        {/* Student Cards */}
        <div className="space-y-4">
          {filteredClassStudents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <User className="text-gray-400" size={32} />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">No students found</h4>
              <p className="text-gray-600">
                {searchTerm || selectedStatus
                  ? "Try adjusting your filters"
                  : "No students with fee records in this class"}
              </p>
            </div>
          ) : (
            filteredClassStudents.map(student => (
              <div
                key={student.id || student.studentId}
                className="bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-200"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">
                          {student.basicInfo?.name?.charAt(0) || '?'}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-gray-900">
                            {student.basicInfo?.name || 'Unnamed'}
                          </h3>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getFeeStatusColor(student)}`}>
                            {getFeeStatusText(student)}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 mt-2">
                          <span>Adm: {student.basicInfo?.admissionNo || '—'}</span>
                          <span>Phone: {student.basicInfo?.fatherPhone || '—'}</span>
                        </div>
                      </div>

                      <div className="hidden md:block w-48">
                        <div className="text-xs text-gray-600 mb-1">Fee Progress</div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-green-600">₹{(student.totalPaid || 0).toLocaleString()}</span>
                          <span className="font-medium text-red-600">₹{(student.pendingAmount || 0).toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-amber-600 h-full"
                            style={{ width: `${((student.totalPaid || 0) / (student.feeStructure?.total || 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleViewFees(student)}
                      className="p-4 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    >
                      <Eye size={21} />
                    </button>
                  </div>

                  {/* Mobile Summary */}
                  <div className="mt-4 md:hidden border-t pt-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-gray-600">Total</p>
                        <p className="font-semibold">₹{(student.feeStructure?.total || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Paid</p>
                        <p className="font-semibold text-green-600">₹{(student.totalPaid || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Pending</p>
                        <p className="font-semibold text-red-600">₹{(student.pendingAmount || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // Main render - show class view or students view based on selection
  if (viewMode === 'students' && selectedSectionData) {
    return renderStudentsView();
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Classes</p>
              <p className="text-3xl font-bold text-gray-800">{summary.totalClasses}</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <School className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-gray-800">{summary.totalStudents}</p>
            </div>
            <div className="p-3 bg-purple-200 rounded-lg">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Paid</p>
              <p className="text-3xl font-bold text-gray-800">₹{summary.totalPaid.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <CreditCard className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pending</p>
              <p className="text-3xl font-bold text-gray-800">₹{summary.totalPending.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-red-200 rounded-lg">
              <DollarSign className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Collection Rate</p>
              <p className="text-3xl font-bold text-gray-800">
                {summary.totalFees > 0 
                  ? Math.round((summary.totalPaid / summary.totalFees) * 100) 
                  : 0}%
              </p>
            </div>
            <div className="p-3 bg-amber-200 rounded-lg">
              <TrendingUp className="text-amber-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Fees</p>
              <p className="text-3xl font-bold text-gray-800">₹{summary.totalFees.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-indigo-200 rounded-lg">
              <DollarSign className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Classes and Sections Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Classes & Sections
            <span className="ml-2 text-sm font-normal text-gray-500">({getGroupedClasses().length} classes)</span>
          </h3>
        </div>

        {students.length === 0 ? (
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

      {/* Fees Installment Modal */}
      {showFeesModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-y-auto relative">
            <div className="sticky top-0 bg-white z-10 border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Fee Details: {selectedStudent.basicInfo?.name}
                </h2>
                <p className="text-gray-600">
                  Adm No: {selectedStudent.basicInfo?.admissionNo} • Grade {selectedStudent.basicInfo?.grade} - {selectedStudent.basicInfo?.section}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={28} />
              </button>
            </div>
            
            <div className="p-6">
              <FeesInstallment 
                student={selectedStudent} 
                onUpdateStudent={(updatedStudent) => {
                  onUpdateStudent(updatedStudent);
                  setSelectedStudent(updatedStudent);
                }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeesTab;
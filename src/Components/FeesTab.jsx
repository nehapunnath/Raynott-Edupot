// src/components/dashboard/components/FeesTab.jsx
import React, { useState, useMemo } from 'react';
import { Search, Filter, User, Calendar, DollarSign, CreditCard, X, Eye } from 'lucide-react';
import FeesInstallment from './FeesInstallment';

const FeesTab = ({ students, onUpdateStudent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showFeesModal, setShowFeesModal] = useState(false);

  // Get unique grades and sections for filters
  const grades = [...new Set(students.map(s => s.basicInfo?.grade).filter(Boolean))].sort();
  const sections = [...new Set(students.map(s => s.basicInfo?.section).filter(Boolean))].sort();

  // Filter students based on search criteria and fee status
  const filteredStudents = students.filter(student => {
    const pendingAmount = student.pendingAmount || 0;
    const totalFees = student.feeStructure?.total || 0;
    const paidAmount = student.totalPaid || 0;
    
    // Determine fee status
    let feeStatus = 'pending';
    if (pendingAmount === 0) feeStatus = 'paid';
    else if (paidAmount > 0) feeStatus = 'partial';
    else if (pendingAmount > 0 && paidAmount === 0) feeStatus = 'pending';
    
    const matchesSearch = !searchTerm || 
      student.basicInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.basicInfo?.admissionNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.basicInfo?.fatherName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGrade = !selectedGrade || student.basicInfo?.grade === selectedGrade;
    const matchesSection = !selectedSection || student.basicInfo?.section === selectedSection;
    const matchesStatus = !selectedStatus || feeStatus === selectedStatus;

    return matchesSearch && matchesGrade && matchesSection && matchesStatus;
  });

  // Calculate summary statistics
  const summary = useMemo(() => {
    const total = {
      totalFees: 0,
      totalPaid: 0,
      totalPending: 0,
      paidCount: 0,
      partialCount: 0,
      pendingCount: 0
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

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-gray-800">{students.length}</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <User className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Fees</p>
              <p className="text-3xl font-bold text-gray-800">₹{summary.totalFees.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-200 rounded-lg">
              <DollarSign className="text-purple-600" size={24} />
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
              <Calendar className="text-amber-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Filter Students by Fees</h3>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, admission no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Grade Filter */}
          <div>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">All Grades</option>
              {grades.map(grade => (
                <option key={grade} value={grade}>
                  Grade {grade}
                </option>
              ))}
            </select>
          </div>

          {/* Section Filter */}
          <div>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">All Sections</option>
              {sections.map(section => (
                <option key={section} value={section}>
                  Section {section}
                </option>
              ))}
            </select>
          </div>

          {/* Fee Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">All Fee Status</option>
              <option value="paid">Paid (No Dues)</option>
              <option value="partial">Partial Payment</option>
              <option value="pending">Pending (No Payment)</option>
            </select>
          </div>
        </div>

        {/* Status Summary Chips */}
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
            Paid: {summary.paidCount}
          </div>
          <div className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium">
            Partial: {summary.partialCount}
          </div>
          <div className="px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-medium">
            Pending: {summary.pendingCount}
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          Fee Details ({filteredStudents.length} students)
        </h3>
      </div>

      {/* Student Cards */}
      <div className="space-y-4">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <User className="text-gray-400" size={32} />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">No students found</h4>
            <p className="text-gray-600">
              {searchTerm || selectedGrade || selectedSection || selectedStatus
                ? "Try adjusting your filters"
                : "No students with fee records"}
            </p>
          </div>
        ) : (
          filteredStudents.map(student => (
            <div
              key={student.id || student.studentId}
              id={`fee-student-${student.studentId || student.id}`}
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
                        <span>Grade: {student.basicInfo?.grade || '—'} - {student.basicInfo?.section || '—'}</span>
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
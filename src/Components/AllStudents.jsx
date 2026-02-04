// src/components/dashboard/components/AllStudents.jsx
import React, { useState } from 'react';
import { Search, Filter, Download, User, Calendar, BookOpen, Hash, Phone } from 'lucide-react';
import StudentCard from './StudentCard';

const AllStudents = ({ students, onViewDetails, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Get unique grades and sections for filters
  const grades = [...new Set(students.map(s => s.basicInfo.grade))].sort();
  const sections = [...new Set(students.map(s => s.basicInfo.section))].sort();

  // Filter students based on search criteria
  const filteredStudents = students.filter(student => {
    const matchesSearch = !searchTerm || 
      student.basicInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.basicInfo.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.basicInfo.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.basicInfo.fatherPhone.includes(searchTerm);

    const matchesGrade = !selectedGrade || student.basicInfo.grade === selectedGrade;
    const matchesSection = !selectedSection || student.basicInfo.section === selectedSection;
    const matchesStatus = !selectedStatus || student.status === selectedStatus;

    return matchesSearch && matchesGrade && matchesSection && matchesStatus;
  });

  // Calculate summary statistics
  const totalStudents = students.length;
  const totalFees = students.reduce((sum, student) => sum + student.feeStructure.total, 0);
  const totalPaid = students.reduce((sum, student) => sum + student.totalPaid, 0);
  const totalPending = students.reduce((sum, student) => sum + student.pendingAmount, 0);
  const averageProgress = students.length > 0 
    ? Math.round((totalPaid / totalFees) * 100) 
    : 0;

  const handleDownloadAll = () => {
    const allStudentsData = students.map(student => ({
      name: student.basicInfo.name,
      admissionNo: student.basicInfo.admissionNo,
      grade: student.basicInfo.grade,
      section: student.basicInfo.section,
      fatherName: student.basicInfo.fatherName,
      phone: student.basicInfo.fatherPhone,
      totalFees: student.feeStructure.total,
      paidAmount: student.totalPaid,
      pendingAmount: student.pendingAmount,
      status: student.status
    }));

    const csvContent = [
      ['Name', 'Admission No', 'Grade', 'Section', 'Father Name', 'Phone', 'Total Fees', 'Paid Amount', 'Pending Amount', 'Status'],
      ...allStudentsData.map(student => [
        student.name,
        student.admissionNo,
        student.grade,
        student.section,
        student.fatherName,
        student.phone,
        student.totalFees,
        student.paidAmount,
        student.pendingAmount,
        student.status
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `all_students_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedGrade('');
    setSelectedSection('');
    setSelectedStatus('');
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-gray-800">{totalStudents}</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg">
              <User className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Fees</p>
              <p className="text-3xl font-bold text-gray-800">₹{totalFees.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg">
              <BookOpen className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Paid</p>
              <p className="text-3xl font-bold text-gray-800">₹{totalPaid.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-amber-200 rounded-lg">
              <Calendar className="text-amber-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Progress</p>
              <p className="text-3xl font-bold text-gray-800">{averageProgress}%</p>
            </div>
            <div className="relative w-12 h-12">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E9D5FF"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${averageProgress}, 100`}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Filter Students</h3>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="graduated">Graduated</option>
            </select>
          </div>

          {/* Download Button */}
          <button
            // onClick={handleDownloadAll}
            className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 flex items-center justify-center space-x-2"
          >
            <Download size={18} />
            <span>Export All</span>
          </button>
        </div>

        {/* Active Filters */}
        {(selectedGrade || selectedSection || selectedStatus) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedGrade && (
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center space-x-1">
                <span>Grade: {selectedGrade}</span>
                <button onClick={() => setSelectedGrade('')} className="ml-1">×</button>
              </span>
            )}
            {selectedSection && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center space-x-1">
                <span>Section: {selectedSection}</span>
                <button onClick={() => setSelectedSection('')} className="ml-1">×</button>
              </span>
            )}
            {selectedStatus && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center space-x-1">
                <span>Status: {selectedStatus}</span>
                <button onClick={() => setSelectedStatus('')} className="ml-1">×</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            All Students ({filteredStudents.length})
          </h3>
          <p className="text-sm text-gray-600">
            Showing {filteredStudents.length} of {totalStudents} students
          </p>
        </div>
        <div className="text-sm text-gray-600">
          Total Pending: <span className="font-bold text-red-600">₹{totalPending.toLocaleString()}</span>
        </div>
      </div>

      {/* Students List */}
      <div className="space-y-6">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <User className="text-gray-400" size={32} />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">No students found</h4>
            <p className="text-gray-600">
              {searchTerm || selectedGrade || selectedSection || selectedStatus
                ? "Try adjusting your filters or search term"
                : "No students have been added yet"}
            </p>
          </div>
        ) : (
          filteredStudents.map(student => (
            <StudentCard
              key={student.id}
              student={student}
              onViewDetails={() => onViewDetails(student)}
              onDelete={() => onDelete(student.id)}
            />
          ))
        )}
      </div>

      {/* Quick Stats Footer */}
      {filteredStudents.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">Average Fee per Student</div>
              <div className="text-lg font-bold text-gray-800">
                ₹{totalStudents > 0 ? Math.round(totalFees / totalStudents).toLocaleString() : 0}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Completion Rate</div>
              <div className="text-lg font-bold text-green-600">{averageProgress}%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Fully Paid</div>
              <div className="text-lg font-bold text-green-600">
                {students.filter(s => s.pendingAmount === 0).length}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">With Dues</div>
              <div className="text-lg font-bold text-red-600">
                {students.filter(s => s.pendingAmount > 0).length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllStudents;
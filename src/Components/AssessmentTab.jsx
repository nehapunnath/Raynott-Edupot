// src/components/dashboard/components/AssessmentTab.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, User, Plus, Edit2, Trash2, Save, X, 
  TrendingUp, BarChart3, Target, BookOpen, MessageSquare, 
  PenTool, Eye, Settings, ChevronDown, ChevronUp 
} from 'lucide-react';
import AssessmentModal from './AssessmentModal';
import StudentApi from '../service/StudentApi';
import { toast } from 'react-toastify';

const AssessmentTab = ({ students, onUpdateStudent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedStudent, setExpandedStudent] = useState(null);

  // Get unique grades and sections for filters
  const grades = [...new Set(students.map(s => s.basicInfo?.grade).filter(Boolean))].sort();
  const sections = [...new Set(students.map(s => s.basicInfo?.section).filter(Boolean))].sort();

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = !searchTerm || 
      student.basicInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.basicInfo?.admissionNo?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGrade = !selectedGrade || student.basicInfo?.grade === selectedGrade;
    const matchesSection = !selectedSection || student.basicInfo?.section === selectedSection;

    return matchesSearch && matchesGrade && matchesSection;
  });

  const handleViewAssessments = (student) => {
    setSelectedStudent(student);
    setShowAssessmentModal(true);
  };

  const handleCloseModal = () => {
    setShowAssessmentModal(false);
    setSelectedStudent(null);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedGrade('');
    setSelectedSection('');
  };

  const toggleExpand = (studentId) => {
    if (expandedStudent === studentId) {
      setExpandedStudent(null);
    } else {
      setExpandedStudent(studentId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center space-x-3 mb-4">
          <BarChart3 className="text-purple-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">Student Assessment Reports</h2>
        </div>
        <p className="text-gray-600">
          Track and manage student assessments across various categories like Reading, Writing, 
          Communication, Baseline Performance, and custom assessment types.
        </p>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, admission no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Grade Filter */}
          <div>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Sections</option>
              {sections.map(section => (
                <option key={section} value={section}>
                  Section {section}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          Students ({filteredStudents.length})
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
              {searchTerm || selectedGrade || selectedSection
                ? "Try adjusting your filters"
                : "No students available"}
            </p>
          </div>
        ) : (
          filteredStudents.map(student => (
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
                      <h3 className="font-semibold text-gray-900">
                        {student.basicInfo?.name || 'Unnamed'}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 mt-1">
                        <span>Adm: {student.basicInfo?.admissionNo || '—'}</span>
                        <span>Grade: {student.basicInfo?.grade || '—'} - {student.basicInfo?.section || '—'}</span>
                      </div>
                    </div>
                  </div>

                  {/* <button
                    onClick={() => handleViewAssessments(student)}
                    className="p-4 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                  >
                    <Eye size={18} />
                    <span>View Assessments</span>
                  </button> */}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Assessment Modal */}
      {showAssessmentModal && selectedStudent && (
        <AssessmentModal
          student={selectedStudent}
          onClose={handleCloseModal}
          onUpdateStudent={onUpdateStudent}
        />
      )}
    </div>
  );
};

export default AssessmentTab;
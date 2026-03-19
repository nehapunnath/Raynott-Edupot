// src/components/dashboard/components/MarksTab.jsx
import React, { useState, useMemo } from 'react';
import { Search, User, Award, Calendar, BookOpen, TrendingUp, Eye, X } from 'lucide-react';
import Marks from './Marks';

const MarksTab = ({ students, onUpdateStudent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedPerformance, setSelectedPerformance] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showMarksModal, setShowMarksModal] = useState(false);

  // Get unique grades and sections for filters
  const grades = [...new Set(students.map(s => s.basicInfo?.grade).filter(Boolean))].sort();
  const sections = [...new Set(students.map(s => s.basicInfo?.section).filter(Boolean))].sort();

  // Calculate performance summary for each student
  const studentsWithPerformance = useMemo(() => {
    return students.map(student => {
      const marks = student.marks || {};
      const exams = marks.exams || [];
      
      // Calculate overall performance
      let totalPercentage = 0;
      let examCount = exams.length;
      
      if (examCount > 0) {
        totalPercentage = exams.reduce((sum, exam) => sum + (exam.percentage || 0), 0);
      }

      const averagePercentage = examCount > 0 ? totalPercentage / examCount : 0;
      
      // Determine performance grade
      let performanceGrade = 'N/A';
      let performanceColor = 'gray';
      
      if (averagePercentage >= 90) {
        performanceGrade = 'A+';
        performanceColor = 'green';
      } else if (averagePercentage >= 80) {
        performanceGrade = 'A';
        performanceColor = 'blue';
      } else if (averagePercentage >= 70) {
        performanceGrade = 'B+';
        performanceColor = 'amber';
      } else if (averagePercentage >= 60) {
        performanceGrade = 'B';
        performanceColor = 'yellow';
      } else if (averagePercentage >= 50) {
        performanceGrade = 'C';
        performanceColor = 'purple';
      } else if (averagePercentage >= 40) {
        performanceGrade = 'D';
        performanceColor = 'orange';
      } else if (averagePercentage > 0) {
        performanceGrade = 'F';
        performanceColor = 'red';
      }

      return {
        ...student,
        performance: {
          averagePercentage: Math.round(averagePercentage * 10) / 10,
          examCount,
          totalMarks: marks.totalMarks || 0,
          grade: performanceGrade,
          color: performanceColor,
          lastExamDate: exams.length > 0 
            ? exams.sort((a, b) => new Date(b.examDate) - new Date(a.examDate))[0]?.examDate 
            : null
        }
      };
    });
  }, [students]);

  // Filter students based on search criteria and performance
  const filteredStudents = studentsWithPerformance.filter(student => {
    const matchesSearch = !searchTerm || 
      student.basicInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.basicInfo?.admissionNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.basicInfo?.fatherName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGrade = !selectedGrade || student.basicInfo?.grade === selectedGrade;
    const matchesSection = !selectedSection || student.basicInfo?.section === selectedSection;
    
    // Performance filter
    let matchesPerformance = true;
    if (selectedPerformance) {
      const avg = student.performance.averagePercentage;
      if (selectedPerformance === 'excellent') matchesPerformance = avg >= 90;
      else if (selectedPerformance === 'good') matchesPerformance = avg >= 75 && avg < 90;
      else if (selectedPerformance === 'average') matchesPerformance = avg >= 60 && avg < 75;
      else if (selectedPerformance === 'below-average') matchesPerformance = avg >= 40 && avg < 60;
      else if (selectedPerformance === 'poor') matchesPerformance = avg > 0 && avg < 40;
      else if (selectedPerformance === 'no-exams') matchesPerformance = student.performance.examCount === 0;
    }

    return matchesSearch && matchesGrade && matchesSection && matchesPerformance;
  });

  // Calculate summary statistics
  const summary = useMemo(() => {
    const total = {
      totalStudents: students.length,
      studentsWithMarks: 0,
      totalExams: 0,
      averagePerformance: 0,
      excellentCount: 0,
      goodCount: 0,
      averageCount: 0,
      belowAverageCount: 0,
      poorCount: 0,
      noExamsCount: 0
    };

    studentsWithPerformance.forEach(student => {
      if (student.performance.examCount > 0) {
        total.studentsWithMarks++;
        total.totalExams += student.performance.examCount;
        
        const avg = student.performance.averagePercentage;
        if (avg >= 90) total.excellentCount++;
        else if (avg >= 75) total.goodCount++;
        else if (avg >= 60) total.averageCount++;
        else if (avg >= 40) total.belowAverageCount++;
        else if (avg > 0) total.poorCount++;
      } else {
        total.noExamsCount++;
      }
    });

    total.averagePerformance = total.studentsWithMarks > 0 
      ? Math.round((studentsWithPerformance.reduce((sum, s) => sum + (s.performance.averagePercentage || 0), 0) / studentsWithPerformance.length) * 10) / 10
      : 0;

    return total;
  }, [studentsWithPerformance]);

  const handleViewMarks = (student) => {
    setSelectedStudent(student);
    setShowMarksModal(true);
  };

  const handleCloseModal = () => {
    setShowMarksModal(false);
    setSelectedStudent(null);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedGrade('');
    setSelectedSection('');
    setSelectedPerformance('');
  };

  const getPerformanceColor = (performance) => {
    const colors = {
      green: 'bg-green-100 text-green-800 border-green-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      amber: 'bg-amber-100 text-amber-800 border-amber-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[performance.color] || colors.gray;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-2xl font-bold text-gray-800">{summary.totalStudents}</p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <p className="text-sm text-gray-600">With Marks</p>
          <p className="text-2xl font-bold text-green-700">{summary.studentsWithMarks}</p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
          <p className="text-sm text-gray-600">Total Exams</p>
          <p className="text-2xl font-bold text-purple-700">{summary.totalExams}</p>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
          <p className="text-sm text-gray-600">Avg Performance</p>
          <p className="text-2xl font-bold text-amber-700">{summary.averagePerformance}%</p>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
          <p className="text-sm text-gray-600">Excellent (90%+)</p>
          <p className="text-2xl font-bold text-emerald-700">{summary.excellentCount}</p>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
          <p className="text-sm text-gray-600">No Exams</p>
          <p className="text-2xl font-bold text-red-700">{summary.noExamsCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Filter Students by Performance</h3>
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
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Grade Filter */}
          <div>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Sections</option>
              {sections.map(section => (
                <option key={section} value={section}>
                  Section {section}
                </option>
              ))}
            </select>
          </div>

          {/* Performance Filter */}
          <div>
            <select
              value={selectedPerformance}
              onChange={(e) => setSelectedPerformance(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Performance</option>
              <option value="excellent">Excellent (90%+)</option>
              <option value="good">Good (75-90%)</option>
              <option value="average">Average (60-75%)</option>
              <option value="below-average">Below Average (40-60%)</option>
              <option value="poor">Poor (&lt;40%)</option>
              <option value="no-exams">No Exams Yet</option>
            </select>
          </div>
        </div>

        {/* Performance Summary Chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            Excellent: {summary.excellentCount}
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            Good: {summary.goodCount}
          </span>
          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
            Average: {summary.averageCount}
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
            Below Avg: {summary.belowAverageCount}
          </span>
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
            Poor: {summary.poorCount}
          </span>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          Academic Performance ({filteredStudents.length} students)
        </h3>
      </div>

      {/* Student Cards */}
      <div className="space-y-4">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Award className="text-gray-400" size={32} />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">No students found</h4>
            <p className="text-gray-600">
              {searchTerm || selectedGrade || selectedSection || selectedPerformance
                ? "Try adjusting your filters"
                : "No students with academic records"}
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
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900">
                          {student.basicInfo?.name || 'Unnamed'}
                        </h3>
                        {student.performance.examCount > 0 ? (
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPerformanceColor(student.performance)}`}>
                            {student.performance.grade} • {student.performance.averagePercentage}%
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs font-medium rounded-full border bg-gray-100 text-gray-800 border-gray-200">
                            No Exams
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 mt-2">
                        <span>Adm: {student.basicInfo?.admissionNo || '—'}</span>
                        <span>Grade: {student.basicInfo?.grade || '—'} - {student.basicInfo?.section || '—'}</span>
                        <span>Exams: {student.performance.examCount}</span>
                        {student.performance.lastExamDate && (
                          <span className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            Last: {student.performance.lastExamDate}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Performance Bar */}
                    {student.performance.examCount > 0 && (
                      <div className="hidden md:block w-48">
                        <div className="text-xs text-gray-600 mb-1">Average Performance</div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${student.performance.averagePercentage}%`,
                              backgroundColor: 
                                student.performance.averagePercentage >= 90 ? '#059669' :
                                student.performance.averagePercentage >= 75 ? '#2563eb' :
                                student.performance.averagePercentage >= 60 ? '#d97706' :
                                student.performance.averagePercentage >= 40 ? '#7c3aed' : '#dc2626'
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span className="text-gray-600">0%</span>
                          <span className="text-gray-600">100%</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleViewMarks(student)}
                    className="p-4 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                  >
                    <Eye size={18} />
                    <span>View Marks</span>
                  </button>
                </div>

                {/* Mobile Summary */}
                <div className="mt-4 md:hidden border-t pt-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-600">Exams</p>
                      <p className="font-semibold">{student.performance.examCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Average</p>
                      <p className="font-semibold text-blue-600">
                        {student.performance.averagePercentage || 0}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Grade</p>
                      <p className="font-semibold">{student.performance.grade}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Marks Modal */}
      {showMarksModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-y-auto relative">
            <div className="sticky top-0 bg-white z-10 border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Academic Marks: {selectedStudent.basicInfo?.name}
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
              <Marks 
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

export default MarksTab;
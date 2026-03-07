import React, { useState } from 'react';
import { Award, Plus, Trash2, Save, X, Calendar, BookOpen, Edit2, Check } from 'lucide-react';
import StudentApi from '../service/StudentApi';
import { toast } from 'react-toastify';

const Marks = ({ student, onUpdateStudent }) => {
  const [loading, setLoading] = useState(false);
  const [showAddExam, setShowAddExam] = useState(false);
  const [editingExamId, setEditingExamId] = useState(null);
  const [editedExam, setEditedExam] = useState(null);
  const [newExam, setNewExam] = useState({
    examType: '',
    examDate: new Date().toISOString().split('T')[0],
    subjects: [{ name: '', marks: '', total: '', grade: '' }]
  });

  // Calculate grade based on marks and total
  const calculateGrade = (marks, total) => {
    if (!marks || !total) return '';
    const percentage = (parseFloat(marks) / parseFloat(total)) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  };

  // Add new subject field to the exam
  const addSubjectField = (isEditing = false) => {
    if (isEditing) {
      setEditedExam({
        ...editedExam,
        subjects: [...editedExam.subjects, { name: '', marks: '', total: '', grade: '' }]
      });
    } else {
      setNewExam({
        ...newExam,
        subjects: [...newExam.subjects, { name: '', marks: '', total: '', grade: '' }]
      });
    }
  };

  // Remove subject field
  const removeSubjectField = (index, isEditing = false) => {
    if (isEditing) {
      const updatedSubjects = editedExam.subjects.filter((_, i) => i !== index);
      setEditedExam({
        ...editedExam,
        subjects: updatedSubjects
      });
    } else {
      const updatedSubjects = newExam.subjects.filter((_, i) => i !== index);
      setNewExam({
        ...newExam,
        subjects: updatedSubjects
      });
    }
  };

  // Update subject field
  const updateSubjectField = (index, field, value, isEditing = false) => {
    if (isEditing) {
      const updatedSubjects = [...editedExam.subjects];
      updatedSubjects[index] = {
        ...updatedSubjects[index],
        [field]: value
      };

      // Auto-calculate grade when marks or total changes
      if (field === 'marks' || field === 'total') {
        const marks = field === 'marks' ? value : updatedSubjects[index].marks;
        const total = field === 'total' ? value : updatedSubjects[index].total;
        updatedSubjects[index].grade = calculateGrade(marks, total);
      }

      setEditedExam({
        ...editedExam,
        subjects: updatedSubjects
      });
    } else {
      const updatedSubjects = [...newExam.subjects];
      updatedSubjects[index] = {
        ...updatedSubjects[index],
        [field]: value
      };

      // Auto-calculate grade when marks or total changes
      if (field === 'marks' || field === 'total') {
        const marks = field === 'marks' ? value : updatedSubjects[index].marks;
        const total = field === 'total' ? value : updatedSubjects[index].total;
        updatedSubjects[index].grade = calculateGrade(marks, total);
      }

      setNewExam({
        ...newExam,
        subjects: updatedSubjects
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setNewExam({
      examType: '',
      examDate: new Date().toISOString().split('T')[0],
      subjects: [{ name: '', marks: '', total: '', grade: '' }]
    });
    setShowAddExam(false);
    setEditingExamId(null);
    setEditedExam(null);
  };

  // Start editing exam
  const handleEditExam = (exam) => {
    setEditingExamId(exam.id);
    setEditedExam(JSON.parse(JSON.stringify(exam))); // Deep clone
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingExamId(null);
    setEditedExam(null);
  };

  // Save edited exam
  const handleSaveEdit = async () => {
    if (!editedExam) return;

    // Validate subjects
    const validSubjects = editedExam.subjects.filter(
      s => s.name.trim() && s.marks && s.total
    );

    if (validSubjects.length === 0) {
      toast.error('Please add at least one subject with marks');
      return;
    }

    setLoading(true);
    try {
      // Prepare subjects with proper numeric values
      const subjects = validSubjects.map(s => ({
        name: s.name.trim(),
        marks: parseFloat(s.marks) || 0,
        total: parseFloat(s.total) || 0,
        grade: calculateGrade(s.marks, s.total)
      }));

      // Calculate exam totals
      const totalMarks = subjects.reduce((sum, s) => sum + s.marks, 0);
      const totalPossible = subjects.reduce((sum, s) => sum + s.total, 0);
      const percentage = totalPossible > 0 ? (totalMarks / totalPossible) * 100 : 0;
      const overallGrade = calculateGrade(totalMarks, totalPossible);

      const updatedExamData = {
        ...editedExam,
        subjects: subjects,
        totalMarks: totalMarks,
        percentage: Math.round(percentage * 10) / 10,
        overallGrade: overallGrade
      };

      // Update the exams array
      const updatedExams = student.marks.exams.map(exam => 
        exam.id === editingExamId ? updatedExamData : exam
      );

      // Recalculate all exams average
      const allExamsTotal = updatedExams.reduce((sum, e) => sum + e.totalMarks, 0);
      const allExamsPossible = updatedExams.reduce((sum, e) => 
        sum + e.subjects.reduce((subSum, sub) => subSum + sub.total, 0), 0);
      
      const averagePercentage = allExamsPossible > 0 
        ? (allExamsTotal / allExamsPossible) * 100 
        : 0;

      const updatedStudent = {
        ...student,
        marks: {
          ...student.marks,
          exams: updatedExams,
          totalMarks: allExamsTotal,
          averagePercentage: Math.round(averagePercentage * 10) / 10,
          overallGrade: calculateGrade(allExamsTotal, allExamsPossible)
        }
      };

      // Update via API
      const result = await StudentApi.updateMarks(student.studentId, updatedStudent.marks);
      
      if (result.success) {
        onUpdateStudent(updatedStudent);
        toast.success('Exam updated successfully');
        handleCancelEdit();
      } else {
        toast.error(result.error || 'Failed to update exam');
      }
    } catch (error) {
      console.error('Update exam error:', error);
      toast.error('Failed to update exam');
    } finally {
      setLoading(false);
    }
  };

  // Add new exam
  const handleAddExam = async () => {
    // Validate exam type
    if (!newExam.examType.trim()) {
      toast.error('Please enter exam type');
      return;
    }

    // Validate subjects
    const validSubjects = newExam.subjects.filter(
      s => s.name.trim() && s.marks && s.total
    );

    if (validSubjects.length === 0) {
      toast.error('Please add at least one subject with marks');
      return;
    }

    setLoading(true);
    try {
      // Prepare subjects with proper numeric values
      const subjects = validSubjects.map(s => ({
        name: s.name.trim(),
        marks: parseFloat(s.marks) || 0,
        total: parseFloat(s.total) || 0,
        grade: calculateGrade(s.marks, s.total)
      }));

      // Calculate exam totals
      const totalMarks = subjects.reduce((sum, s) => sum + s.marks, 0);
      const totalPossible = subjects.reduce((sum, s) => sum + s.total, 0);
      const percentage = totalPossible > 0 ? (totalMarks / totalPossible) * 100 : 0;
      const overallGrade = calculateGrade(totalMarks, totalPossible);

      const examData = {
        examType: newExam.examType.trim(),
        examDate: newExam.examDate,
        subjects: subjects,
        totalMarks: totalMarks,
        percentage: Math.round(percentage * 10) / 10,
        overallGrade: overallGrade
      };

      const result = await StudentApi.addExam(student.studentId, examData);

      if (result.success) {
        // Update local student data
        const updatedStudent = {
          ...student,
          marks: {
            ...student.marks,
            exams: [...(student.marks?.exams || []), result.exam]
          }
        };
        onUpdateStudent(updatedStudent);
        toast.success('Exam added successfully');
        resetForm();
      } else {
        toast.error(result.error || 'Failed to add exam');
      }
    } catch (error) {
      console.error('Add exam error:', error);
      toast.error('Failed to add exam');
    } finally {
      setLoading(false);
    }
  };

  // Delete exam
  const handleDeleteExam = async (examId) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) return;

    setLoading(true);
    try {
      const result = await StudentApi.deleteExam(student.studentId, examId);

      if (result.success) {
        const updatedExams = student.marks.exams.filter(exam => exam.id !== examId);
        
        // Recalculate overall marks
        const allExamsTotal = updatedExams.reduce((sum, exam) => sum + exam.totalMarks, 0);
        const allExamsPossible = updatedExams.reduce((sum, exam) => 
          sum + exam.subjects.reduce((subSum, sub) => subSum + sub.total, 0), 0);
        
        const averagePercentage = allExamsPossible > 0 
          ? (allExamsTotal / allExamsPossible) * 100 
          : 0;

        const updatedStudent = {
          ...student,
          marks: {
            ...student.marks,
            exams: updatedExams,
            totalMarks: allExamsTotal,
            averagePercentage: Math.round(averagePercentage * 10) / 10,
            overallGrade: calculateGrade(allExamsTotal, allExamsPossible)
          }
        };
        
        onUpdateStudent(updatedStudent);
        toast.success('Exam deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete exam');
      }
    } catch (error) {
      console.error('Delete exam error:', error);
      toast.error('Failed to delete exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Exam Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700">Academic Marks</h3>
        <button
          onClick={() => setShowAddExam(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm hover:from-blue-700 hover:to-blue-800 flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add New Exam</span>
        </button>
      </div>

      {/* Add Exam Form */}
      {showAddExam && (
        <div className="bg-white border-2 border-blue-200 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-800">Add New Exam</h4>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Exam Type and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Type *
                </label>
                <input
                  type="text"
                  value={newExam.examType}
                  onChange={(e) => setNewExam({ ...newExam, examType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Half Yearly Exam, Final Exam, Unit Test"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Date
                </label>
                <input
                  type="date"
                  value={newExam.examDate}
                  onChange={(e) => setNewExam({ ...newExam, examDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Subjects Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Subjects and Marks *
                </label>
                <button
                  onClick={() => addSubjectField(false)}
                  className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center space-x-1"
                >
                  <Plus size={14} />
                  <span>Add Subject</span>
                </button>
              </div>

              {/* Subject Headers */}
              <div className="grid grid-cols-12 gap-3 mb-2 text-xs font-medium text-gray-600">
                <div className="col-span-4">Subject Name</div>
                <div className="col-span-2">Marks</div>
                <div className="col-span-2">Total</div>
                <div className="col-span-2">Grade</div>
                <div className="col-span-2"></div>
              </div>

              {/* Subject Fields */}
              {newExam.subjects.map((subject, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 mb-3">
                  <div className="col-span-4">
                    <input
                      type="text"
                      value={subject.name}
                      onChange={(e) => updateSubjectField(index, 'name', e.target.value, false)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Subject name"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={subject.marks}
                      onChange={(e) => updateSubjectField(index, 'marks', e.target.value, false)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Marks"
                      min="0"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={subject.total}
                      onChange={(e) => updateSubjectField(index, 'total', e.target.value, false)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Total"
                      min="1"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={subject.grade}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg"
                      placeholder="Grade"
                      readOnly
                    />
                  </div>
                  <div className="col-span-2 flex items-center">
                    {newExam.subjects.length > 1 && (
                      <button
                        onClick={() => removeSubjectField(index, false)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExam}
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Exam</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Display Existing Exams */}
      {(!student.marks?.exams || student.marks.exams.length === 0) && !showAddExam ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No exams added yet</p>
          <p className="text-sm text-gray-500 mb-4">Add exams to track academic performance</p>
          <button
            onClick={() => setShowAddExam(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add First Exam
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {student.marks?.exams?.map((exam) => (
            <div key={exam.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              {/* Exam Header */}
              <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-200">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">{exam.examType}</h4>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {exam.examDate}
                    </span>
                    <span className="flex items-center">
                      <BookOpen size={14} className="mr-1" />
                      {exam.subjects.length} Subjects
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Total Marks</div>
                    <div className="text-xl font-bold text-blue-600">{exam.totalMarks}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Percentage</div>
                    <div className="text-lg font-semibold text-green-600">{exam.percentage}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Grade</div>
                    <div className="text-xl font-bold" style={{ 
                      color: exam.overallGrade === 'A+' ? '#059669' :
                             exam.overallGrade === 'A' ? '#2563eb' :
                             exam.overallGrade === 'B+' ? '#d97706' :
                             exam.overallGrade === 'B' ? '#ca8a04' :
                             exam.overallGrade === 'C' ? '#7c3aed' :
                             exam.overallGrade === 'D' ? '#dc2626' : '#991b1b'
                    }}>
                      {exam.overallGrade}
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditExam(exam)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit exam"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteExam(exam.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete exam"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Edit Mode */}
              {editingExamId === exam.id && editedExam ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Exam Type *
                      </label>
                      <input
                        type="text"
                        value={editedExam.examType}
                        onChange={(e) => setEditedExam({ ...editedExam, examType: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Exam Date
                      </label>
                      <input
                        type="date"
                        value={editedExam.examDate}
                        onChange={(e) => setEditedExam({ ...editedExam, examDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Subjects Section for Editing */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Subjects and Marks *
                      </label>
                      <button
                        onClick={() => addSubjectField(true)}
                        className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center space-x-1"
                      >
                        <Plus size={14} />
                        <span>Add Subject</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-12 gap-3 mb-2 text-xs font-medium text-gray-600">
                      <div className="col-span-4">Subject Name</div>
                      <div className="col-span-2">Marks</div>
                      <div className="col-span-2">Total</div>
                      <div className="col-span-2">Grade</div>
                      <div className="col-span-2"></div>
                    </div>

                    {editedExam.subjects.map((subject, index) => (
                      <div key={index} className="grid grid-cols-12 gap-3 mb-3">
                        <div className="col-span-4">
                          <input
                            type="text"
                            value={subject.name}
                            onChange={(e) => updateSubjectField(index, 'name', e.target.value, true)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Subject name"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            value={subject.marks}
                            onChange={(e) => updateSubjectField(index, 'marks', e.target.value, true)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Marks"
                            min="0"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="number"
                            value={subject.total}
                            onChange={(e) => updateSubjectField(index, 'total', e.target.value, true)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            placeholder="Total"
                            min="1"
                          />
                        </div>
                        <div className="col-span-2">
                          <input
                            type="text"
                            value={subject.grade}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg"
                            placeholder="Grade"
                            readOnly
                          />
                        </div>
                        <div className="col-span-2 flex items-center">
                          {editedExam.subjects.length > 1 && (
                            <button
                              onClick={() => removeSubjectField(index, true)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Edit Actions */}
                  <div className="flex justify-end space-x-3 mt-4">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      disabled={loading}
                      className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 flex items-center space-x-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode - Subjects Table */
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs text-gray-600 border-b border-gray-200">
                        <th className="text-left py-2">Subject</th>
                        <th className="text-center py-2">Marks Obtained</th>
                        <th className="text-center py-2">Total Marks</th>
                        <th className="text-center py-2">Percentage</th>
                        <th className="text-center py-2">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exam.subjects.map((subject, idx) => (
                        <tr key={idx} className="border-b border-gray-100">
                          <td className="py-3 font-medium text-gray-700">{subject.name}</td>
                          <td className="py-3 text-center">{subject.marks}</td>
                          <td className="py-3 text-center">{subject.total}</td>
                          <td className="py-3 text-center text-gray-600">
                            {subject.total > 0 
                              ? Math.round((subject.marks / subject.total) * 100) 
                              : 0}%
                          </td>
                          <td className="py-3 text-center">
                            <span 
                              className="px-3 py-1 rounded-full text-sm font-medium text-white"
                              style={{ 
                                backgroundColor: subject.grade === 'A+' ? '#059669' :
                                               subject.grade === 'A' ? '#2563eb' :
                                               subject.grade === 'B+' ? '#d97706' :
                                               subject.grade === 'B' ? '#ca8a04' :
                                               subject.grade === 'C' ? '#7c3aed' :
                                               subject.grade === 'D' ? '#dc2626' : '#991b1b'
                              }}
                            >
                              {subject.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marks;
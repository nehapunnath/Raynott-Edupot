import React, { useState } from 'react';
import { Award, Plus, Trash2, Settings, Edit2, Check, X } from 'lucide-react';

const Marks = ({ student, onUpdateStudent }) => {
  const [editingConfig, setEditingConfig] = useState(false);
  const [config, setConfig] = useState({
    subjects: student.marks?.subjects || ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi'],
    examTypes: student.marks?.examTypes || ['Unit Test 1', 'Unit Test 2', 'Half Yearly', 'Quarterly', 'Final Exam', 'Pre-Board'],
    gradingScale: student.marks?.gradingScale || [
      { min: 90, grade: 'A+', color: '#059669' },
      { min: 80, grade: 'A', color: '#2563eb' },
      { min: 70, grade: 'B+', color: '#d97706' },
      { min: 60, grade: 'B', color: '#ca8a04' },
      { min: 50, grade: 'C', color: '#7c3aed' },
      { min: 40, grade: 'D', color: '#dc2626' },
      { min: 0, grade: 'F', color: '#991b1b' }
    ],
    maxMarks: student.marks?.maxMarks || 100
  });

  const calculateGrade = (marks, total = config.maxMarks) => {
    const percentage = (marks / total) * 100;
    const gradeEntry = config.gradingScale.find(scale => percentage >= scale.min);
    return gradeEntry ? gradeEntry.grade : 'F';
  };

  const getGradeColor = (grade) => {
    const gradeEntry = config.gradingScale.find(scale => scale.grade === grade);
    return gradeEntry ? gradeEntry.color : '#dc2626';
  };

  const saveConfig = () => {
    const updatedStudent = {
      ...student,
      marks: {
        ...student.marks,
        subjects: config.subjects,
        examTypes: config.examTypes,
        gradingScale: config.gradingScale,
        maxMarks: config.maxMarks
      }
    };
    onUpdateStudent(updatedStudent);
    setEditingConfig(false);
  };

  const addSubject = () => {
    const newSubject = prompt('Enter new subject name:');
    if (newSubject && newSubject.trim()) {
      setConfig({
        ...config,
        subjects: [...config.subjects, newSubject.trim()]
      });
    }
  };

  const removeSubject = (index) => {
    const newSubjects = config.subjects.filter((_, i) => i !== index);
    setConfig({ ...config, subjects: newSubjects });
  };

  const addExamType = () => {
    const newExamType = prompt('Enter new exam type:');
    if (newExamType && newExamType.trim()) {
      setConfig({
        ...config,
        examTypes: [...config.examTypes, newExamType.trim()]
      });
    }
  };

  const removeExamType = (index) => {
    const newExamTypes = config.examTypes.filter((_, i) => i !== index);
    setConfig({ ...config, examTypes: newExamTypes });
  };

  const addGrade = () => {
    const newGrade = prompt('Enter new grade (e.g., A++):');
    const minScore = prompt('Enter minimum percentage for this grade:');
    const color = prompt('Enter color for this grade (hex code):', '#000000');
    
    if (newGrade && minScore && color) {
      setConfig({
        ...config,
        gradingScale: [
          ...config.gradingScale,
          { min: parseInt(minScore), grade: newGrade, color }
        ].sort((a, b) => b.min - a.min) // Sort descending
      });
    }
  };

  const removeGrade = (index) => {
    const newScale = config.gradingScale.filter((_, i) => i !== index);
    setConfig({ ...config, gradingScale: newScale });
  };

  const addExam = () => {
    const newExamId = student.marks?.exams?.length || 0;
    
    const initialSubjects = config.subjects.map(subject => ({
      name: subject,
      marks: 0,
      total: config.maxMarks,
      grade: ''
    }));

    const updatedStudent = {
      ...student,
      marks: {
        ...student.marks,
        ...config,
        exams: [
          ...(student.marks?.exams || []),
          {
            id: Date.now(),
            examType: config.examTypes[0] || 'Exam 1',
            examDate: new Date().toISOString().split('T')[0],
            subjects: initialSubjects,
            totalMarks: 0,
            percentage: 0,
            overallGrade: ''
          }
        ]
      }
    };

    onUpdateStudent(updatedStudent);
  };

  const updateExamMarks = (examId, subjectIndex, marks) => {
    const marksValue = parseInt(marks) || 0;
    const updatedExams = student.marks.exams.map(exam => {
      if (exam.id === examId) {
        const updatedSubjects = [...exam.subjects];
        updatedSubjects[subjectIndex] = {
          ...updatedSubjects[subjectIndex],
          marks: marksValue,
          grade: calculateGrade(marksValue, updatedSubjects[subjectIndex].total)
        };

        const totalMarks = updatedSubjects.reduce((sum, sub) => sum + (sub.marks || 0), 0);
        const totalPossibleMarks = updatedSubjects.reduce((sum, sub) => sum + (sub.total || config.maxMarks), 0);
        const percentage = totalPossibleMarks > 0 ? (totalMarks / totalPossibleMarks) * 100 : 0;
        const overallGrade = calculateGrade(totalMarks, totalPossibleMarks);

        return {
          ...exam,
          subjects: updatedSubjects,
          totalMarks,
          percentage: Math.round(percentage * 10) / 10,
          overallGrade
        };
      }
      return exam;
    });

    // Update overall marks
    const allExamsTotal = updatedExams.reduce((sum, exam) => sum + exam.totalMarks, 0);
    const allExamsPossibleTotal = updatedExams.reduce((sum, exam) => 
      sum + exam.subjects.reduce((subSum, sub) => subSum + sub.total, 0), 0);
    
    const allExamsAverage = allExamsPossibleTotal > 0 
      ? (allExamsTotal / allExamsPossibleTotal) * 100 
      : 0;

    const updatedStudent = {
      ...student,
      marks: {
        ...student.marks,
        ...config,
        exams: updatedExams,
        totalMarks: allExamsTotal,
        averagePercentage: Math.round(allExamsAverage * 10) / 10,
        overallGrade: calculateGrade(allExamsTotal, allExamsPossibleTotal)
      }
    };

    onUpdateStudent(updatedStudent);
  };

  const deleteExam = (examId) => {
    const updatedExams = student.marks.exams.filter(exam => exam.id !== examId);
    
    // Update overall marks
    const allExamsTotal = updatedExams.reduce((sum, exam) => sum + exam.totalMarks, 0);
    const allExamsPossibleTotal = updatedExams.reduce((sum, exam) => 
      sum + exam.subjects.reduce((subSum, sub) => subSum + sub.total, 0), 0);
    
    const allExamsAverage = allExamsPossibleTotal > 0 
      ? (allExamsTotal / allExamsPossibleTotal) * 100 
      : 0;

    const updatedStudent = {
      ...student,
      marks: {
        ...student.marks,
        ...config,
        exams: updatedExams,
        totalMarks: allExamsTotal,
        averagePercentage: Math.round(allExamsAverage * 10) / 10,
        overallGrade: calculateGrade(allExamsTotal, allExamsPossibleTotal)
      }
    };

    onUpdateStudent(updatedStudent);
  };

  const updateSubjectTotal = (examId, subjectIndex, total) => {
    const totalValue = parseInt(total) || config.maxMarks;
    const updatedExams = student.marks.exams.map(exam => {
      if (exam.id === examId) {
        const updatedSubjects = [...exam.subjects];
        const currentMarks = updatedSubjects[subjectIndex].marks;
        updatedSubjects[subjectIndex] = {
          ...updatedSubjects[subjectIndex],
          total: totalValue,
          grade: calculateGrade(currentMarks, totalValue)
        };

        // Recalculate exam totals
        const totalMarks = updatedSubjects.reduce((sum, sub) => sum + sub.marks, 0);
        const totalPossibleMarks = updatedSubjects.reduce((sum, sub) => sum + sub.total, 0);
        const percentage = totalPossibleMarks > 0 ? (totalMarks / totalPossibleMarks) * 100 : 0;
        const overallGrade = calculateGrade(totalMarks, totalPossibleMarks);

        return {
          ...exam,
          subjects: updatedSubjects,
          totalMarks,
          percentage: Math.round(percentage * 10) / 10,
          overallGrade
        };
      }
      return exam;
    });

    const updatedStudent = {
      ...student,
      marks: {
        ...student.marks,
        ...config,
        exams: updatedExams
      }
    };
    onUpdateStudent(updatedStudent);
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Academic Marks</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setEditingConfig(!editingConfig)}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 flex items-center space-x-2"
            >
              <Settings size={16} />
              <span>Configure</span>
            </button>
            <button
              onClick={addExam}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm hover:from-blue-700 hover:to-blue-800 flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Add Exam</span>
            </button>
          </div>
        </div>

        {/* Configuration Panel */}
        {editingConfig && (
          <div className="mb-6 p-4 bg-white border border-gray-300 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-gray-800">Configuration</h4>
              <div className="flex space-x-2">
                <button
                  onClick={saveConfig}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center space-x-1"
                >
                  <Check size={16} />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => {
                    setConfig({
                      subjects: student.marks?.subjects || config.subjects,
                      examTypes: student.marks?.examTypes || config.examTypes,
                      gradingScale: student.marks?.gradingScale || config.gradingScale,
                      maxMarks: student.marks?.maxMarks || config.maxMarks
                    });
                    setEditingConfig(false);
                  }}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 flex items-center space-x-1"
                >
                  <X size={16} />
                  <span>Cancel</span>
                </button>
              </div>
            </div>

            {/* Subjects Configuration */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Subjects</label>
                <button
                  onClick={addSubject}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  + Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {config.subjects.map((subject, index) => (
                  <div key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center space-x-2">
                    <span>{subject}</span>
                    <button
                      onClick={() => removeSubject(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Exam Types Configuration */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Exam Types</label>
                <button
                  onClick={addExamType}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  + Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {config.examTypes.map((type, index) => (
                  <div key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center space-x-2">
                    <span>{type}</span>
                    <button
                      onClick={() => removeExamType(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Grading Scale Configuration */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Grading Scale</label>
                <button
                  onClick={addGrade}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  + Add
                </button>
              </div>
              <div className="space-y-2">
                {config.gradingScale.map((grade, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-16 text-sm text-gray-600">≥ {grade.min}%</div>
                    <div 
                      className="px-3 py-1 rounded text-sm font-medium text-white"
                      style={{ backgroundColor: grade.color }}
                    >
                      {grade.grade}
                    </div>
                    <input
                      type="color"
                      value={grade.color}
                      onChange={(e) => {
                        const newScale = [...config.gradingScale];
                        newScale[index].color = e.target.value;
                        setConfig({ ...config, gradingScale: newScale });
                      }}
                      className="w-8 h-8 cursor-pointer"
                    />
                    <button
                      onClick={() => removeGrade(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Maximum Marks Configuration */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Maximum Marks per Subject
              </label>
              <input
                type="number"
                value={config.maxMarks}
                onChange={(e) => setConfig({ ...config, maxMarks: parseInt(e.target.value) || 100 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                min="1"
                max="1000"
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        {(!student.marks?.exams || student.marks.exams.length === 0) ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">No exams added yet</p>
            <p className="text-sm text-gray-500 mb-4">Add exams to track academic performance</p>
            <button
              onClick={addExam}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Add First Exam
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            
            {/* Exams List */}
            {student.marks.exams.map((exam) => (
              <div key={exam.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-bold text-gray-800">{exam.examType}</h4>
                    <p className="text-sm text-gray-600">Date: {exam.examDate}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span 
                      className="px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{ backgroundColor: getGradeColor(exam.overallGrade) }}
                    >
                      {exam.overallGrade}
                    </span>
                    <button
                      onClick={() => deleteExam(exam.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Marks</div>
                      <div className="font-bold text-gray-800">{exam.totalMarks}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Percentage</div>
                      <div className="font-bold text-green-600">{exam.percentage}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Grade</div>
                      <div 
                        className="font-bold"
                        style={{ color: getGradeColor(exam.overallGrade) }}
                      >
                        {exam.overallGrade}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Subjects Table */}
                <div className="space-y-3">
                  <div className="grid grid-cols-5 gap-2 text-sm font-medium text-gray-600 mb-2">
                    <div>Subject</div>
                    <div className="text-center">Marks</div>
                    <div className="text-center">Total</div>
                    <div className="text-center">Percentage</div>
                    <div className="text-center">Grade</div>
                  </div>
                  {exam.subjects.map((subject, subjectIndex) => (
                    <div key={subjectIndex} className="grid grid-cols-5 gap-2 items-center">
                      <div className="font-medium text-gray-700">{subject.name}</div>
                      <div>
                        <input
                          type="number"
                          value={subject.marks}
                          onChange={(e) => updateExamMarks(exam.id, subjectIndex, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-center"
                          max={subject.total || config.maxMarks}
                          min="0"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={subject.total}
                          onChange={(e) => updateSubjectTotal(exam.id, subjectIndex, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-center"
                          min="1"
                          max="1000"
                        />
                      </div>
                      <div className="text-center text-gray-600">
                        {subject.total > 0 ? Math.round((subject.marks / subject.total) * 100) : 0}%
                      </div>
                      <div 
                        className="text-center font-bold"
                        style={{ color: getGradeColor(subject.grade) }}
                      >
                        {subject.grade}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Exam Type Selection */}
                <div className="mt-4">
                  <label className="block text-sm text-gray-600 mb-1">Exam Type</label>
                  <select
                    value={exam.examType}
                    onChange={(e) => {
                      const updatedExams = student.marks.exams.map(ex => 
                        ex.id === exam.id ? { ...ex, examType: e.target.value } : ex
                      );
                      const updatedStudent = {
                        ...student,
                        marks: { ...student.marks, exams: updatedExams }
                      };
                      onUpdateStudent(updatedStudent);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {config.examTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Empty column to maintain layout */}
      <div></div>
    </>
  );
};

export default Marks;
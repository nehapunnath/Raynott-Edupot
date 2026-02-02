import React from 'react';
import { Award, Plus, Trash2 } from 'lucide-react';

const Marks = ({ student, onUpdateStudent }) => {
  const subjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi'];
  const examTypes = ['Unit Test 1', 'Unit Test 2', 'Half Yearly', 'Quarterly', 'Final Exam', 'Pre-Board'];

  const calculateGrade = (marks) => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C';
    if (marks >= 40) return 'D';
    return 'F';
  };

  const addExam = () => {
    const newExamId = student.marks.exams.length + 1;
    
    const updatedStudent = {
      ...student,
      marks: {
        ...student.marks,
        exams: [
          ...student.marks.exams,
          {
            id: Date.now(),
            examType: `Unit Test ${newExamId}`,
            examDate: new Date().toISOString().split('T')[0],
            subjects: [
              { name: 'Mathematics', marks: 0, total: 100, grade: '' },
              { name: 'Science', marks: 0, total: 100, grade: '' },
              { name: 'English', marks: 0, total: 100, grade: '' },
              { name: 'Social Studies', marks: 0, total: 100, grade: '' },
              { name: 'Hindi', marks: 0, total: 100, grade: '' }
            ],
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
    const updatedExams = student.marks.exams.map(exam => {
      if (exam.id === examId) {
        const updatedSubjects = [...exam.subjects];
        updatedSubjects[subjectIndex] = {
          ...updatedSubjects[subjectIndex],
          marks: parseInt(marks) || 0,
          grade: calculateGrade(marks)
        };

        const totalMarks = updatedSubjects.reduce((sum, sub) => sum + (sub.marks || 0), 0);
        const percentage = (totalMarks / (updatedSubjects.length * 100)) * 100;
        const overallGrade = calculateGrade(percentage);

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
    const allExamsAverage = updatedExams.length > 0 
      ? updatedExams.reduce((sum, exam) => sum + exam.percentage, 0) / updatedExams.length
      : 0;

    const updatedStudent = {
      ...student,
      marks: {
        exams: updatedExams,
        totalMarks: allExamsTotal,
        averagePercentage: Math.round(allExamsAverage * 10) / 10,
        overallGrade: calculateGrade(allExamsAverage)
      }
    };

    onUpdateStudent(updatedStudent);
  };

  const deleteExam = (examId) => {
    const updatedExams = student.marks.exams.filter(exam => exam.id !== examId);
    
    // Update overall marks
    const allExamsTotal = updatedExams.reduce((sum, exam) => sum + exam.totalMarks, 0);
    const allExamsAverage = updatedExams.length > 0 
      ? updatedExams.reduce((sum, exam) => sum + exam.percentage, 0) / updatedExams.length
      : 0;

    const updatedStudent = {
      ...student,
      marks: {
        exams: updatedExams,
        totalMarks: allExamsTotal,
        averagePercentage: Math.round(allExamsAverage * 10) / 10,
        overallGrade: calculateGrade(allExamsAverage)
      }
    };

    onUpdateStudent(updatedStudent);
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Academic Marks</h3>
          <button
            onClick={addExam}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm hover:from-blue-700 hover:to-blue-800 flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Exam</span>
          </button>
        </div>
        
        {student.marks.exams.length === 0 ? (
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
            {/* Overall Performance */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-gray-800 mb-3">Overall Performance</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600">Total Marks</div>
                  {/* <div className="text-xl font-bold text-blue-700">{student.marks.totalMarks}</div> */}
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Average %</div>
                  {/* <div className="text-xl font-bold text-green-700">{student.marks.averagePercentage}%</div> */}
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Grade</div>
                  {/* <div className="text-xl font-bold text-amber-700">{student.marks.overallGrade}</div> */}
                </div>
              </div>
            </div>
            
           {/* {student.marks.exams.map((exam) => (
              <div key={exam.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-bold text-gray-800">{exam.examType}</h4>
                    <p className="text-sm text-gray-600">Date: {exam.examDate}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
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
                      <div className="font-bold text-blue-600">{exam.overallGrade}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-2 text-sm font-medium text-gray-600 mb-2">
                    <div>Subject</div>
                    <div className="text-center">Marks</div>
                    <div className="text-center">Total</div>
                    <div className="text-center">Grade</div>
                  </div>
                  {exam.subjects.map((subject, subjectIndex) => (
                    <div key={subjectIndex} className="grid grid-cols-4 gap-2 items-center">
                      <div className="font-medium text-gray-700">{subject.name}</div>
                      <div>
                        <input
                          type="number"
                          value={subject.marks}
                          onChange={(e) => updateExamMarks(exam.id, subjectIndex, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-center"
                          max="100"
                          min="0"
                        />
                      </div>
                      <div className="text-center text-gray-600">{subject.total}</div>
                      <div className="text-center font-bold" style={{
                        color: subject.grade === 'A+' ? '#059669' :
                               subject.grade === 'A' ? '#2563eb' :
                               subject.grade === 'B+' ? '#d97706' :
                               subject.grade === 'B' ? '#ca8a04' : '#dc2626'
                      }}>
                        {subject.grade}
                      </div>
                    </div>
                  ))}
                </div>
                
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
                    {examTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))} */}
          </div>
        )}
      </div>

      {/* Empty column to maintain layout */}
      <div></div>
    </>
  );
};

export default Marks;
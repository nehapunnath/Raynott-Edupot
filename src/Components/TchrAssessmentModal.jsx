// src/components/dashboard/components/TeacherAssessmentModal.jsx
import React, { useState, useEffect } from 'react';
import { 
  X, Phone, Mail, Calendar, Users, BookOpen, Star, 
  TrendingUp, BarChart3, PieChart, Activity, Award,
  CheckCircle, Clock, AlertCircle, Download, Printer,
  Filter, Edit2, Save,  Target, Trophy,
  UserCheck, MessageSquare, FileText, Plus
} from 'lucide-react';
import StudentApi from '../service/StudentApi';
import { toast } from 'react-toastify';

const TchrAssessmentModal = ({ teacher, teacherPerformance, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, classes, exams, feedback
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [teacherData, setTeacherData] = useState(teacher);
  const [classStudents, setClassStudents] = useState({});
  const [examMarks, setExamMarks] = useState({});

  // Load students for each class
  useEffect(() => {
    if (teacher && teacher.classesAssigned) {
      teacher.classesAssigned.forEach(className => {
        loadClassStudents(className);
      });
    }
  }, [teacher]);

  const loadClassStudents = async (className) => {
    try {
      const result = await StudentApi.getStudentsByClass(className);
      if (result.success) {
        setClassStudents(prev => ({
          ...prev,
          [className]: result.students
        }));
      }
    } catch (error) {
      console.error('Load class students error:', error);
    }
  };

  const handleUpdateTeacher = async () => {
    setLoading(true);
    try {
      const result = await StudentApi.updateTeacher(teacher.id, teacherData);
      if (result.success) {
        toast.success('Teacher information updated successfully');
        setEditing(false);
        onUpdate();
      } else {
        toast.error(result.error || 'Update failed');
      }
    } catch (error) {
      console.error('Update teacher error:', error);
      toast.error('Failed to update teacher');
    } finally {
      setLoading(false);
    }
  };

  // Calculate total percentage per class per exam
  const calculateClassExamPercentage = (className, examName) => {
    const students = classStudents[className] || [];
    if (students.length === 0) return 0;
    
    const totalPercentage = students.reduce((sum, student) => {
      const marks = student.marks?.exams?.find(e => e.examType === examName);
      return sum + (marks?.percentage || 0);
    }, 0);
    
    return Math.round(totalPercentage / students.length);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 border-b px-6 py-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {teacher.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  {editing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={teacherData.name}
                        onChange={(e) => setTeacherData({ ...teacherData, name: e.target.value })}
                        className="text-xl font-bold px-3 py-1 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        value={teacherData.subject}
                        onChange={(e) => setTeacherData({ ...teacherData, subject: e.target.value })}
                        className="text-indigo-600 px-3 py-1 border border-gray-300 rounded-lg"
                      />
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-gray-900">{teacher.name}</h2>
                      <p className="text-indigo-600 font-medium">{teacher.subject} Teacher</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {editing ? (
                <>
                  <button
                    onClick={handleUpdateTeacher}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                  >
                    <Save size={16} />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setTeacherData(teacher);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 text-gray-600 hover:text-indigo-600 rounded-lg flex items-center space-x-2"
                >
                  <Edit2 size={16} />
                  <span>Edit</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Teacher Meta Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
            <div className="flex items-center space-x-2 text-sm">
              <Phone size={16} className="text-gray-400" />
              {editing ? (
                <input
                  type="text"
                  value={teacherData.phone}
                  onChange={(e) => setTeacherData({ ...teacherData, phone: e.target.value })}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span>{teacher.phone}</span>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Mail size={16} className="text-gray-400" />
              {editing ? (
                <input
                  type="email"
                  value={teacherData.email}
                  onChange={(e) => setTeacherData({ ...teacherData, email: e.target.value })}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded"
                />
              ) : (
                <span className="truncate">{teacher.email}</span>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Calendar size={16} className="text-gray-400" />
              <span>Joined: {teacher.joinDate || '2023-06-15'}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Users size={16} className="text-gray-400" />
              <span>ID: {teacher.id}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-2 font-medium text-sm transition-colors relative ${
                activeTab === 'overview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('classes')}
              className={`py-3 px-2 font-medium text-sm transition-colors relative ${
                activeTab === 'classes' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Classes & Performance
            </button>
            <button
              onClick={() => setActiveTab('exams')}
              className={`py-3 px-2 font-medium text-sm transition-colors relative ${
                activeTab === 'exams' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Exam Analysis
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`py-3 px-2 font-medium text-sm transition-colors relative ${
                activeTab === 'feedback' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Student Feedback
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Attendance Rate</p>
                      <p className="text-3xl font-bold">{teacher.attendance}%</p>
                    </div>
                    <UserCheck size={32} className="text-green-200" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-100 text-sm">Student Feedback</p>
                      <p className="text-3xl font-bold">{teacher.overallStudentFeedback} ★</p>
                    </div>
                    <Star size={32} className="text-amber-200" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Classes Assigned</p>
                      <p className="text-3xl font-bold">{teacher.classesAssigned.length}</p>
                    </div>
                    <BookOpen size={32} className="text-blue-200" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Total Students</p>
                      <p className="text-3xl font-bold">
                        {teacher.classesAssigned.reduce((total, cls) => total + (classStudents[cls]?.length || 0), 0)}
                      </p>
                    </div>
                    <Users size={32} className="text-purple-200" />
                  </div>
                </div>
              </div>

              {/* Performance Summary */}
              {teacherPerformance && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Summary</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Overall Class Average</span>
                        <span className="text-sm font-semibold text-indigo-600">{teacherPerformance.overallClassAverage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 rounded-full h-2"
                          style={{ width: `${teacherPerformance.overallClassAverage}%` }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">Highest Class Avg</p>
                        <p className="text-xl font-bold text-green-600">
                          {Math.max(...Object.values(teacherPerformance.classPerformance || {}).map(c => c.averagePercentage))}%
                        </p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <p className="text-sm text-gray-600">Subject Topper</p>
                        <p className="text-sm font-semibold text-orange-600 truncate">{teacherPerformance.subjectTopper}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Remarks Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Teacher Remarks</h3>
                {editing ? (
                  <textarea
                    value={teacherData.remarks}
                    onChange={(e) => setTeacherData({ ...teacherData, remarks: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter remarks about the teacher..."
                  />
                ) : (
                  <p className="text-gray-600 italic">"{teacher.remarks}"</p>
                )}
              </div>
            </div>
          )}

          {/* Classes Tab */}
          {activeTab === 'classes' && (
            <div className="space-y-6">
              {teacher.classesAssigned.map(className => {
                const performance = teacherPerformance?.classPerformance?.[className];
                const students = classStudents[className] || [];
                return (
                  <div key={className} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 border-b">
                      <h3 className="text-lg font-semibold text-gray-800">{className} - {teacher.subject}</h3>
                      <p className="text-sm text-gray-600">Total Students: {students.length}</p>
                    </div>
                    <div className="p-4">
                      {performance && (
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Class Avg</p>
                            <p className="text-xl font-bold text-indigo-600">{performance.averagePercentage}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Highest Score</p>
                            <p className="text-xl font-bold text-green-600">{performance.highestScore}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Lowest Score</p>
                            <p className="text-xl font-bold text-red-600">{performance.lowestScore}%</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Student List Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2 px-3">Student Name</th>
                              <th className="text-left py-2 px-3">Admission No</th>
                              <th className="text-left py-2 px-3">Latest Score</th>
                              <th className="text-left py-2 px-3">Grade</th>
                              <th className="text-left py-2 px-3">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {students.slice(0, 5).map(student => {
                              const latestExam = student.marks?.exams?.slice(-1)[0];
                              return (
                                <tr key={student.studentId} className="border-b border-gray-100">
                                  <td className="py-2 px-3">{student.basicInfo?.name}</td>
                                  <td className="py-2 px-3">{student.basicInfo?.admissionNo}</td>
                                  <td className="py-2 px-3 font-semibold">{latestExam?.percentage || '-'}%</td>
                                  <td className="py-2 px-3">{latestExam?.grade || '-'}</td>
                                  <td className="py-2 px-3">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      (latestExam?.percentage || 0) >= 70 ? 'bg-green-100 text-green-700' :
                                      (latestExam?.percentage || 0) >= 50 ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-red-100 text-red-700'
                                    }`}>
                                      {(latestExam?.percentage || 0) >= 70 ? 'Good' :
                                       (latestExam?.percentage || 0) >= 50 ? 'Average' : 'Needs Improvement'}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        {students.length > 5 && (
                          <div className="text-center mt-3">
                            <button className="text-indigo-600 text-sm hover:text-indigo-700">
                              View all {students.length} students →
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Exams Tab */}
          {activeTab === 'exams' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 p-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">Exam Performance Analysis</h3>
                  <p className="text-sm text-gray-600">Class-wise average percentage per examination</p>
                </div>
                <div className="p-4 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4">Exam Name</th>
                        <th className="text-left py-3 px-4">Date</th>
                        {teacher.classesAssigned.map(cls => (
                          <th key={cls} className="text-center py-3 px-4">{cls}</th>
                        ))}
                        <th className="text-center py-3 px-4">Overall Avg</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teacherPerformance?.recentExams?.map(exam => (
                        <tr key={exam.examName} className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium">{exam.examName}</td>
                          <td className="py-3 px-4 text-gray-600">{exam.date}</td>
                          {teacher.classesAssigned.map(cls => {
                            const classAvg = calculateClassExamPercentage(cls, exam.examName);
                            return (
                              <td key={cls} className="text-center py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                                  classAvg >= 70 ? 'text-green-600' :
                                  classAvg >= 50 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {classAvg}%
                                </span>
                              </td>
                            );
                          })}
                          <td className="text-center py-3 px-4 font-bold text-indigo-600">
                            {exam.classAverage}%
                          </td>
                         </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Subject Topper Section */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
                <div className="flex items-center space-x-3 mb-4">
                  <Trophy className="text-amber-600" size={28} />
                  <h3 className="text-lg font-semibold text-gray-800">Subject Topper</h3>
                </div>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-2xl font-bold text-amber-700">{teacherPerformance?.subjectTopper || 'Not available'}</p>
                    <p className="text-sm text-gray-600 mt-1">Highest score in {teacher.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Overall Subject Average</p>
                    <p className="text-3xl font-bold text-indigo-600">{teacherPerformance?.overallClassAverage || 0}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feedback Tab */}
          {activeTab === 'feedback' && (
            <div className="space-y-6">
              {/* Feedback Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                  <Star size={24} className="text-amber-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800">{teacher.overallStudentFeedback}</p>
                  <p className="text-sm text-gray-600">Overall Rating (out of 5)</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                  <MessageSquare size={24} className="text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800">24</p>
                  <p className="text-sm text-gray-600">Total Feedbacks Received</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                  <TrendingUp size={24} className="text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">+12%</p>
                  <p className="text-sm text-gray-600">Improvement from Last Term</p>
                </div>
              </div>

              {/* Recent Feedback List */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 p-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Student Feedback</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {[
                    { student: "Aryan Verma", class: "Class 5", rating: 5, comment: "Excellent teacher! Makes math so easy to understand.", date: "2024-02-15" },
                    { student: "Priya Patel", class: "Class 3", rating: 4, comment: "Very patient and helpful. My daughter loves her classes.", date: "2024-02-10" },
                    { student: "Rahul Singh", class: "Class 5", rating: 5, comment: "Best teacher ever! Explains concepts clearly.", date: "2024-02-05" },
                    { student: "Neha Gupta", class: "Class 3", rating: 4, comment: "Good teaching style, but sometimes too fast.", date: "2024-01-28" },
                    { student: "Kunal Sharma", class: "Class 5", rating: 5, comment: "Very supportive and encouraging.", date: "2024-01-20" }
                  ].map((feedback, idx) => (
                    <div key={idx} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-800">{feedback.student}</span>
                            <span className="text-xs text-gray-500">{feedback.class}</span>
                            <div className="flex items-center space-x-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} className={i < feedback.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"} />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">"{feedback.comment}"</p>
                          <p className="text-xs text-gray-400 mt-1">{feedback.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-gray-50 text-center">
                  <button className="text-indigo-600 text-sm hover:text-indigo-700 flex items-center justify-center space-x-1 mx-auto">
                    <Plus size={14} />
                    <span>Add New Feedback</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TchrAssessmentModal;
// src/components/dashboard/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { LogOut, Users, UserPlus, List, BarChart3, Search, DollarSign, Award } from 'lucide-react';
import StudentList from '../Components/StudentList';
import AllStudents from '../Components/AllStudents';
import AddStudent from '../Components/AddStudents';
import StudentApi from '../service/StudentApi';
import { toast } from 'react-toastify';
import { auth } from '../service/firebase';
import { useNavigate } from 'react-router-dom';
import FeesTab from '../Components/FeesTab';
import MarksTab from '../Components/MarksTab';
import AssessmentTab from '../Components/AssessmentTab';
import TeachersAssessment from '../Components/TeachersAssessment';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('search');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Create a refresh function
  const refreshStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await StudentApi.getAllStudents();
      if (result.success) {
        const normalized = result.students.map(stu => ({
          ...stu,
          id: stu.studentId,
        }));
        setStudents(normalized);
        setFilteredStudents(normalized);
        console.log('Students refreshed:', normalized.length);
      } else {
        setError(result.error || 'Failed to load students');
      }
    } catch (err) {
      console.error('Refresh failed:', err);
      setError(err.message || 'Network error while loading students');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshStudents();
  }, [refreshStudents]);

  // Refresh when tab changes to 'allStudents'
  useEffect(() => {
    if (activeTab === 'allStudents') {
      refreshStudents();
    }
  }, [activeTab, refreshStudents]);

  const handleAddStudent = async (newStudentData) => {
    try {
      console.log('Adding student with data:', newStudentData);

      const result = await StudentApi.createStudent(newStudentData);
      console.log('API response:', result);

      if (result.success) {
        toast.success('Student added successfully!');

        // Switch to all students tab
        setActiveTab('allStudents');

        // Refresh immediately without delay
        await refreshStudents();

        // Optionally scroll to the newly added student
        setTimeout(() => {
          const newStudentElement = document.getElementById(`student-${result.studentId}`);
          if (newStudentElement) {
            newStudentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            newStudentElement.classList.add('highlight-new-student');
            setTimeout(() => {
              newStudentElement.classList.remove('highlight-new-student');
            }, 3000);
          }
        }, 100);

      } else {
        toast.error('Failed to add student: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Add student failed:', err);
      toast.error('Error adding student: ' + err.message);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      const result = await StudentApi.deleteStudent(studentId);
      if (result.success) {
        toast.success('Student deleted successfully');
        await refreshStudents(); // Refresh immediately
        if (selectedStudent?.studentId === studentId) {
          setSelectedStudent(null);
        }
      } else {
        toast.error('Delete failed: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Error deleting student');
    }
  };

  const handleUpdateStudent = async () => {
    await refreshStudents(); // Refresh after update
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('user');
      localStorage.removeItem('schoolId');
      toast.success("Logged out successfully");
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-600 shadow-lg">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Raynott Edupot</h1>
            <p className="text-amber-100">School Fee Management System</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="font-semibold text-lg text-white">Welcome</p>
              {/* <p className="text-sm text-amber-200">{user?.email}</p> */}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 backdrop-blur-sm text-white"
            >
              <LogOut size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="px-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('search')}
              className={`px-4 py-4 font-medium text-sm transition-all relative ${activeTab === 'search'
                ? 'text-amber-600'
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center space-x-2">
                <Search size={18} />
                <span>Search & Filter</span>
              </div>
              {activeTab === 'search' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('allStudents')}
              className={`px-4 py-4 font-medium text-sm transition-all relative ${activeTab === 'allStudents'
                ? 'text-amber-600'
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center space-x-2">
                <List size={18} />
                <span>All Students </span>
              </div>
              {activeTab === 'allStudents' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('addStudent')}
              className={`px-4 py-4 font-medium text-sm transition-all relative ${activeTab === 'addStudent'
                ? 'text-amber-600'
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center space-x-2">
                <UserPlus size={18} />
                <span>Add New Student</span>
              </div>
              {activeTab === 'addStudent' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab('fees')}
              className={`px-4 py-4 font-medium text-sm transition-all relative ${activeTab === 'fees'
                ? 'text-amber-600'
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center space-x-2">
                <DollarSign size={18} />
                <span>Fees</span>
              </div>
              {activeTab === 'fees' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('marks')}
              className={`px-4 py-4 font-medium text-sm transition-all relative ${activeTab === 'marks'
                ? 'text-amber-600'
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center space-x-2">
                <Award size={18} />
                <span>Marks</span>
              </div>
              {activeTab === 'marks' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('assessment')}
              className={`px-4 py-4 font-medium text-sm transition-all relative ${activeTab === 'assessment'
                ? 'text-amber-600'
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center space-x-2">
                <BarChart3 size={18} />
                <span>Assessment Reports</span>
              </div>
              {activeTab === 'assessment' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"></div>
              )}
            </button>
             <button
              onClick={() => setActiveTab('teachers')}
              className={`px-4 py-4 font-medium text-sm transition-all relative ${activeTab === 'assessment'
                ? 'text-amber-600'
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center space-x-2">
                <BarChart3 size={18} />
                <span>Teachers Assessment Report</span>
              </div>
              {activeTab === 'teachers' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"></div>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {activeTab === 'addStudent' ? (
          <AddStudent
            onAddStudent={handleAddStudent}
            onCancel={() => setActiveTab('allStudents')}
          />
        ) : activeTab === 'search' ? (
          <StudentList
            students={filteredStudents}
            onSelectStudent={setSelectedStudent}
            onDeleteStudent={handleDeleteStudent}
            onAddNew={() => setActiveTab('addStudent')}
          />
        ) : activeTab === 'fees' ? (
          <FeesTab
            students={students}
            onUpdateStudent={handleUpdateStudent}
          />
        ) : activeTab === 'marks' ? (

          <MarksTab
            students={students}
            onUpdateStudent={handleUpdateStudent}
          />
        ) : activeTab === 'assessment' ? (

          <AssessmentTab
            students={students}
            onUpdateStudent={handleUpdateStudent}
          />
        ) : activeTab === 'teachers' ? (

          <TeachersAssessment
            students={students}
            onUpdateStudent={handleUpdateStudent}
          />
        ):
         (
          <AllStudents
            students={students}
            onViewDetails={setSelectedStudent}
            onDelete={handleDeleteStudent}
            onUpdateStudent={handleUpdateStudent}
            onRefresh={refreshStudents}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Add some CSS for highlighting new students */}
      <style jsx>{`
        .highlight-new-student {
          animation: highlight 3s ease-out;
        }
        
        @keyframes highlight {
          0% { background-color: rgba(251, 191, 36, 0.2); }
          100% { background-color: transparent; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
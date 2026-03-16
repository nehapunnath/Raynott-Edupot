// src/components/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { LogOut, Users, UserPlus, List, BarChart3, Search } from 'lucide-react';
import StudentList from '../Components/StudentList';
import AllStudents from '../Components/AllStudents'; 
// import StudentDetails from '../Components/StudentDetails';
import AddStudent from '../Components/AddStudents';
import StudentApi from '../service/StudentApi';
import { toast } from 'react-toastify';
import { auth } from '../service/firebase';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('allStudents'); 
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [error, setError] = useState(null);

  const navigate=useNavigate()


  // Initialize with sample data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // setLoading(true);
        setError(null);
        
        const result = await StudentApi.getAllStudents();
        
        if (result.success) {
          // Important: backend returns studentId, frontend was using .id
          // Map to keep compatibility with your current components
          const normalized = result.students.map(stu => ({
            ...stu,
            id: stu.studentId,           // ← make .id = studentId for existing components
          }));
          setStudents(normalized);
          setFilteredStudents(normalized);
        } else {
          setError(result.error || 'Failed to load students');
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err.message || 'Network error while loading students');
      } 
      // finally {
      //   setLoading(false);
      // }
    };

    fetchStudents();
  }, []);

 const handleAddStudent = async (newStudentData) => {
    try {
      const result = await StudentApi.createStudent(newStudentData);
      
      if (result.success) {
        // Add the newly created student to local state
        const newStudentWithId = {
          ...result.student,
          id: result.studentId,
        };
        setStudents(prev => [...prev, newStudentWithId]);
        setFilteredStudents(prev => [...prev, newStudentWithId]);
        setActiveTab('allStudents');
      } else {
        alert('Failed to add student: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Add student failed:', err);
      alert('Error adding student');
    }
  };

 const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      const result = await StudentApi.deleteStudent(studentId);
      if (result.success) {
        setStudents(prev => prev.filter(s => s.studentId !== studentId));
        setFilteredStudents(prev => prev.filter(s => s.studentId !== studentId));
        if (selectedStudent?.studentId === studentId) {
          setSelectedStudent(null);
        }
      } else {
        alert('Delete failed: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting student');
    }
  };

  const handleUpdateStudent = (updatedStudent) => {
  console.log("handleUpdateStudent received:", {
    studentId: updatedStudent.studentId,
    totalPaid: updatedStudent.totalPaid,
    pendingAmount: updatedStudent.pendingAmount,
    installmentsCount: updatedStudent.installments?.length
  });

  const key = updatedStudent.studentId || updatedStudent.id;
  console.log("Using key for match:", key);

  const updatedStudents = students.map(student => {
    const studentKey = student.studentId || student.id;
    return studentKey === key ? updatedStudent : student;
  });

  console.log("Updated students length:", updatedStudents.length);

  setStudents(updatedStudents);
  setFilteredStudents(updatedStudents);

  const selectedKey = selectedStudent?.studentId || selectedStudent?.id;
  if (selectedKey === key) {
    console.log("Updating selected student too");
    setSelectedStudent(updatedStudent);
  }
};

const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('user');           // clear any stored user data
      localStorage.removeItem('schoolId');       // if you stored this
      toast.success("Logged out successfully");
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  // Update the navigation tabs
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
              <p className="font-semibold text-lg text-white">Welcome, {user?.name}</p>
              <p className="text-sm text-amber-200">{user?.email}</p>
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
                <span>All Students ({students.length})</span>
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
                {/* <cash size={18} /> */}
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
                {/* <cash size={18} /> */}
                <span>Marks</span>
              </div>
              {activeTab === 'marks' && (
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
        ) : (
          <AllStudents
            students={students}
            onViewDetails={setSelectedStudent}
            onDelete={handleDeleteStudent}
            onUpdateStudent={handleUpdateStudent}
          />
        )}
      </div>

      {/* Student Details Modal */}
      {/* {selectedStudent && (
        <StudentDetails
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onUpdateStudent={handleUpdateStudent}
        />
      )} */}
    </div>
  );
};

export default Dashboard;
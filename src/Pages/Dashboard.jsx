// src/components/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { LogOut, Users, UserPlus } from 'lucide-react';
import StudentList from '../Components/StudentList';
import StudentDetails from '../Components/StudentDetails';
import AddStudent from '../Components/AddStudents';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('students');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  // Initialize with sample data
  useEffect(() => {
    const sampleStudents = [
      {
        id: 1,
        basicInfo: {
          name: 'Rahul Sharma',
          dob: '2010-05-15',
          aadhar: '1234-5678-9012',
          fatherName: 'Rajesh Sharma',
          motherName: 'Priya Sharma',
          fatherPhone: '9876543210',
          motherPhone: '9876543211',
          address: '123 Main Street, Mumbai',
          grade: '10',
          section: 'A',
          admissionNo: 'SCH2024001',
          admissionDate: '2024-04-01'
        },
        feeStructure: {
          tuition: 25000,
          books: 5000,
          uniform: 3000,
          transport: 2000,
          other: 1000,
          total: 36000,
          includesBooks: true,
          includesUniform: true,
          includesTransport: true
        },
        installments: [
          { 
            id: 1, 
            number: 1, 
            amount: 12000, 
            paid: 12000, 
            dueDate: '2024-04-10', 
            paidDate: '2024-04-05', 
            status: 'paid',
            paymentMode: 'Online'
          },
          { 
            id: 2, 
            number: 2, 
            amount: 12000, 
            paid: 12000, 
            dueDate: '2024-07-10', 
            paidDate: '2024-07-01', 
            status: 'paid',
            paymentMode: 'Cash'
          },
          { 
            id: 3, 
            number: 3, 
            amount: 12000, 
            paid: 6000, 
            dueDate: '2024-10-10', 
            paidDate: '2024-10-01', 
            status: 'partial',
            paymentMode: 'Cheque'
          }
        ],
        marks: {
          exams: [
            {
              id: 1,
              examType: 'Unit Test 1',
              examDate: '2024-06-15',
              subjects: [
                { name: 'Mathematics', marks: 85, total: 100, grade: 'A' },
                { name: 'Science', marks: 90, total: 100, grade: 'A+' },
                { name: 'English', marks: 78, total: 100, grade: 'B+' },
                { name: 'Social Studies', marks: 88, total: 100, grade: 'A' },
                { name: 'Hindi', marks: 82, total: 100, grade: 'A' }
              ],
              totalMarks: 423,
              percentage: 84.6,
              overallGrade: 'A'
            }
          ],
          totalMarks: 423,
          averagePercentage: 84.6,
          overallGrade: 'A'
        },
        totalPaid: 30000,
        pendingAmount: 6000,
        status: 'active'
      }
    ];
    setStudents(sampleStudents);
    setFilteredStudents(sampleStudents);
  }, []);

  const handleAddStudent = (newStudent) => {
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    setFilteredStudents(updatedStudents);
    setActiveTab('students');
  };

  const handleDeleteStudent = (studentId) => {
    const updatedStudents = students.filter(s => s.id !== studentId);
    setStudents(updatedStudents);
    setFilteredStudents(updatedStudents);
    if (selectedStudent?.id === studentId) {
      setSelectedStudent(null);
    }
  };

  const handleUpdateStudent = (updatedStudent) => {
    const updatedStudents = students.map(student => 
      student.id === updatedStudent.id ? updatedStudent : student
    );
    setStudents(updatedStudents);
    setFilteredStudents(updatedStudents);
    setSelectedStudent(updatedStudent);
  };

  const handleSearchFilter = (criteria) => {
    const filtered = students.filter(student => {
      const matchesName = !criteria.name || 
        student.basicInfo.name.toLowerCase().includes(criteria.name.toLowerCase());
      const matchesDOB = !criteria.dob || 
        student.basicInfo.dob === criteria.dob;
      const matchesGrade = !criteria.grade || 
        student.basicInfo.grade === criteria.grade;
      const matchesFather = !criteria.fatherName || 
        student.basicInfo.fatherName.toLowerCase().includes(criteria.fatherName.toLowerCase());
      const matchesMother = !criteria.motherName || 
        student.basicInfo.motherName.toLowerCase().includes(criteria.motherName.toLowerCase());
      const matchesAadhar = !criteria.aadhar || 
        student.basicInfo.aadhar.includes(criteria.aadhar);
      
      return matchesName && matchesDOB && matchesGrade && 
             matchesFather && matchesMother && matchesAadhar;
    });
    setFilteredStudents(filtered);
  };

  const handleClearSearch = () => {
    setFilteredStudents(students);
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
              <p className="font-semibold text-lg text-white">Welcome, {user?.name}</p>
              <p className="text-sm text-amber-200">{user?.email}</p>
            </div>
            <button
              onClick={onLogout}
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
              onClick={() => setActiveTab('students')}
              className={`px-4 py-4 font-medium text-sm transition-all relative ${activeTab === 'students' 
                ? 'text-amber-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center space-x-2">
                <Users size={18} />
                <span>Students ({students.length})</span>
              </div>
              {activeTab === 'students' && (
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
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {activeTab === 'addStudent' ? (
          <AddStudent 
            onAddStudent={handleAddStudent}
            onCancel={() => setActiveTab('students')}
          />
        ) : (
          <StudentList
            students={filteredStudents}
            onSelectStudent={setSelectedStudent}
            onDeleteStudent={handleDeleteStudent}
            onSearch={handleSearchFilter}
            onClearSearch={handleClearSearch}
            onAddNew={() => setActiveTab('addStudent')}
          />
        )}
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <StudentDetails
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onUpdateStudent={handleUpdateStudent}
        />
      )}
    </div>
  );
};

export default Dashboard;
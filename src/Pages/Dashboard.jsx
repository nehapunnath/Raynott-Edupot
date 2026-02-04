// src/components/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { LogOut, Users, UserPlus, List, BarChart3, Search } from 'lucide-react';
import StudentList from '../Components/StudentList';
import AllStudents from '../Components/AllStudents'; // Add this import
import StudentDetails from '../Components/StudentDetails';
import AddStudent from '../Components/AddStudents';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('allStudents'); // Change default tab
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
    studentAadhar: '1234-5678-9012',
    fatherName: 'Rajesh Sharma',
    fatherAadhar: '2345-6789-0123',
    motherName: 'Priya Sharma',
    motherAadhar: '3456-7890-1234',
    fatherPhone: '9876543210',
    motherPhone: '9876543211',
    fatherOccupation: 'Software Engineer',
    motherOccupation: 'Doctor',
    fatherEmail: 'rajesh.sharma@email.com',
    motherEmail: 'priya.sharma@email.com',
    address: '123 Main Street, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    grade: '10',
    section: 'A',
    admissionNo: 'SCH2024001',
    admissionDate: '2024-04-01',
    bloodGroup: 'B+',
    emergencyContact: 'Ramesh Sharma (Uncle)',
    emergencyPhone: '9876543212'
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
  installmentConfig: {
    numberOfInstallments: 3,
    installments: [
      { number: 1, dueDate: '2024-04-10', amount: 12000 },
      { number: 2, dueDate: '2024-07-10', amount: 12000 },
      { number: 3, dueDate: '2024-10-10', amount: 12000 }
    ]
  },
  marksConfig: {
    subjects: ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi'],
    examTypes: ['Unit Test 1', 'Unit Test 2', 'Half Yearly', 'Quarterly', 'Final Exam', 'Pre-Board'],
    gradingScale: [
      { min: 90, grade: 'A+' },
      { min: 80, grade: 'A' },
      { min: 70, grade: 'B+' },
      { min: 60, grade: 'B' },
      { min: 50, grade: 'C' },
      { min: 40, grade: 'D' },
      { min: 0, grade: 'F' }
    ],
    maxMarks: 100
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
      paymentMode: 'Online',
      reference: 'TXN123456',
      notes: 'Paid via UPI'
    },
    { 
      id: 2, 
      number: 2, 
      amount: 12000, 
      paid: 12000, 
      dueDate: '2024-07-10', 
      paidDate: '2024-07-01', 
      status: 'paid',
      paymentMode: 'Cash',
      reference: '',
      notes: 'Cash payment at school office'
    },
    { 
      id: 3, 
      number: 3, 
      amount: 12000, 
      paid: 6000, 
      dueDate: '2024-10-10', 
      paidDate: '2024-10-01', 
      status: 'partial',
      paymentMode: 'Cheque',
      reference: 'CHQ789012',
      notes: 'Cheque number 789012, remaining will be paid next month'
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
      },
      {
        id: 2,
        examType: 'Unit Test 2',
        examDate: '2024-09-20',
        subjects: [
          { name: 'Mathematics', marks: 88, total: 100, grade: 'A' },
          { name: 'Science', marks: 92, total: 100, grade: 'A+' },
          { name: 'English', marks: 85, total: 100, grade: 'A' },
          { name: 'Social Studies', marks: 90, total: 100, grade: 'A+' },
          { name: 'Hindi', marks: 80, total: 100, grade: 'A' }
        ],
        totalMarks: 435,
        percentage: 87.0,
        overallGrade: 'A+'
      }
    ],
    subjects: ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi'],
    examTypes: ['Unit Test 1', 'Unit Test 2', 'Half Yearly', 'Quarterly', 'Final Exam', 'Pre-Board'],
    gradingScale: [
      { min: 90, grade: 'A+' },
      { min: 80, grade: 'A' },
      { min: 70, grade: 'B+' },
      { min: 60, grade: 'B' },
      { min: 50, grade: 'C' },
      { min: 40, grade: 'D' },
      { min: 0, grade: 'F' }
    ],
    maxMarks: 100,
    totalMarks: 858,
    averagePercentage: 85.8,
    overallGrade: 'A'
  },
  totalPaid: 30000,
  pendingAmount: 6000,
  status: 'active',
  createdAt: '2024-04-01T10:30:00Z',
  updatedAt: '2024-10-01T15:45:00Z'
},
      
    ];
    setStudents(sampleStudents);
    setFilteredStudents(sampleStudents);
  }, []);

  const handleAddStudent = (newStudent) => {
    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    setFilteredStudents(updatedStudents);
    setActiveTab('allStudents');
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      const updatedStudents = students.filter(s => s.id !== studentId);
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
      if (selectedStudent?.id === studentId) {
        setSelectedStudent(null);
      }
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
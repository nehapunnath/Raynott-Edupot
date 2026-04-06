// src/components/dashboard/DynamicDashboard.jsx
import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import StudentList from '../Components/StudentList';
import AllStudents from '../Components/AllStudents';
import AddStudent from '../Components/AddStudents';
import FeesTab from '../Components/FeesTab';
import MarksTab from '../Components/MarksTab';
import AssessmentTab from '../Components/AssessmentTab';

// Tab Components Mapping
const TAB_COMPONENTS = {
  search: StudentList,
  allStudents: AllStudents,
  addStudent: AddStudent,
  fees: FeesTab,
  marks: MarksTab,
  assessment: AssessmentTab
};

// Tab Icons & Names Mapping
const TAB_CONFIG = {
  search: { icon: '🔍', name: 'Search & Filter' },
  allStudents: { icon: '📋', name: 'All Students' },
  addStudent: { icon: '➕', name: 'Add New Student' },
  fees: { icon: '💰', name: 'Fees' },
  marks: { icon: '🏆', name: 'Marks' },
  assessment: { icon: '📊', name: 'Assessment Reports' }
};

// Mock data for design preview
const MOCK_STUDENTS = [
  { id: '1', studentId: 'STU001', name: 'John Doe', className: '10th', section: 'A', rollNumber: '101' },
  { id: '2', studentId: 'STU002', name: 'Jane Smith', className: '10th', section: 'B', rollNumber: '102' },
  { id: '3', studentId: 'STU003', name: 'Mike Johnson', className: '9th', section: 'A', rollNumber: '201' },
];

const DynamicDashboard = ({ 
  user = { name: 'Admin User', email: 'admin@school.com' }, 
  onLogout = () => console.log('Logout clicked'),
  enabledTabs = ['search', 'allStudents', 'addStudent'] // This would come from admin config
}) => {
  const [activeTab, setActiveTab] = useState(enabledTabs[0] || 'search');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students] = useState(MOCK_STUDENTS);
  const [filteredStudents] = useState(MOCK_STUDENTS);

  // Mock handlers for design
  const handleAddStudent = () => console.log('Add student');
  const handleDeleteStudent = () => console.log('Delete student');
  const handleUpdateStudent = () => console.log('Update student');

  // Render the active component
  const renderActiveComponent = () => {
    if (!activeTab) return null;

    const Component = TAB_COMPONENTS[activeTab];
    if (!Component) return null;

    const commonProps = {
      students,
      filteredStudents,
      onSelectStudent: setSelectedStudent,
      onDeleteStudent: handleDeleteStudent,
      onUpdateStudent: handleUpdateStudent,
      isLoading: false
    };

    // Props specific to AddStudent
    if (activeTab === 'addStudent') {
      return <Component onAddStudent={handleAddStudent} onCancel={() => setActiveTab('allStudents')} />;
    }
    
    // Props for StudentList (search tab)
    if (activeTab === 'search') {
      return <Component {...commonProps} onAddNew={() => setActiveTab('addStudent')} />;
    }
    
    // Props for AllStudents tab
    if (activeTab === 'allStudents') {
      return <Component {...commonProps} onViewDetails={setSelectedStudent} onDelete={handleDeleteStudent} />;
    }
    
    // Props for other tabs (fees, marks, assessment)
    return <Component {...commonProps} />;
  };

  // Don't render if no tabs are enabled
  if (enabledTabs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No Tabs Available</h2>
          <p className="text-gray-500">Please contact administrator to enable dashboard access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-600 shadow-lg sticky top-0 z-10">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Raynott Edupot</h1>
            <p className="text-amber-100 text-sm mt-1">School Management System</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="font-semibold text-white">Welcome, {user.name}</p>
              <p className="text-amber-100 text-sm">{user.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 backdrop-blur-sm text-white font-medium"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs - Only show enabled tabs */}
      <div className="border-b border-gray-200 bg-white shadow-sm sticky top-[73px] z-10">
        <div className="px-6">
          <nav className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {enabledTabs.map((tabId) => (
              <button
                key={tabId}
                onClick={() => setActiveTab(tabId)}
                className={`px-5 py-4 font-medium text-sm transition-all relative whitespace-nowrap ${
                  activeTab === tabId
                    ? 'text-amber-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{TAB_CONFIG[tabId]?.icon || '📄'}</span>
                  <span>{TAB_CONFIG[tabId]?.name || tabId}</span>
                </div>
                {activeTab === tabId && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full"></div>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 animate-fadeIn">
        <div className="max-w-7xl mx-auto">
          {renderActiveComponent()}
        </div>
      </div>

      {/* Footer (Optional) */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="px-6 py-4 text-center text-sm text-gray-500">
          © 2024 Raynott Edupot. All rights reserved.
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default DynamicDashboard;
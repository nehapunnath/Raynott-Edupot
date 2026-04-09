// src/components/dashboard/DynamicDashboard.jsx
import React, { useState, useEffect } from 'react';
import { LogOut, Users, UserPlus, List, BarChart3, Search, DollarSign, Award } from 'lucide-react';
import { toast } from 'react-toastify';
import { auth } from '../service/firebase';
import SchoolApi from '../service/SchoolApi';
import StudentApi from '../service/StudentApi';
import StudentList from '../Components/StudentList';
import AllStudents from '../Components/AllStudents';
import AddStudent from '../Components/AddStudents';
import FeesTab from '../Components/FeesTab';
import MarksTab from '../Components/MarksTab';
import AssessmentTab from '../Components/AssessmentTab';

// Tab Icons & Names Mapping
const TAB_CONFIG = {
  search: { icon: Search, name: 'Search & Filter' },
  allStudents: { icon: List, name: 'All Students' },
  addStudent: { icon: UserPlus, name: 'Add New Student' },
  fees: { icon: DollarSign, name: 'Fees' },
  marks: { icon: Award, name: 'Marks' },
  assessments: { icon: BarChart3, name: 'Assessment Reports' }
};

// Tab Components Mapping
const TAB_COMPONENTS = {
  search: StudentList,
  allStudents: AllStudents,
  addStudent: AddStudent,
  fees: FeesTab,
  marks: MarksTab,
  assessments: AssessmentTab
};

const DynamicDashboard = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [enabledTabs, setEnabledTabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user data and tab configuration on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          window.location.href = '/login';
          return;
        }

        // Get user profile using SchoolApi
        const profileResult = await SchoolApi.getUserProfile(currentUser.uid);
        
        if (!profileResult.success) {
          throw new Error(profileResult.error || 'Failed to fetch profile');
        }
        
        const profileData = profileResult.profile;
        
        setUser({
          name: profileData.name || currentUser.displayName,
          email: currentUser.email,
          ...profileData
        });
        
        // Get enabled tabs from user profile
        let tabs = profileData.enabledTabs || [];
        
        // If user has fullAccess, get all tabs
        if (profileData.fullAccess) {
          tabs = Object.keys(TAB_CONFIG);
        }
        
        // If still no tabs, get school default tabs
        if (tabs.length === 0 && profileData.schoolId) {
          const schoolConfig = await SchoolApi.getSchoolTabConfig(profileData.schoolId);
          if (schoolConfig.success && schoolConfig.enabledTabs) {
            tabs = schoolConfig.enabledTabs;
          } else {
            // Default tabs if nothing is configured
            tabs = ['search', 'allStudents', 'addStudent'];
          }
        }
        
        setEnabledTabs(tabs);
        if (tabs.length > 0 && tabs.includes(activeTab)) {
          // Keep current tab if it's enabled
        } else if (tabs.length > 0) {
          setActiveTab(tabs[0]);
        }
        
        // Fetch all students
        await refreshStudents();
        
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load dashboard configuration');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  // Refresh students function
  const refreshStudents = async () => {
    setIsLoading(true);
    try {
      const result = await StudentApi.getAllStudents();
      if (result.success) {
        const normalized = result.students.map(stu => ({
          ...stu,
          id: stu.studentId,
          studentId: stu.studentId || stu.id,
          basicInfo: {
            name: stu.name || stu.basicInfo?.name || '',
            admissionNo: stu.admissionNo || stu.basicInfo?.admissionNo || '',
            grade: stu.grade || stu.basicInfo?.grade || '',
            section: stu.section || stu.basicInfo?.section || '',
            rollNumber: stu.rollNumber || stu.basicInfo?.rollNumber || '',
            dob: stu.dob || stu.basicInfo?.dob || '',
            admissionDate: stu.admissionDate || stu.basicInfo?.admissionDate || '',
            bloodGroup: stu.bloodGroup || stu.basicInfo?.bloodGroup || '',
            studentAadhar: stu.studentAadhar || stu.basicInfo?.studentAadhar || '',
            fatherName: stu.fatherName || stu.basicInfo?.fatherName || '',
            fatherAadhar: stu.fatherAadhar || stu.basicInfo?.fatherAadhar || '',
            fatherPhone: stu.fatherPhone || stu.basicInfo?.fatherPhone || '',
            fatherEmail: stu.fatherEmail || stu.basicInfo?.fatherEmail || '',
            fatherOccupation: stu.fatherOccupation || stu.basicInfo?.fatherOccupation || '',
            motherName: stu.motherName || stu.basicInfo?.motherName || '',
            motherAadhar: stu.motherAadhar || stu.basicInfo?.motherAadhar || '',
            motherPhone: stu.motherPhone || stu.basicInfo?.motherPhone || '',
            motherEmail: stu.motherEmail || stu.basicInfo?.motherEmail || '',
            motherOccupation: stu.motherOccupation || stu.basicInfo?.motherOccupation || '',
            address: stu.address || stu.basicInfo?.address || '',
            city: stu.city || stu.basicInfo?.city || '',
            state: stu.state || stu.basicInfo?.state || '',
            pincode: stu.pincode || stu.basicInfo?.pincode || '',
            emergencyContact: stu.emergencyContact || stu.basicInfo?.emergencyContact || '',
            emergencyPhone: stu.emergencyPhone || stu.basicInfo?.emergencyPhone || '',
          },
          feeStructure: stu.feeStructure || { total: 0 },
          totalPaid: stu.totalPaid || 0,
          pendingAmount: stu.pendingAmount || 0,
          installments: stu.installments || [],
          marks: stu.marks || null,
          assessments: stu.assessments || null,
          status: stu.status || 'active'
        }));
        setStudents(normalized);
        setFilteredStudents(normalized);
        console.log('Students refreshed:', normalized.length);
      } else {
        toast.error(result.error || 'Failed to load students');
      }
    } catch (err) {
      console.error('Refresh failed:', err);
      toast.error(err.message || 'Network error while loading students');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('user');
      localStorage.removeItem('schoolId');
      toast.success("Logged out successfully");
      window.location.href = '/login';
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };
  
  const handleAddStudent = async (newStudentData) => {
    try {
      const result = await StudentApi.createStudent(newStudentData);
      if (result.success) {
        toast.success('Student added successfully!');
        await refreshStudents();
        if (enabledTabs.includes('allStudents')) {
          setActiveTab('allStudents');
        }
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
        await refreshStudents();
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
    await refreshStudents();
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshStudents();
    toast.info('Student list refreshed');
  };

  // Don't render if no tabs are enabled
  if (!loading && enabledTabs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No Tabs Available</h2>
          <p className="text-gray-500">Please contact administrator to enable dashboard access.</p>
          <button
            onClick={handleLogout}
            className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header - Same as Dashboard.jsx */}
      <header className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-600 shadow-lg">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Raynott Edupot</h1>
            <p className="text-amber-100">School Fee Management System</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="font-semibold text-lg text-white">Welcome, {user?.name || user?.email}</p>
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

      {/* Navigation Tabs - Dynamic based on enabledTabs */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="px-6">
          <nav className="flex space-x-8 overflow-x-auto scrollbar-hide">
            {enabledTabs.map((tabId) => {
              const TabIcon = TAB_CONFIG[tabId]?.icon;
              return (
                <button
                  key={tabId}
                  onClick={() => setActiveTab(tabId)}
                  className={`px-4 py-4 font-medium text-sm transition-all relative whitespace-nowrap ${
                    activeTab === tabId
                      ? 'text-amber-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {TabIcon && <TabIcon size={18} />}
                    <span>{TAB_CONFIG[tabId]?.name || tabId}</span>
                  </div>
                  {activeTab === tabId && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600"></div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content - Same structure as Dashboard.jsx */}
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
            onUpdateStudent={handleUpdateStudent}
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
        ) : activeTab === 'assessments' ? (
          <AssessmentTab
            students={students}
            onUpdateStudent={handleUpdateStudent}
          />
        ) : (
          <AllStudents
            students={students}
            onViewDetails={setSelectedStudent}
            onDelete={handleDeleteStudent}
            onUpdateStudent={handleUpdateStudent}
            onRefresh={handleRefresh}
            isLoading={isLoading || refreshing}
          />
        )}
      </div>

      {/* CSS for highlighting new students and hiding scrollbar */}
      <style jsx>{`
        .highlight-new-student {
          animation: highlight 3s ease-out;
        }
        
        @keyframes highlight {
          0% { background-color: rgba(251, 191, 36, 0.2); }
          100% { background-color: transparent; }
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
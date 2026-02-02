// src/components/dashboard/StudentDetails.jsx
import React, { useState } from 'react';
import { CreditCard, Award } from 'lucide-react';
import FeesInstallment from './FeesInstallment';
import Marks from './Marks';

const StudentDetails = ({ student, onClose, onUpdateStudent }) => {
  const [activeTab, setActiveTab] = useState('fees');
  const [currentStudent, setCurrentStudent] = useState(student);

  const handleStudentUpdate = (updatedStudent) => {
    setCurrentStudent(updatedStudent);
    onUpdateStudent(updatedStudent);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{currentStudent.basicInfo.name} - Details</h2>
              <p className="text-gray-600">Complete student information</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Tabs for Student Details */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('fees')}
                className={`px-4 py-3 font-medium text-sm transition-all relative ${activeTab === 'fees' 
                  ? 'text-amber-600 border-b-2 border-amber-600' 
                  : 'text-gray-500 hover:text-gray-700'}`}
              >
                <div className="flex items-center space-x-2">
                  <CreditCard size={18} />
                  <span>Fee & Installments</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('marks')}
                className={`px-4 py-3 font-medium text-sm transition-all relative ${activeTab === 'marks' 
                  ? 'text-amber-600 border-b-2 border-amber-600' 
                  : 'text-gray-500 hover:text-gray-700'}`}
              >
                <div className="flex items-center space-x-2">
                  <Award size={18} />
                  <span>Academic Marks</span>
                </div>
              </button>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Fees & Installments Section */}
            {activeTab === 'fees' && (
              <FeesInstallment
                student={currentStudent}
                onUpdateStudent={handleStudentUpdate}
              />
            )}

            {/* Academic Marks Section */}
            {activeTab === 'marks' && (
              <Marks
                student={currentStudent}
                onUpdateStudent={handleStudentUpdate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
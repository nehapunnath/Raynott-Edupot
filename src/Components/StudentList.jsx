// src/components/dashboard/StudentList.jsx
import React, { useState } from 'react';
import { Users, UserPlus, Eye, Trash2 } from 'lucide-react';
import StudentCard from './StudentCard';
import SearchSection from './SearchSection';

const StudentList = ({ 
  students, 
  onSelectStudent, 
  onDeleteStudent, 
  onSearch, 
  onClearSearch,
  onAddNew 
}) => {
  const [searchCriteria, setSearchCriteria] = useState({
    name: '',
    dob: '',
    grade: '',
    fatherName: '',
    motherName: '',
    aadhar: ''
  });

  const handleSearch = () => {
    onSearch(searchCriteria);
  };

  const handleClear = () => {
    setSearchCriteria({
      name: '',
      dob: '',
      grade: '',
      fatherName: '',
      motherName: '',
      aadhar: ''
    });
    onClearSearch();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Students Management</h2>
            <p className="text-gray-600">Total {students.length} students registered</p>
          </div>
          <button
            onClick={onAddNew}
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-medium hover:from-amber-700 hover:to-amber-800 flex items-center space-x-2"
          >
            <UserPlus size={20} />
            <span>Add New Student</span>
          </button>
        </div>

        {/* Search Section */}
        <SearchSection
          searchCriteria={searchCriteria}
          onCriteriaChange={setSearchCriteria}
          onSearch={handleSearch}
          onClear={handleClear}
        />

        {/* Students List */}
        {students.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="text-amber-600" size={48} />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Students Found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search criteria or add a new student</p>
            <button
              onClick={onAddNew}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-medium hover:from-amber-700 hover:to-amber-800"
            >
              Add New Student
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {students.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onViewDetails={() => onSelectStudent(student)}
                onDelete={() => onDeleteStudent(student.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;
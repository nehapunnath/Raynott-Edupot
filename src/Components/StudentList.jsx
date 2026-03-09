import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Loader2 } from 'lucide-react';
import StudentCard from './StudentCard';
import SearchSection from './SearchSection';
import StudentApi from '../service/StudentApi'; // Adjust path as needed

const StudentList = ({
  students: initialStudents = [],
  onSelectStudent,
  onDeleteStudent,
  onAddNew,
  onUpdateStudent // optional
}) => {
  const [allStudents, setAllStudents] = useState(initialStudents);
  const [displayedStudents, setDisplayedStudents] = useState(initialStudents);
  const [searchCriteria, setSearchCriteria] = useState({
    name: '',
    admissionNo: '',
    grade: '',
    section: '',
    fatherName: '',
    motherName: ''
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    setAllStudents(initialStudents);
    if (!isSearching) {
      setDisplayedStudents(initialStudents);
    }
  }, [initialStudents]);

  const handleSearch = async () => {
    const hasAnyCriteria = Object.values(searchCriteria).some(
      val => val && String(val).trim() !== ''
    );

    if (!hasAnyCriteria) {
      setDisplayedStudents(allStudents);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    const response = await StudentApi.searchStudents(searchCriteria);

    if (response.success) {
      setDisplayedStudents(response.students || []);
    } else {
      setSearchError(response.error || 'Search failed');
      setDisplayedStudents([]);
    }

    setIsSearching(false);
  };

  const handleClear = () => {
    setSearchCriteria({
      name: '',
      admissionNo: '',
      grade: '',
      section: '',
      fatherName: '',
      motherName: ''
    });
    setDisplayedStudents(allStudents);
    setSearchError(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Students Management</h2>
            <p className="text-gray-600">
              {isSearching
                ? `Found ${displayedStudents.length} matching student${displayedStudents.length !== 1 ? 's' : ''}`
                : `Total ${allStudents.length} students registered`}
            </p>
          </div>

          <button
            onClick={onAddNew}
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-medium hover:from-amber-700 hover:to-amber-800 flex items-center space-x-2 disabled:opacity-50"
            disabled={isSearching}
          >
            <UserPlus size={20} />
            <span>Add New Student</span>
          </button>
        </div>

        <SearchSection
          searchCriteria={searchCriteria}
          onCriteriaChange={setSearchCriteria}
          onSearch={handleSearch}
          onClear={handleClear}
          isSearching={isSearching}
        />

        {searchError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {searchError}
          </div>
        )}

        {displayedStudents.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="text-amber-600" size={48} />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {isSearching ? "No matching students found" : "No students registered yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {isSearching
                ? "Try different search terms or clear the filters"
                : "Add your first student to get started"}
            </p>
            <button
              onClick={onAddNew}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-medium hover:from-amber-700 hover:to-amber-800"
            >
              Add New Student
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {displayedStudents.map((student) => (
              <StudentCard
                key={student.studentId}
                student={student}
                onViewDetails={() => onSelectStudent?.(student)}
                onDelete={(studentId) => onDeleteStudent?.(studentId)}
                onUpdateStudent={(updated) => {
                  if (onUpdateStudent) {
                    onUpdateStudent(updated);
                  }
                  // Optional: also update local lists
                  setAllStudents(prev => prev.map(s => s.studentId === updated.studentId ? updated : s));
                  setDisplayedStudents(prev => prev.map(s => s.studentId === updated.studentId ? updated : s));
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;
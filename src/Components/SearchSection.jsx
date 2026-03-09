// src/components/dashboard/components/SearchSection.jsx
import React from 'react';
import { Search, Calendar, X, Loader2 } from 'lucide-react';

const SearchSection = ({
  searchCriteria,
  onCriteriaChange,
  onSearch,
  onClear,
  isSearching = false
}) => {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-6 mb-8 border border-amber-200">
      <div className="flex items-center space-x-3 mb-4">
        <Search className="text-amber-600" size={24} />
        <h3 className="text-lg font-semibold text-gray-800">Find Student</h3>
      </div>
      <p className="text-gray-600 mb-6">Enter student details to search</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Student Name</label>
          <input
            type="text"
            value={searchCriteria.name || ''}
            onChange={(e) => onCriteriaChange({ ...searchCriteria, name: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="Enter student name"
            disabled={isSearching}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Admission No</label>
          <input
            type="text"
            value={searchCriteria.admissionNo || ''}
            onChange={(e) => onCriteriaChange({ ...searchCriteria, admissionNo: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="Enter admission number"
            disabled={isSearching}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Class/Grade</label>
          <select
            value={searchCriteria.grade || ''}
            onChange={(e) => onCriteriaChange({ ...searchCriteria, grade: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            disabled={isSearching}
          >
            <option value="">All Grades</option>
            <option value="Nursery">Nursery</option>
            <option value="LKG">LKG</option>
            <option value="UKG">UKG</option>
            {Array.from({ length: 12 }, (_, i) => (i + 1).toString()).map(grade => (
              <option key={grade} value={grade}>Grade {grade}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
          <input
            type="text"
            value={searchCriteria.section || ''}
            onChange={(e) => onCriteriaChange({ ...searchCriteria, section: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="Enter section (A, B, etc.)"
            disabled={isSearching}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Father's Name</label>
          <input
            type="text"
            value={searchCriteria.fatherName || ''}
            onChange={(e) => onCriteriaChange({ ...searchCriteria, fatherName: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="Enter father's name"
            disabled={isSearching}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Name</label>
          <input
            type="text"
            value={searchCriteria.motherName || ''}
            onChange={(e) => onCriteriaChange({ ...searchCriteria, motherName: e.target.value })}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="Enter mother's name"
            disabled={isSearching}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-amber-300/50">
        <button
          onClick={onClear}
          disabled={isSearching}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 flex items-center space-x-2 disabled:opacity-50"
        >
          <X size={20} />
          <span>Clear All</span>
        </button>

        <button
          onClick={onSearch}
          disabled={isSearching}
          className={`px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-medium hover:from-amber-700 hover:to-amber-800 flex items-center space-x-2 min-w-[160px] justify-center ${
            isSearching ? 'opacity-70 cursor-wait' : ''
          }`}
        >
          {isSearching ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Search size={20} />
              <span>Search Student</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SearchSection;
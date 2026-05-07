// src/components/dashboard/components/ClassSectionView.jsx
import React from 'react';
import { School, Users, DollarSign, Eye, ChevronRight } from 'lucide-react';

const ClassSectionView = ({ groups, onClassClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {groups.map((group) => {
        const progress = group.totalFees > 0 ? Math.round((group.totalPaid / group.totalFees) * 100) : 0;
        
        return (
          <div 
            key={`${group.grade}-${group.section}`}
            onClick={() => onClassClick(group.grade, group.section, group.students)}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-amber-50 to-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl">
                    <School size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Grade {group.grade}
                    </h3>
                    <p className="text-sm text-gray-600">Section {group.section}</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-400 group-hover:text-amber-600 transition-colors" size={24} />
              </div>
            </div>
            
            {/* Card Content */}
            <div className="p-6 space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users size={18} className="text-amber-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{group.studentCount}</p>
                  <p className="text-xs text-gray-500">Total Students</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign size={18} className="text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{progress}%</p>
                  <p className="text-xs text-gray-500">Collection Rate</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Fee Collection</span>
                  <span className="font-medium text-amber-700">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-amber-600 h-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Financial Summary */}
              <div className="pt-3 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Fees:</span>
                  <span className="font-semibold text-gray-800">₹{group.totalFees.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Collected:</span>
                  <span className="font-semibold text-green-600">₹{group.totalPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Pending:</span>
                  <span className="font-semibold text-red-600">₹{(group.totalFees - group.totalPaid).toLocaleString()}</span>
                </div>
              </div>

              {/* View Button */}
              <button 
                className="w-full mt-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center space-x-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onClassClick(group.grade, group.section, group.students);
                }}
              >
                <Eye size={16} />
                <span>View Students</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ClassSectionView;
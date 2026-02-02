// src/components/dashboard/components/StudentCard.jsx
import React from 'react';
import { Eye, Trash2, CreditCard, Award } from 'lucide-react';

const StudentCard = ({ student, onViewDetails, onDelete }) => {
  const totalFees = student.feeStructure.total;
  const paidAmount = student.totalPaid;
  const pendingAmount = student.pendingAmount;
  const progress = totalFees > 0 ? Math.round((paidAmount / totalFees) * 100) : 0;
  
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
      {/* Student Header */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {student.basicInfo.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{student.basicInfo.name}</h3>
                <p className="text-gray-600 text-sm">
                  {student.basicInfo.grade}-{student.basicInfo.section} • Aadhar: {student.basicInfo.aadhar}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-600">Father</p>
                <p className="font-medium">{student.basicInfo.fatherName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mother</p>
                <p className="font-medium">{student.basicInfo.motherName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">DOB</p>
                <p className="font-medium">{student.basicInfo.dob}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{student.basicInfo.fatherPhone}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onViewDetails}
              className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 flex items-center space-x-2"
            >
              <Eye size={16} />
              <span>View Details</span>
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Student"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Student Summary */}
      <div className="p-6">
        {/* Fee Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Fees</p>
            <p className="text-2xl font-bold text-amber-700">₹ {totalFees.toLocaleString()}</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Paid Amount</p>
            <p className="text-2xl font-bold text-green-700">₹ {paidAmount.toLocaleString()}</p>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-red-700">₹ {pendingAmount.toLocaleString()}</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Progress</p>
            <div className="relative pt-2">
              <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
                <div 
                  style={{ width: `${progress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-amber-500 to-amber-600"
                ></div>
              </div>
              <p className="text-2xl font-bold text-blue-700 mt-2">{progress}%</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={onViewDetails}
            className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 flex items-center space-x-2"
          >
            <CreditCard size={16} />
            <span>Manage Fees</span>
          </button>
          <button
            onClick={onViewDetails}
            className="px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 flex items-center space-x-2"
          >
            <Award size={16} />
            <span>Manage Marks</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
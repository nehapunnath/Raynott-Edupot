import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  Phone, 
  MapPin, 
  BookOpen, 
  Shirt,
  GraduationCap,
  CreditCard,
  Calculator,
  Save,
  X
} from 'lucide-react';

const AddStudent = ({ onAddStudent, onCancel }) => {
  const [newStudent, setNewStudent] = useState({
    basicInfo: {
      name: '',
      dob: '',
      aadhar: '',
      fatherName: '',
      motherName: '',
      fatherPhone: '',
      motherPhone: '',
      address: '',
      grade: '',
      section: '',
      admissionNo: '',
      admissionDate: new Date().toISOString().split('T')[0]
    },
    feeStructure: {
      tuition: 0,
      books: 0,
      uniform: 0,
      transport: 0,
      other: 0,
      total: 0,
      includesBooks: false,
      includesUniform: false,
      includesTransport: false
    }
  });

  const calculateTotalFees = () => {
    let total = parseInt(newStudent.feeStructure.tuition) || 0;
    if (newStudent.feeStructure.includesBooks) {
      total += parseInt(newStudent.feeStructure.books) || 0;
    }
    if (newStudent.feeStructure.includesUniform) {
      total += parseInt(newStudent.feeStructure.uniform) || 0;
    }
    if (newStudent.feeStructure.includesTransport) {
      total += parseInt(newStudent.feeStructure.transport) || 0;
    }
    total += parseInt(newStudent.feeStructure.other) || 0;
    return total;
  };

  const handleBasicInfoChange = (field, value) => {
    setNewStudent(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        [field]: value
      }
    }));
    
    if (field === 'grade') {
      const gradeFees = {
        'Nursery': 15000,
        'LKG': 18000,
        'UKG': 20000,
        '1': 22000,
        '2': 23000,
        '3': 24000,
        '4': 25000,
        '5': 26000,
        '6': 28000,
        '7': 30000,
        '8': 32000,
        '9': 35000,
        '10': 40000,
        '11': 45000,
        '12': 50000
      };
      const tuition = gradeFees[value] || 25000;
      handleFeeChange('tuition', tuition);
    }
  };

  const handleFeeChange = (field, value) => {
    const updatedFees = {
      ...newStudent.feeStructure,
      [field]: value
    };
    
    updatedFees.total = calculateTotalFees();
    
    setNewStudent(prev => ({
      ...prev,
      feeStructure: updatedFees
    }));
  };

  const handleSubmit = () => {
    const totalFees = calculateTotalFees();
    const installments = [
      { 
        id: Date.now() + 1, 
        number: 1, 
        amount: Math.round(totalFees / 3), 
        paid: 0, 
        dueDate: '', 
        paidDate: '', 
        status: 'pending',
        paymentMode: ''
      },
      { 
        id: Date.now() + 2, 
        number: 2, 
        amount: Math.round(totalFees / 3), 
        paid: 0, 
        dueDate: '', 
        paidDate: '', 
        status: 'pending',
        paymentMode: ''
      },
      { 
        id: Date.now() + 3, 
        number: 3, 
        amount: Math.round(totalFees / 3), 
        paid: 0, 
        dueDate: '', 
        paidDate: '', 
        status: 'pending',
        paymentMode: ''
      }
    ];

    const student = {
      id: Date.now(),
      basicInfo: { ...newStudent.basicInfo },
      feeStructure: {
        ...newStudent.feeStructure,
        total: totalFees
      },
      installments,
      marks: {
        exams: [],
        totalMarks: 0,
        averagePercentage: 0,
        overallGrade: ''
      },
      totalPaid: 0,
      pendingAmount: totalFees,
      status: 'active'
    };

    onAddStudent(student);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Add New Student</h2>
            <p className="text-gray-600">Enter student details to register new admission</p>
          </div>
          <button
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 flex items-center space-x-2"
          >
            <X size={20} />
            <span>Cancel</span>
          </button>
        </div>

        <div className="space-y-8">
          {/* Basic Information Section */}
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
            <div className="flex items-center space-x-3 mb-6">
              <User className="text-amber-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newStudent.basicInfo.name}
                  onChange={(e) => handleBasicInfoChange('name', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter student name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  <input
                    type="date"
                    value={newStudent.basicInfo.dob}
                    onChange={(e) => handleBasicInfoChange('dob', e.target.value)}
                    className="w-full pl-10 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
              {/* Add more basic info fields similarly... */}
            </div>
          </div>

          {/* Fee Structure Section */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center space-x-3 mb-6">
              <CreditCard className="text-blue-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Fee Structure</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tuition Fee
                </label>
                <input
                  type="number"
                  value={newStudent.feeStructure.tuition}
                  onChange={(e) => handleFeeChange('tuition', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              {/* Add more fee fields similarly... */}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-medium hover:from-amber-700 hover:to-amber-800 flex items-center space-x-2"
            >
              <Save size={20} />
              <span>Save Student</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
// src/components/dashboard/Dashboard.jsx
import React, { useState } from 'react';
import { LogOut, UserPlus, Calendar, Phone, BookOpen, Shirt } from 'lucide-react';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('addStudent');
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    id: Date.now(),
    childName: '',
    dob: '',
    fatherName: '',
    motherName: '',
    phoneNumber: '',
    address: '',
    grade: '',
    academicYear: new Date().getFullYear(),
    totalFees: 0,
    includesBooks: false,
    booksAmount: 0,
    includesUniform: false,
    uniformAmount: 0,
    installments: []
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? Number(value) : value
    }));
  };

  const addStudent = (e) => {
    e.preventDefault();
    const newStudent = {
      ...formData,
      id: Date.now(),
      totalFees: calculateTotalFees(),
      remainingFees: calculateTotalFees()
    };
    
    setStudents([...students, newStudent]);
    setFormData({
      id: Date.now(),
      childName: '',
      dob: '',
      fatherName: '',
      motherName: '',
      phoneNumber: '',
      address: '',
      grade: '',
      academicYear: new Date().getFullYear(),
      totalFees: 0,
      includesBooks: false,
      booksAmount: 0,
      includesUniform: false,
      uniformAmount: 0,
      installments: []
    });
    setActiveTab('viewStudents');
  };

  const calculateTotalFees = () => {
    let total = 0;
    
    // Base tuition fee based on grade
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
      '10': 40000
    };
    
    total = gradeFees[formData.grade] || 20000;
    
    if (formData.includesBooks) {
      total += formData.booksAmount;
    }
    
    if (formData.includesUniform) {
      total += formData.uniformAmount;
    }
    
    return total;
  };

  const addInstallment = (studentId) => {
    const installment = {
      id: Date.now(),
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      type: 'installment',
      description: `Installment ${students.find(s => s.id === studentId).installments.length + 1}`
    };
    
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, installments: [...student.installments, installment] }
        : student
    ));
  };

  const updateInstallment = (studentId, installmentId, field, value) => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        const updatedInstallments = student.installments.map(inst => 
          inst.id === installmentId 
            ? { ...inst, [field]: field === 'amount' ? Number(value) : value }
            : inst
        );
        
        const paidAmount = updatedInstallments.reduce((sum, inst) => sum + (inst.amount || 0), 0);
        
        return {
          ...student,
          installments: updatedInstallments,
          paidAmount,
          remainingFees: student.totalFees - paidAmount
        };
      }
      return student;
    }));
  };

  const deleteInstallment = (studentId, installmentId) => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        const updatedInstallments = student.installments.filter(inst => inst.id !== installmentId);
        const paidAmount = updatedInstallments.reduce((sum, inst) => sum + (inst.amount || 0), 0);
        
        return {
          ...student,
          installments: updatedInstallments,
          paidAmount,
          remainingFees: student.totalFees - paidAmount
        };
      }
      return student;
    }));
  };

  const deleteStudent = (studentId) => {
    setStudents(students.filter(student => student.id !== studentId));
  };

  const calculatePaidAmount = (installments) => {
    return installments.reduce((sum, inst) => sum + (inst.amount || 0), 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Raynott Edupot</h1>
            <p className="text-blue-100">School Fee Management System</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="font-semibold text-lg">Welcome, {user?.name}</p>
              <p className="text-sm text-blue-200">{user?.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 backdrop-blur-sm"
            >
              <LogOut size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-6">
          <nav className="flex space-x-1">
            <button
              onClick={() => setActiveTab('addStudent')}
              className={`px-6 py-4 font-medium text-sm transition-all ${activeTab === 'addStudent' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center space-x-2">
                <UserPlus size={18} />
                <span>Add Student</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('viewStudents')}
              className={`px-6 py-4 font-medium text-sm transition-all ${activeTab === 'viewStudents' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>View Students ({students.length})</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {activeTab === 'addStudent' ? (
          <div className="max-w-6xl mx-auto">
            {/* Student Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Add New Student</h2>
              <p className="text-gray-600 mb-8">Enter student details and configure fee structure</p>

              <form onSubmit={addStudent}>
                {/* Basic Information */}
                <div className="mb-10">
                  <h3 className="text-lg font-semibold text-gray-700 mb-6 pb-3 border-b">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Child's Name *
                      </label>
                      <input
                        type="text"
                        name="childName"
                        value={formData.childName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter child's full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleInputChange}
                          className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Grade/Class *
                      </label>
                      <select
                        name="grade"
                        value={formData.grade}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Grade</option>
                        <option value="Nursery">Nursery</option>
                        <option value="LKG">LKG</option>
                        <option value="UKG">UKG</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <option key={num} value={num.toString()}>Grade {num}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Father's Name *
                      </label>
                      <input
                        type="text"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter father's name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mother's Name *
                      </label>
                      <input
                        type="text"
                        name="motherName"
                        value={formData.motherName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter mother's name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter phone number"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fee Configuration */}
                <div className="mb-10">
                  <h3 className="text-lg font-semibold text-gray-700 mb-6 pb-3 border-b">Fee Configuration</h3>
                  
                  {/* Additional Fee Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Books Fee */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <BookOpen className="text-blue-600" size={24} />
                          </div>
                          <div>
                            <h4 className="font-semibold">Books Fee</h4>
                            <p className="text-sm text-gray-500">Include books fee in total</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="includesBooks"
                            checked={formData.includesBooks}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      {formData.includesBooks && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Books Amount (₹)
                          </label>
                          <input
                            type="number"
                            name="booksAmount"
                            value={formData.booksAmount}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter books fee amount"
                          />
                        </div>
                      )}
                    </div>

                    {/* Uniform Fee */}
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Shirt className="text-green-600" size={24} />
                          </div>
                          <div>
                            <h4 className="font-semibold">Uniform Fee</h4>
                            <p className="text-sm text-gray-500">Include uniform fee in total</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="includesUniform"
                            checked={formData.includesUniform}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                      
                      {formData.includesUniform && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Uniform Amount (₹)
                          </label>
                          <input
                            type="number"
                            name="uniformAmount"
                            value={formData.uniformAmount}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter uniform fee amount"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Fee Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-gray-800 mb-4">Fee Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500">Tuition Fee</p>
                        <p className="text-2xl font-bold text-blue-600">
                          ₹ {gradeFees[formData.grade] || 0}
                        </p>
                      </div>
                      
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500">Books Fee</p>
                        <p className="text-2xl font-bold text-blue-600">
                          ₹ {formData.includesBooks ? formData.booksAmount : 0}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formData.includesBooks ? 'Included' : 'Not Included'}
                        </p>
                      </div>
                      
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <p className="text-sm text-gray-500">Uniform Fee</p>
                        <p className="text-2xl font-bold text-blue-600">
                          ₹ {formData.includesUniform ? formData.uniformAmount : 0}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formData.includesUniform ? 'Included' : 'Not Included'}
                        </p>
                      </div>
                      
                      <div className="text-center p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg">
                        <p className="text-sm">Total Fees</p>
                        <p className="text-2xl font-bold">
                          ₹ {calculateTotalFees().toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setActiveTab('viewStudents')}
                    className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    Save Student & Continue
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* View Students Section */
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Students List</h2>
                  <p className="text-gray-600">Total {students.length} students registered</p>
                </div>
                <button
                  onClick={() => setActiveTab('addStudent')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 flex items-center space-x-2"
                >
                  <UserPlus size={20} />
                  <span>Add New Student</span>
                </button>
              </div>

              {students.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <UserPlus className="text-gray-400" size={48} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Students Added</h3>
                  <p className="text-gray-500 mb-6">Add your first student to start managing fees</p>
                  <button
                    onClick={() => setActiveTab('addStudent')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                  >
                    Add First Student
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {students.map((student) => {
                    const paidAmount = calculatePaidAmount(student.installments);
                    const remainingFees = student.totalFees - paidAmount;
                    
                    return (
                      <div key={student.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                        {/* Student Header */}
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-bold text-gray-800">{student.childName}</h3>
                              <div className="flex flex-wrap gap-4 mt-2">
                                <span className="text-sm text-gray-600">Grade: {student.grade}</span>
                                <span className="text-sm text-gray-600">DOB: {student.dob}</span>
                                <span className="text-sm text-gray-600">Father: {student.fatherName}</span>
                                <span className="text-sm text-gray-600">Phone: {student.phoneNumber}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => deleteStudent(student.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Fee Summary */}
                        <div className="p-6 bg-white">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                              <p className="text-sm text-gray-600">Total Fees</p>
                              <p className="text-2xl font-bold text-blue-700">₹ {student.totalFees.toLocaleString()}</p>
                            </div>
                            
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                              <p className="text-sm text-gray-600">Paid Amount</p>
                              <p className="text-2xl font-bold text-green-700">₹ {paidAmount.toLocaleString()}</p>
                            </div>
                            
                            <div className="text-center p-4 bg-red-50 rounded-lg">
                              <p className="text-sm text-gray-600">Remaining</p>
                              <p className="text-2xl font-bold text-red-700">₹ {remainingFees.toLocaleString()}</p>
                            </div>
                            
                            <div className="text-center p-4 bg-yellow-50 rounded-lg">
                              <p className="text-sm text-gray-600">Progress</p>
                              <p className="text-2xl font-bold text-yellow-700">
                                {student.totalFees > 0 ? Math.round((paidAmount / student.totalFees) * 100) : 0}%
                              </p>
                            </div>
                          </div>

                          {/* Fee Components */}
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-700 mb-3">Fee Breakdown</h4>
                            <div className="flex flex-wrap gap-3">
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                Tuition Fee: ₹ {gradeFees[student.grade] || 20000}
                              </span>
                              {student.includesBooks && (
                                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                                  Books: ₹ {student.booksAmount}
                                </span>
                              )}
                              {student.includesUniform && (
                                <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">
                                  Uniform: ₹ {student.uniformAmount}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Installments Management */}
                          <div>
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-semibold text-gray-700">Installments</h4>
                              <button
                                onClick={() => addInstallment(student.id)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                              >
                                + Add Installment
                              </button>
                            </div>

                            <div className="space-y-3">
                              {student.installments.map((installment, index) => (
                                <div key={installment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center space-x-4">
                                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                      {index + 1}
                                    </div>
                                    <div>
                                      <p className="font-medium">{installment.description}</p>
                                      <p className="text-sm text-gray-500">Date: {installment.date}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-4">
                                    <div>
                                      <input
                                        type="number"
                                        value={installment.amount}
                                        onChange={(e) => updateInstallment(student.id, installment.id, 'amount', e.target.value)}
                                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-right"
                                        placeholder="Amount"
                                      />
                                    </div>
                                    <button
                                      onClick={() => deleteInstallment(student.id, installment.id)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Grade-wise fee structure
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
  '10': 40000
};

export default Dashboard;
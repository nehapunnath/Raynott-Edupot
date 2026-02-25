// src/components/dashboard/StudentCard.jsx
import React, { useState } from 'react';
import { Eye, Trash2, Download, User, Phone, Mail, Calendar, MapPin, Droplet, Hash, FileDigit, X, Edit2, Save, AlertCircle } from 'lucide-react';
import FeesInstallment from './FeesInstallment';
import Marks from './Marks';

const StudentCard = ({ student, onDelete, onUpdateStudent }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState(student);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Calculate fee summary
  const totalFees = student.feeStructure?.total || 0;
  const paidAmount = student.totalPaid || 0;
  const pendingAmount = student.pendingAmount || 0;
  const progress = totalFees > 0 ? Math.round((paidAmount / totalFees) * 100) : 0;

  const handleDownloadJSON = () => {
    const studentData = {
      student: {
        basicInfo: student.basicInfo,
        feeSummary: {
          totalFees,
          paidAmount,
          pendingAmount,
          progress: `${progress}%`
        },
        installments: student.installments || [],
        marks: student.marks || [],
        timestamp: new Date().toISOString()
      }
    };
    const jsonString = JSON.stringify(studentData, null, 2);
    downloadFile(jsonString, 'application/json', `student_${student.basicInfo.admissionNo}.json`);
    setShowDownloadOptions(false);
  };

  const handleDownloadText = () => {
    const marksText = student.marks?.map(mark =>
      `${mark.examName} (${mark.subject}): ${mark.marksObtained}/${mark.totalMarks}`
    ).join('\n') || 'No marks available';

    const textContent = `
STUDENT INFORMATION
====================
Name: ${student.basicInfo.name}
Date of Birth: ${student.basicInfo.dob}
Grade: ${student.basicInfo.grade}
Section: ${student.basicInfo.section}
Admission No: ${student.basicInfo.admissionNo}
Blood Group: ${student.basicInfo.bloodGroup || 'Not specified'}

PARENT INFORMATION
==================
Father: ${student.basicInfo.fatherName} (${student.basicInfo.fatherPhone})
Mother: ${student.basicInfo.motherName} (${student.basicInfo.motherPhone})
Address: ${student.basicInfo.address}, ${student.basicInfo.city}

FEE SUMMARY
============
Total Fees: ₹${totalFees.toLocaleString()}
Paid Amount: ₹${paidAmount.toLocaleString()}
Pending Amount: ₹${pendingAmount.toLocaleString()}
Payment Progress: ${progress}%

ACADEMIC MARKS
===============
${marksText}

Generated on: ${new Date().toLocaleString()}
    `.trim();
    downloadFile(textContent, 'text/plain', `student_${student.basicInfo.admissionNo}.txt`);
    setShowDownloadOptions(false);
  };

  const handleDownloadCSV = () => {
    const csvContent = [
      ['Field', 'Value'],
      ['Student Name', student.basicInfo.name],
      ['Grade', student.basicInfo.grade],
      ['Section', student.basicInfo.section],
      ['Admission No', student.basicInfo.admissionNo],
      ['Father Name', student.basicInfo.fatherName],
      ['Father Phone', student.basicInfo.fatherPhone],
      ['Mother Name', student.basicInfo.motherName],
      ['Mother Phone', student.basicInfo.motherPhone],
      ['Total Fees', totalFees],
      ['Paid Amount', paidAmount],
      ['Pending Amount', pendingAmount],
      ['Progress', `${progress}%`],
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    downloadFile(csvContent, 'text/csv', `student_${student.basicInfo.admissionNo}.csv`);
    setShowDownloadOptions(false);
  };

  const downloadFile = (content, mimeType, filename) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleViewDetails = () => {
    setShowDetails(true);
    setEditedStudent(student); // Reset edited student when opening
    setIsEditing(false);
    setActiveTab('info'); // Always start with info tab
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setActiveTab('info');
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // If we're canceling edit, reset to original student data
      setEditedStudent(student);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (section, field, value) => {
    setEditedStudent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleParentInputChange = (parent, field, value) => {
    const fieldName = parent === 'father' ? `father${field}` : `mother${field}`;
    setEditedStudent(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        [fieldName]: value
      }
    }));
  };

  const handleSaveChanges = () => {
    onUpdateStudent(editedStudent);
    setIsEditing(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Turn off editing mode when switching tabs
    if (isEditing) {
      setIsEditing(false);
      setEditedStudent(student);
    }
  };

  // Form field component for editing
  const EditableField = ({ label, value, onChange, type = 'text', className = '' }) => (
    <div className={className}>
      <p className="text-xs text-gray-500">{label}</p>
      {isEditing ? (
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      ) : (
        <p className="font-medium">{value || 'N/A'}</p>
      )}
    </div>
  );

  return (
    <>
      {/* Compact List Item */}
      <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
        <div className="p-4 flex items-center justify-between">
          {/* Student Info - Compact */}
          <div className="flex items-center space-x-4 flex-1">
            {/* Avatar with initial */}
            <div className="w-10 h-10 bg-gradient-to-r from-amber-600 to-amber-700 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">
                {student.basicInfo.name.charAt(0)}
              </span>
            </div>

            {/* Basic Details */}
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h3 className="font-semibold text-gray-800">{student.basicInfo.name}</h3>
                {student.basicInfo.bloodGroup && (
                  <span className="text-xs px-2 py-0.5 bg-red-100 text-red-800 rounded-full flex items-center">
                    <Droplet size={10} className="mr-1" />
                    {student.basicInfo.bloodGroup}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <span className="flex items-center">
                  <Hash size={12} className="mr-1" />
                  {student.basicInfo.admissionNo}
                </span>
                <span className="flex items-center">
                  <User size={12} className="mr-1" />
                  Grade {student.basicInfo.grade}-{student.basicInfo.section}
                </span>
                <span className="flex items-center">
                  <Phone size={12} className="mr-1" />
                  {student.basicInfo.fatherPhone}
                </span>
              </div>
            </div>

            {/* Fee Progress Bar - Compact */}
            <div className="w-48">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Fee Progress</span>
                <span className="font-medium text-amber-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-amber-500 to-amber-600 h-1.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 ml-4">
            {/* Download Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Download"
              >
                <Download size={18} />
              </button>

              {showDownloadOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    <button
                      onClick={handleDownloadJSON}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <FileDigit size={14} />
                      <span>JSON</span>
                    </button>
                    <button
                      onClick={handleDownloadText}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <FileDigit size={14} />
                      <span>Text</span>
                    </button>
                    <button
                      onClick={handleDownloadCSV}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Hash size={14} />
                      <span>CSV</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleViewDetails}
              className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye size={18} />
            </button>

            <button
              onClick={() => onDelete(student.basicInfo.admissionNo)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Student Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header with Edit Button - Only visible in Info tab */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {isEditing ? 'Edit Student Information' : student.basicInfo.name}
                  </h2>
                  <p className="text-gray-600">
                    Admission No: {student.basicInfo.admissionNo} • Grade {student.basicInfo.grade}-{student.basicInfo.section}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Show edit buttons only in Info tab */}

                  <button
                    onClick={handleCloseDetails}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Success Message */}
              {showSuccessMessage && (
                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
                  <AlertCircle size={18} className="mr-2" />
                  Student information updated successfully!
                </div>
              )}

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => handleTabChange('info')}
                    className={`px-4 py-3 font-medium text-sm transition-all relative ${activeTab === 'info'
                        ? 'text-amber-600 border-b-2 border-amber-600'
                        : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Student Information
                  </button>
                  <button
                    onClick={() => handleTabChange('fees')}
                    className={`px-4 py-3 font-medium text-sm transition-all relative ${activeTab === 'fees'
                        ? 'text-amber-600 border-b-2 border-amber-600'
                        : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Fee Details
                  </button>
                  <button
                    onClick={() => handleTabChange('marks')}
                    className={`px-4 py-3 font-medium text-sm transition-all relative ${activeTab === 'marks'
                        ? 'text-amber-600 border-b-2 border-amber-600'
                        : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    Academic Marks
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              {/* Tab Content */}
              <div className="mt-6">
                {activeTab === 'info' && (
                  <div className="space-y-6">
                    {/* Edit buttons at the top of Info tab */}
                    <div className="flex justify-end space-x-2 mb-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleEditToggle}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center space-x-2"
                          >
                            <X size={18} />
                            <span>Cancel</span>
                          </button>
                          <button
                            onClick={handleSaveChanges}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                          >
                            <Save size={18} />
                            <span>Save Changes</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleEditToggle}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                        >
                          <Edit2 size={18} />
                          <span>Edit Information</span>
                        </button>
                      )}
                    </div>

                    {/* Personal Information */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <User size={16} className="mr-2" />
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <EditableField
                          label="Date of Birth"
                          value={editedStudent.basicInfo.dob}
                          onChange={(value) => handleInputChange('basicInfo', 'dob', value)}
                          type="date"
                        />
                        <EditableField
                          label="Blood Group"
                          value={editedStudent.basicInfo.bloodGroup}
                          onChange={(value) => handleInputChange('basicInfo', 'bloodGroup', value)}
                        />
                        <EditableField
                          label="Student Aadhar"
                          value={editedStudent.basicInfo.studentAadhar}
                          onChange={(value) => handleInputChange('basicInfo', 'studentAadhar', value)}
                        />
                        <EditableField
                          label="Admission Date"
                          value={editedStudent.basicInfo.admissionDate}
                          onChange={(value) => handleInputChange('basicInfo', 'admissionDate', value)}
                          type="date"
                        />
                      </div>
                    </div>

                    {/* Parent Information */}
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <User size={16} className="mr-2" />
                        Parent Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Father's Details */}
                        <div className="space-y-2">
                          <p className="font-medium text-gray-700">Father's Details</p>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <EditableField
                              label="Name"
                              value={editedStudent.basicInfo.fatherName}
                              onChange={(value) => handleParentInputChange('father', 'Name', value)}
                            />
                            <EditableField
                              label="Aadhar"
                              value={editedStudent.basicInfo.fatherAadhar}
                              onChange={(value) => handleParentInputChange('father', 'Aadhar', value)}
                            />
                            <EditableField
                              label="Phone"
                              value={editedStudent.basicInfo.fatherPhone}
                              onChange={(value) => handleParentInputChange('father', 'Phone', value)}
                            />
                            <EditableField
                              label="Email"
                              value={editedStudent.basicInfo.fatherEmail}
                              onChange={(value) => handleParentInputChange('father', 'Email', value)}
                              type="email"
                            />
                            <EditableField
                              label="Occupation"
                              value={editedStudent.basicInfo.fatherOccupation}
                              onChange={(value) => handleParentInputChange('father', 'Occupation', value)}
                            />
                          </div>
                        </div>

                        {/* Mother's Details */}
                        <div className="space-y-2">
                          <p className="font-medium text-gray-700">Mother's Details</p>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <EditableField
                              label="Name"
                              value={editedStudent.basicInfo.motherName}
                              onChange={(value) => handleParentInputChange('mother', 'Name', value)}
                            />
                            <EditableField
                              label="Aadhar"
                              value={editedStudent.basicInfo.motherAadhar}
                              onChange={(value) => handleParentInputChange('mother', 'Aadhar', value)}
                            />
                            <EditableField
                              label="Phone"
                              value={editedStudent.basicInfo.motherPhone}
                              onChange={(value) => handleParentInputChange('mother', 'Phone', value)}
                            />
                            <EditableField
                              label="Email"
                              value={editedStudent.basicInfo.motherEmail}
                              onChange={(value) => handleParentInputChange('mother', 'Email', value)}
                              type="email"
                            />
                            <EditableField
                              label="Occupation"
                              value={editedStudent.basicInfo.motherOccupation}
                              onChange={(value) => handleParentInputChange('mother', 'Occupation', value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address & Emergency Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-green-50 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <MapPin size={16} className="mr-2" />
                          Address
                        </h3>
                        <div className="space-y-3">
                          <EditableField
                            label="Address"
                            value={editedStudent.basicInfo.address}
                            onChange={(value) => handleInputChange('basicInfo', 'address', value)}
                          />
                          <div className="grid grid-cols-3 gap-2">
                            <EditableField
                              label="City"
                              value={editedStudent.basicInfo.city}
                              onChange={(value) => handleInputChange('basicInfo', 'city', value)}
                            />
                            <EditableField
                              label="State"
                              value={editedStudent.basicInfo.state}
                              onChange={(value) => handleInputChange('basicInfo', 'state', value)}
                            />
                            <EditableField
                              label="Pincode"
                              value={editedStudent.basicInfo.pincode}
                              onChange={(value) => handleInputChange('basicInfo', 'pincode', value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-red-50 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <Phone size={16} className="mr-2" />
                          Emergency Contact
                        </h3>
                        <div className="space-y-3">
                          <EditableField
                            label="Contact Name"
                            value={editedStudent.basicInfo.emergencyContact}
                            onChange={(value) => handleInputChange('basicInfo', 'emergencyContact', value)}
                          />
                          <EditableField
                            label="Emergency Phone"
                            value={editedStudent.basicInfo.emergencyPhone}
                            onChange={(value) => handleInputChange('basicInfo', 'emergencyPhone', value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'fees' && (
                  <FeesInstallment
                    student={student}
                    onUpdateStudent={onUpdateStudent}
                  />
                )}

                {activeTab === 'marks' && (
                  <Marks
                    student={student}
                    onUpdateStudent={onUpdateStudent}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentCard;
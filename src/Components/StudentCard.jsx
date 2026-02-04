import React, { useState } from 'react';
import { Eye, Trash2, CreditCard, Award, Download, User, Phone, Mail, MapPin, Calendar, FileDigit, Home, School, Hash, Briefcase, Droplet } from 'lucide-react';

const StudentCard = ({ student, onViewDetails, onDelete }) => {
  const [showAllDetails, setShowAllDetails] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  
  const totalFees = student.feeStructure.total;
  const paidAmount = student.totalPaid;
  const pendingAmount = student.pendingAmount;
  const progress = totalFees > 0 ? Math.round((paidAmount / totalFees) * 100) : 0;

  const handleDownloadJSON = () => {
    const studentData = {
      student: {
        basicInfo: student.basicInfo,
        feeSummary: {
          totalFees: totalFees,
          paidAmount: paidAmount,
          pendingAmount: pendingAmount,
          progress: `${progress}%`
        },
        installments: student.installments,
        timestamp: new Date().toISOString()
      }
    };

    const jsonString = JSON.stringify(studentData, null, 2);
    downloadFile(jsonString, 'application/json', `student_${student.basicInfo.admissionNo}.json`);
    setShowDownloadOptions(false);
  };

  const handleDownloadText = () => {
    const textContent = `
STUDENT INFORMATION
====================
Name: ${student.basicInfo.name}
Date of Birth: ${student.basicInfo.dob}
Student Aadhar: ${student.basicInfo.studentAadhar}
Grade: ${student.basicInfo.grade}
Section: ${student.basicInfo.section}
Admission No: ${student.basicInfo.admissionNo}
Admission Date: ${student.basicInfo.admissionDate}
Blood Group: ${student.basicInfo.bloodGroup || 'Not specified'}
Previous School: ${student.basicInfo.previousSchool || 'Not specified'}

PARENT INFORMATION
==================
Father's Name: ${student.basicInfo.fatherName}
Father's Aadhar: ${student.basicInfo.fatherAadhar}
Father's Occupation: ${student.basicInfo.fatherOccupation || 'Not specified'}
Father's Phone: ${student.basicInfo.fatherPhone}
Father's Email: ${student.basicInfo.fatherEmail || 'Not specified'}

Mother's Name: ${student.basicInfo.motherName}
Mother's Aadhar: ${student.basicInfo.motherAadhar}
Mother's Occupation: ${student.basicInfo.motherOccupation || 'Not specified'}
Mother's Phone: ${student.basicInfo.motherPhone}
Mother's Email: ${student.basicInfo.motherEmail || 'Not specified'}

ADDRESS INFORMATION
===================
Address: ${student.basicInfo.address}
City: ${student.basicInfo.city}
State: ${student.basicInfo.state}
Pincode: ${student.basicInfo.pincode}

EMERGENCY CONTACT
=================
Contact Name: ${student.basicInfo.emergencyContact}
Emergency Phone: ${student.basicInfo.emergencyPhone}

FEE SUMMARY
============
Total Fees: ₹${totalFees.toLocaleString()}
Paid Amount: ₹${paidAmount.toLocaleString()}
Pending Amount: ₹${pendingAmount.toLocaleString()}
Payment Progress: ${progress}%

Generated on: ${new Date().toLocaleString()}
    `.trim();

    downloadFile(textContent, 'text/plain', `student_${student.basicInfo.admissionNo}.txt`);
    setShowDownloadOptions(false);
  };

  const handleDownloadCSV = () => {
    const csvContent = [
      ['Field', 'Value'],
      ['Student Name', student.basicInfo.name],
      ['Date of Birth', student.basicInfo.dob],
      ['Student Aadhar', student.basicInfo.studentAadhar],
      ['Grade', student.basicInfo.grade],
      ['Section', student.basicInfo.section],
      ['Admission No', student.basicInfo.admissionNo],
      ['Admission Date', student.basicInfo.admissionDate],
      ['Blood Group', student.basicInfo.bloodGroup || ''],
      ['Previous School', student.basicInfo.previousSchool || ''],
      ['Father Name', student.basicInfo.fatherName],
      ['Father Aadhar', student.basicInfo.fatherAadhar],
      ['Father Occupation', student.basicInfo.fatherOccupation || ''],
      ['Father Phone', student.basicInfo.fatherPhone],
      ['Father Email', student.basicInfo.fatherEmail || ''],
      ['Mother Name', student.basicInfo.motherName],
      ['Mother Aadhar', student.basicInfo.motherAadhar],
      ['Mother Occupation', student.basicInfo.motherOccupation || ''],
      ['Mother Phone', student.basicInfo.motherPhone],
      ['Mother Email', student.basicInfo.motherEmail || ''],
      ['Address', student.basicInfo.address],
      ['City', student.basicInfo.city],
      ['State', student.basicInfo.state],
      ['Pincode', student.basicInfo.pincode],
      ['Emergency Contact', student.basicInfo.emergencyContact],
      ['Emergency Phone', student.basicInfo.emergencyPhone],
      ['Total Fees', totalFees],
      ['Paid Amount', paidAmount],
      ['Pending Amount', pendingAmount],
      ['Progress', `${progress}%`],
      ['Generated Date', new Date().toISOString()]
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

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
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
                  {student.basicInfo.grade}-{student.basicInfo.section} • Admission No: {student.basicInfo.admissionNo}
                </p>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    <Phone size={12} className="inline mr-1" /> {student.basicInfo.fatherPhone}
                  </span>
                  {student.basicInfo.bloodGroup && (
                    <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                      <Droplet size={12} className="inline mr-1" /> {student.basicInfo.bloodGroup}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-600 flex items-center">
                  <User size={12} className="mr-1" /> Father
                </p>
                <p className="font-medium text-sm">{student.basicInfo.fatherName}</p>
                {student.basicInfo.fatherOccupation && (
                  <p className="text-xs text-gray-500">{student.basicInfo.fatherOccupation}</p>
                )}
              </div>
              
              <div>
                <p className="text-sm text-gray-600 flex items-center">
                  <User size={12} className="mr-1" /> Mother
                </p>
                <p className="font-medium text-sm">{student.basicInfo.motherName}</p>
                {student.basicInfo.motherOccupation && (
                  <p className="text-xs text-gray-500">{student.basicInfo.motherOccupation}</p>
                )}
              </div>
              
              <div>
                <p className="text-sm text-gray-600 flex items-center">
                  <Calendar size={12} className="mr-1" /> DOB
                </p>
                <p className="font-medium text-sm">{student.basicInfo.dob}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 flex items-center">
                  <Home size={12} className="mr-1" /> City
                </p>
                <p className="font-medium text-sm">{student.basicInfo.city}</p>
              </div>
            </div>
          </div>
          <div className="relative flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button
                  onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 flex items-center space-x-2"
                  title="Download Student Data"
                >
                  <Download size={16} />
                  <span>Download</span>
                </button>
                
                {showDownloadOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                      <button
                        onClick={handleDownloadJSON}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <Download size={14} />
                        <span>Download as JSON</span>
                      </button>
                      <button
                        onClick={handleDownloadText}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <FileDigit size={14} />
                        <span>Download as Text</span>
                      </button>
                      <button
                        onClick={handleDownloadCSV}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <Hash size={14} />
                        <span>Download as CSV</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={onViewDetails}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 flex items-center space-x-2"
              >
                <Eye size={16} />
                <span>View Details</span>
              </button>
            </div>
            <div className="flex justify-end">
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
      </div>

      <div className="p-6">
        {/* Toggle Button for All Details */}
        <button
          onClick={() => setShowAllDetails(!showAllDetails)}
          className="w-full mb-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2"
        >
          <Eye size={16} />
          <span>{showAllDetails ? 'Hide Details' : 'Show All Details'}</span>
        </button>

        {/* All Details Section */}
        {showAllDetails && (
          <div className="mb-6 space-y-6">
            {/* Student Information */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <User size={16} className="mr-2" />
                Student Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Student Aadhar</p>
                  <p className="font-medium">{student.basicInfo.studentAadhar}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Admission Date</p>
                  <p className="font-medium">{student.basicInfo.admissionDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Previous School</p>
                  <p className="font-medium">{student.basicInfo.previousSchool || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Blood Group</p>
                  <p className="font-medium">{student.basicInfo.bloodGroup || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Parent Details */}
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <User size={16} className="mr-2" />
                Parent Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Father's Aadhar</p>
                  <p className="font-medium">{student.basicInfo.fatherAadhar}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Mother's Aadhar</p>
                  <p className="font-medium">{student.basicInfo.motherAadhar}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Father's Email</p>
                  <p className="font-medium">{student.basicInfo.fatherEmail || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Mother's Email</p>
                  <p className="font-medium">{student.basicInfo.motherEmail || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Mother's Phone</p>
                  <p className="font-medium">{student.basicInfo.motherPhone}</p>
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="bg-green-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <MapPin size={16} className="mr-2" />
                Address Information
              </h4>
              <div className="space-y-2">
                <p className="font-medium">{student.basicInfo.address}</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">City</p>
                    <p className="font-medium">{student.basicInfo.city}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">State</p>
                    <p className="font-medium">{student.basicInfo.state}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Pincode</p>
                    <p className="font-medium">{student.basicInfo.pincode}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Phone size={16} className="mr-2" />
                Emergency Contact
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Contact Name</p>
                  <p className="font-medium">{student.basicInfo.emergencyContact}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Emergency Phone</p>
                  <p className="font-medium">{student.basicInfo.emergencyPhone}</p>
                </div>
              </div>
            </div>
          </div>
        )}

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
        {/* <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setShowAllDetails(!showAllDetails)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <Eye size={16} />
            <span>{showAllDetails ? 'Hide Details' : 'Show All Details'}</span>
          </button>
          
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
        </div> */}

        
      </div>
    </div>
  );
};

export default StudentCard;
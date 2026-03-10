import React, { useState, useEffect, useCallback } from 'react';
import {
  Eye, Trash2, Download, User, Phone, Droplet,
  Hash, X, Edit2, Save, Loader2, AlertCircle
} from 'lucide-react';
import FeesInstallment from './FeesInstallment';
import Marks from './Marks';
import StudentInfo from './StudentInfo';
import StudentApi from '../service/StudentApi';

const StudentCard = ({ student, onDelete, onUpdateStudent }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedStudent, setEditedStudent] = useState(student);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setEditedStudent(student);
    }
  }, [student, isEditing]);

  const currentStudent = isEditing ? editedStudent : student;

  const totalFees = currentStudent.feeStructure?.total || 0;
  const paidAmount = currentStudent.totalPaid || 0;
  const pendingAmount = currentStudent.pendingAmount || 0;
  const progress = totalFees > 0 ? Math.round((paidAmount / totalFees) * 100) : 0;

  // ────────────────────────────────────────────────
  // Download - CSV without marks, with more fields
  // ────────────────────────────────────────────────
  const handleDownloadStudent = () => {
    const escape = (val = '') => `"${String(val).replace(/"/g, '""')}"`;

    const headers = [
      "Admission No",
      "Student Name",
      "Grade",
      "Section",
      "Date of Birth",
      "Admission Date",
      "Blood Group",
      "Student Aadhar",
      "Father Name",
      "Father Aadhar",
      "Father Phone",
      "Father Email",
      "Father Occupation",
      "Mother Name",
      "Mother Aadhar",
      "Mother Phone",
      "Mother Email",
      "Mother Occupation",
      "Full Address",
      "City",
      "State",
      "Pincode",
      "Emergency Contact",
      "Emergency Phone",
      "Total Fees (₹)",
      "Paid Amount (₹)",
      "Pending Amount (₹)",
      "Progress (%)",
      "Installments Count",
      "Generated On"
    ];

    const row = [
      escape(currentStudent.basicInfo?.admissionNo),
      escape(currentStudent.basicInfo?.name),
      escape(currentStudent.basicInfo?.grade),
      escape(currentStudent.basicInfo?.section),
      escape(currentStudent.basicInfo?.dob),
      escape(currentStudent.basicInfo?.admissionDate),
      escape(currentStudent.basicInfo?.bloodGroup),
      escape(currentStudent.basicInfo?.studentAadhar),
      escape(currentStudent.basicInfo?.fatherName),
      escape(currentStudent.basicInfo?.fatherAadhar),
      escape(currentStudent.basicInfo?.fatherPhone),
      escape(currentStudent.basicInfo?.fatherEmail),
      escape(currentStudent.basicInfo?.fatherOccupation),
      escape(currentStudent.basicInfo?.motherName),
      escape(currentStudent.basicInfo?.motherAadhar),
      escape(currentStudent.basicInfo?.motherPhone),
      escape(currentStudent.basicInfo?.motherEmail),
      escape(currentStudent.basicInfo?.motherOccupation),
      escape(currentStudent.basicInfo?.address),
      escape(currentStudent.basicInfo?.city),
      escape(currentStudent.basicInfo?.state),
      escape(currentStudent.basicInfo?.pincode),
      escape(currentStudent.basicInfo?.emergencyContact),
      escape(currentStudent.basicInfo?.emergencyPhone),
      totalFees,
      paidAmount,
      pendingAmount,
      progress,
      currentStudent.installments?.length || 0,
      escape(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }))
    ];

    const csvContent = [
      headers.join(','),
      row.join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    const dateStr = new Date().toISOString().slice(0, 10);
    const admNo = (currentStudent.basicInfo?.admissionNo || 'unknown').trim().replace(/\s+/g, '_');
    link.download = `student_${admNo}_${dateStr}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ────────────────────────────────────────────────
  // Edit & Save Logic (unchanged)
  // ────────────────────────────────────────────────
  const handleChange = useCallback((field, value) => {
    setEditedStudent(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo || {},
        [field]: value
      }
    }));
  }, []);

  const handleSaveChanges = async () => {
    if (!editedStudent?.basicInfo?.admissionNo?.trim()) {
      alert("Admission number is required.");
      return;
    }
    if (!editedStudent.basicInfo?.name?.trim()) {
      alert("Student name is required.");
      return;
    }

    setIsSaving(true);
    try {
      const updates = {
        basicInfo: {
          ...editedStudent.basicInfo,
          dob: editedStudent.basicInfo.dob || null,
          admissionDate: editedStudent.basicInfo.admissionDate || null,
        }
      };

      const result = await StudentApi.updateStudent(student.studentId, updates);
      if (result.success) {
        const updatedStudent = {
          ...student,
          basicInfo: {
            ...student.basicInfo,
            ...updates.basicInfo
          }
        };

        if (typeof onUpdateStudent === 'function') {
          onUpdateStudent(updatedStudent);
        }

        setEditedStudent(updatedStudent);
        setIsEditing(false);
        setActiveTab('info');
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 4000);
      } else {
        alert(result.error || result.message || "Failed to update student");
      }
    } catch (err) {
      console.error("Save student failed:", err);
      alert(`Error: ${err.message || "Could not save changes"}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedStudent(student);
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setEditedStudent(student);
    setIsEditing(false);
  };

  const handleViewDetails = () => {
    setShowDetails(true);
    setEditedStudent(student);
    setIsEditing(false);
    setActiveTab('info');
    setShowSuccessMessage(false);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setIsEditing(false);
    setActiveTab('info');
    setShowSuccessMessage(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (isEditing) {
      setIsEditing(false);
      setEditedStudent(student);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${student.basicInfo?.name || 'this student'}?`)) {
      onDelete?.(student.studentId);
    }
  };

  return (
    <>
      {/* Compact List Item */}
      <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">
                {student.basicInfo?.name?.charAt(0) || '?'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3">
                <h3 className="font-semibold text-gray-900 truncate">
                  {student.basicInfo?.name || 'Unnamed'}
                </h3>
                {student.basicInfo?.bloodGroup && (
                  <span className="text-xs px-2 py-0.5 bg-red-50 text-red-700 rounded-full flex items-center">
                    <Droplet size={12} className="mr-1" />
                    {student.basicInfo.bloodGroup}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mt-1">
                <span className="flex items-center">
                  <Hash size={14} className="mr-1" />
                  {student.basicInfo?.admissionNo || '—'}
                </span>
                <span className="flex items-center">
                  <User size={14} className="mr-1" />
                  {student.basicInfo?.grade ? `Grade ${student.basicInfo.grade}` : '—'}
                  {student.basicInfo?.section ? ` - ${student.basicInfo.section}` : ''}
                </span>
                <span className="flex items-center">
                  <Phone size={14} className="mr-1" />
                  {student.basicInfo?.fatherPhone || '—'}
                </span>
              </div>
            </div>
            <div className="hidden sm:block w-44">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Fee Progress</span>
                <span className="font-medium text-amber-700">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-amber-600 h-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleDownloadStudent}
              className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Download student data as CSV (Excel)"
            >
              <Download size={18} />
            </button>

            <button
              onClick={handleViewDetails}
              className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              title="View details"
            >
              <Eye size={18} />
            </button>

            <button
              onClick={handleDelete}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete student"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-y-auto">
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-6 sticky top-0 bg-white z-10 pb-2 border-b">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {isEditing ? 'Edit Student Information' : (student.basicInfo?.name || 'Student Details')}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Adm. No: {student.basicInfo?.admissionNo || '—'} •
                    {student.basicInfo?.grade ? ` Grade ${student.basicInfo.grade}` : ''}
                    {student.basicInfo?.section ? ` - ${student.basicInfo.section}` : ''}
                  </p>
                </div>
                <button
                  onClick={handleCloseDetails}
                  className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={28} />
                </button>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-8">
                <nav className="flex space-x-16 md:space-x-24">
                  {['info', 'fees', 'marks'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => handleTabChange(tab)}
                      className={`pb-4 px-2 font-medium text-base transition-all relative ${
                        activeTab === tab
                          ? 'text-amber-700 border-b-3 border-amber-600 font-semibold'
                          : 'text-gray-600 hover:text-gray-800 hover:border-b-2 hover:border-gray-400'
                      }`}
                    >
                      {tab === 'info' ? 'Student Information' :
                       tab === 'fees' ? 'Fee Details' : 'Academic Marks'}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="mt-6">
                {activeTab === 'info' && (
                  <StudentInfo
                    student={currentStudent}
                    editedStudent={editedStudent}
                    isEditing={isEditing}
                    isSaving={isSaving}
                    showSuccessMessage={showSuccessMessage}
                    onEditToggle={handleEditToggle}
                    onSaveChanges={handleSaveChanges}
                    onChange={handleChange}
                    onCancel={handleCancel}
                  />
                )}
                {activeTab === 'fees' && (
                  <FeesInstallment student={currentStudent} onUpdateStudent={onUpdateStudent} />
                )}
                {activeTab === 'marks' && (
                  <Marks student={currentStudent} onUpdateStudent={onUpdateStudent} />
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
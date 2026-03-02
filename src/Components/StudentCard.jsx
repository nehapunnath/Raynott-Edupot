import React, { useState, useEffect, useCallback } from 'react';
import { 
  Eye, Trash2, Download, User, Phone, Mail, Calendar, MapPin, Droplet, 
  Hash, FileDigit, X, Edit2, Save, AlertCircle, Loader2, Users
} from 'lucide-react';
import FeesInstallment from './FeesInstallment';
import Marks from './Marks';
import StudentInfo from './StudentInfo';
import StudentApi from '../service/StudentApi';

const StudentCard = ({ student, onDelete, onUpdateStudent }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedStudent, setEditedStudent] = useState(student);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Sync editedStudent when original student changes (but not during editing)
  useEffect(() => {
    if (!isEditing) {
      setEditedStudent(student);
    }
  }, [student, isEditing]);

  const totalFees = student.feeStructure?.total || 0;
  const paidAmount = student.totalPaid || 0;
  const pendingAmount = student.pendingAmount || 0;
  const progress = totalFees > 0 ? Math.round((paidAmount / totalFees) * 100) : 0;

  // ────────────────────────────────────────────────
  // Download Handlers
  // ────────────────────────────────────────────────
  const handleDownloadJSON = () => {
    const studentData = {
      student: {
        basicInfo: student.basicInfo,
        feeSummary: { totalFees, paidAmount, pendingAmount, progress: `${progress}%` },
        installments: student.installments || [],
        marks: student.marks || [],
        timestamp: new Date().toISOString()
      }
    };
    const jsonString = JSON.stringify(studentData, null, 2);
    downloadFile(jsonString, 'application/json', `student_${student.basicInfo.admissionNo || 'unknown'}.json`);
    setShowDownloadOptions(false);
  };

  const handleDownloadText = () => {
    const marksText = student.marks?.map(mark =>
      `${mark.examName || 'Exam'} (${mark.subject || 'Subject'}): ${mark.marksObtained || 0}/${mark.totalMarks || 0}`
    ).join('\n') || 'No marks available';

    const textContent = `
STUDENT INFORMATION
====================
Name: ${student.basicInfo.name || 'N/A'}
Date of Birth: ${student.basicInfo.dob || 'N/A'}
Grade: ${student.basicInfo.grade || 'N/A'}
Section: ${student.basicInfo.section || 'N/A'}
Admission No: ${student.basicInfo.admissionNo || 'N/A'}
Blood Group: ${student.basicInfo.bloodGroup || 'Not specified'}

PARENT INFORMATION
==================
Father: ${student.basicInfo.fatherName || 'N/A'} (${student.basicInfo.fatherPhone || 'N/A'})
Mother: ${student.basicInfo.motherName || 'N/A'} (${student.basicInfo.motherPhone || 'N/A'})
Address: ${student.basicInfo.address || 'N/A'}, ${student.basicInfo.city || 'N/A'}

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
    downloadFile(textContent, 'text/plain', `student_${student.basicInfo.admissionNo || 'unknown'}.txt`);
    setShowDownloadOptions(false);
  };

  const handleDownloadCSV = () => {
    const csvContent = [
      ['Field', 'Value'],
      ['Student Name', student.basicInfo.name || ''],
      ['Grade', student.basicInfo.grade || ''],
      ['Section', student.basicInfo.section || ''],
      ['Admission No', student.basicInfo.admissionNo || ''],
      ['Father Name', student.basicInfo.fatherName || ''],
      ['Father Phone', student.basicInfo.fatherPhone || ''],
      ['Mother Name', student.basicInfo.motherName || ''],
      ['Mother Phone', student.basicInfo.motherPhone || ''],
      ['Total Fees', totalFees],
      ['Paid Amount', paidAmount],
      ['Pending Amount', pendingAmount],
      ['Progress', `${progress}%`],
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    downloadFile(csvContent, 'text/csv', `student_${student.basicInfo.admissionNo || 'unknown'}.csv`);
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

  // ────────────────────────────────────────────────
  // Edit & Save Logic
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
    if (!editedStudent.basicInfo.name?.trim()) {
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
        
        // Turn off editing first
        setIsEditing(false);
        
        // Then ensure we stay on info tab (micro-delay helps React batch correctly)
        setTimeout(() => {
          setActiveTab('info');
        }, 0);

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
                  {student.basicInfo.name || 'Unnamed'}
                </h3>
                {student.basicInfo.bloodGroup && (
                  <span className="text-xs px-2 py-0.5 bg-red-50 text-red-700 rounded-full flex items-center">
                    <Droplet size={12} className="mr-1" />
                    {student.basicInfo.bloodGroup}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mt-1">
                <span className="flex items-center">
                  <Hash size={14} className="mr-1" />
                  {student.basicInfo.admissionNo || '—'}
                </span>
                <span className="flex items-center">
                  <User size={14} className="mr-1" />
                  {student.basicInfo.grade ? `Grade ${student.basicInfo.grade}` : '—'}
                  {student.basicInfo.section ? ` - ${student.basicInfo.section}` : ''}
                </span>
                <span className="flex items-center">
                  <Phone size={14} className="mr-1" />
                  {student.basicInfo.fatherPhone || '—'}
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
              onClick={() => setShowDownloadOptions(prev => !prev)}
              className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Download"
            >
              <Download size={18} />
            </button>

            {showDownloadOptions && (
              <div className="absolute right-4 mt-10 w-52 bg-white rounded-lg shadow-xl border border-gray-200 z-20 py-1 text-sm">
                <button onClick={handleDownloadJSON} className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2">
                  <FileDigit size={16} /> JSON
                </button>
                <button onClick={handleDownloadText} className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2">
                  <FileDigit size={16} /> Text
                </button>
                <button onClick={handleDownloadCSV} className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2">
                  <Hash size={16} /> CSV
                </button>
              </div>
            )}

            <button
              onClick={handleViewDetails}
              className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              title="View details"
            >
              <Eye size={18} />
            </button>

            <button
              onClick={() => onDelete?.(student.basicInfo?.admissionNo)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete student"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────── */}
      {/* Details Modal */}
      {/* ──────────────────────────────────────────────── */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-y-auto">
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-6 sticky top-0 bg-white z-10 pb-2 border-b">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {isEditing ? 'Edit Student Information' : (student.basicInfo.name || 'Student Details')}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Adm. No: {student.basicInfo.admissionNo || '—'} • 
                    {student.basicInfo.grade ? ` Grade ${student.basicInfo.grade}` : ''} 
                    {student.basicInfo.section ? ` - ${student.basicInfo.section}` : ''}
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
                    student={student}
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
                  <FeesInstallment student={student} onUpdateStudent={onUpdateStudent} />
                )}

                {activeTab === 'marks' && (
                  <Marks student={student} onUpdateStudent={onUpdateStudent} />
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
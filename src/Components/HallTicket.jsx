// src/Components/HallTicket.jsx
import React, { useState, useEffect } from 'react';
import { Eye, Edit, Download, Search, X, Save, Printer, Calendar, BookOpen, FileText, User, Loader, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import StudentApi from '../service/StudentApi';

const HallTicket = ({ students: propStudents, onUpdateStudent }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [savedHallTicket, setSavedHallTicket] = useState(null);

  // Everything starts empty - no predefined values
  const emptyHallTicketData = {
    schoolName: '',
    schoolAffiliation: '',
    examTitle: '',
    studentName: '',
    fatherName: '',
    motherName: '',
    studentClass: '',
    section: '',
    admissionNumber: '',
    rollNumber: '',
    dateOfBirth: '',
    gender: '',
    examType: '',
    examDate: '',
    examTime: '',
    subjects: [], // Empty array - user must add subjects
    instructions: [], // Empty array - user must add instructions
    studentSignature: '',
    principalSignature: '',
    principalName: '',
  };

  const [hallTicketData, setHallTicketData] = useState(emptyHallTicketData);

  // Load students
  useEffect(() => {
    if (propStudents && propStudents.length > 0) {
      setStudents(propStudents);
      setFilteredStudents(propStudents);
    } else {
      loadStudents();
    }
  }, [propStudents]);

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const result = await StudentApi.getAllStudents();
      if (result.success) {
        setStudents(result.students);
        setFilteredStudents(result.students);
      }
    } catch (error) {
      console.error('Error loading students:', error);
      toast.error('Failed to load students');
    } finally {
      setIsLoading(false);
    }
  };

  // Search filter
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student => {
        const basicInfo = student.basicInfo || {};
        return (
          basicInfo.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          basicInfo.admissionNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          basicInfo.grade?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  const getStudentInfo = (student, field) => {
    const basicInfo = student.basicInfo || {};
    switch (field) {
      case 'fullName': return basicInfo.name || '';
      case 'admissionNumber': return basicInfo.admissionNo || '';
      case 'className': return basicInfo.grade || '';
      case 'section': return basicInfo.section || '';
      case 'fatherName': return basicInfo.fatherName || '';
      case 'motherName': return basicInfo.motherName || '';
      case 'dob': return basicInfo.dob || '';
      case 'gender': return basicInfo.gender || '';
      default: return '';
    }
  };

  const generateHallTicket = async (student) => {
    const admissionNo = getStudentInfo(student, 'admissionNumber');
    const className = getStudentInfo(student, 'className');
    const section = getStudentInfo(student, 'section');

    // Only populate student info, everything else remains empty
    setHallTicketData({
      schoolName: '',
      schoolAffiliation: '',
      examTitle: '',
      studentName: getStudentInfo(student, 'fullName'),
      fatherName: getStudentInfo(student, 'fatherName'),
      motherName: getStudentInfo(student, 'motherName'),
      studentClass: className,
      section: section,
      admissionNumber: admissionNo,
      rollNumber: admissionNo || `ROLL${student.studentId?.slice(-6)}`,
      dateOfBirth: getStudentInfo(student, 'dob'),
      gender: getStudentInfo(student, 'gender'),
      examType: '',
      examDate: '',
      examTime: '',
      subjects: [],
      instructions: [],
      studentSignature: '',
      principalSignature: '',
      principalName: '',
    });

    setSelectedStudent(student);
    setPhotoPreview(null);
    setPhotoFile(null);
    setSavedHallTicket(null);

    // Try to load existing hall ticket from backend
    try {
      const result = await StudentApi.getHallTicket(student.studentId);
      if (result.success && result.hallTicket) {
        setSavedHallTicket(result.hallTicket);
        setHallTicketData(result.hallTicket.hallTicketData);
        if (result.hallTicket.imageUrl) {
          setPhotoPreview(result.hallTicket.imageUrl);
        }
        toast.info('Loaded existing hall ticket');
      }
    } catch (error) {
      console.log('No existing hall ticket found');
    }

    setIsViewModalOpen(true);
  };

  const handleEditHallTicket = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Photo size should be less than 5MB');
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only JPEG, PNG, GIF, and WEBP images are allowed');
        return;
      }

      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      toast.success('Photo selected successfully');
    }
  };

  const handleSaveHallTicket = async () => {
    if (!selectedStudent) {
      toast.error('No student selected');
      return;
    }

    setIsSaving(true);
    try {
      const saveData = {
        ...hallTicketData,
        subjects: Array.isArray(hallTicketData.subjects) ? hallTicketData.subjects : [],
        instructions: Array.isArray(hallTicketData.instructions) ? hallTicketData.instructions : [],
        version: savedHallTicket?.version || 1,
      };

      const result = await StudentApi.saveHallTicket(
        selectedStudent.studentId,
        saveData,
        photoFile
      );

      if (result.success) {
        toast.success('Hall ticket saved successfully!');
        setSavedHallTicket(result.hallTicket);
        if (result.imageUrl) {
          setPhotoPreview(result.imageUrl);
        }
        setIsEditModalOpen(false);
        setIsViewModalOpen(true);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error saving hall ticket:', error);
      toast.error(error.message || 'Failed to save hall ticket');
    } finally {
      setIsSaving(false);
    }
  };

  const downloadHallTicket = () => {
    try {
      const printWindow = window.open('', '_blank');
      const content = getHallTicketHTML(hallTicketData, photoPreview);
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
      toast.success('Hall ticket ready for printing');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to print hall ticket');
    }
  };

  const handleFieldChange = (field, value) => {
    setHallTicketData({ ...hallTicketData, [field]: value });
  };

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...hallTicketData.subjects];
    updatedSubjects[index][field] = value;
    setHallTicketData({ ...hallTicketData, subjects: updatedSubjects });
  };

  const addSubject = () => {
    setHallTicketData({
      ...hallTicketData,
      subjects: [...hallTicketData.subjects, { name: '', code: '', date: '', time: '', venue: '' }]
    });
  };

  const removeSubject = (index) => {
    const updatedSubjects = hallTicketData.subjects.filter((_, i) => i !== index);
    setHallTicketData({ ...hallTicketData, subjects: updatedSubjects });
  };

  const handleInstructionChange = (index, value) => {
    const updatedInstructions = [...hallTicketData.instructions];
    updatedInstructions[index] = value;
    setHallTicketData({ ...hallTicketData, instructions: updatedInstructions });
  };

  const addInstruction = () => {
    setHallTicketData({
      ...hallTicketData,
      instructions: [...hallTicketData.instructions, '']
    });
  };

  const removeInstruction = (index) => {
    const updatedInstructions = hallTicketData.instructions.filter((_, i) => i !== index);
    setHallTicketData({ ...hallTicketData, instructions: updatedInstructions });
  };

  // Get Hall Ticket HTML for printing/download
  const getHallTicketHTML = (data, photo) => {
    const escapeHtml = (text) => {
      if (!text) return '';
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    };

    // Check if there's any content to display
    const hasSchoolInfo = data.schoolName || data.schoolAffiliation || data.examTitle;
    const hasSubjects = data.subjects && data.subjects.length > 0 && data.subjects.some(s => s.name);
    const hasInstructions = data.instructions && data.instructions.length > 0 && data.instructions.some(i => i.trim());

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Hall Ticket - ${escapeHtml(data.studentName || 'Student')}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; background: #e0e0e0; }
          .hall-ticket { max-width: 900px; margin: 0 auto; background: white; border: 2px solid #1a1a2e; padding: 30px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); position: relative; }
          .hall-ticket::before { content: ""; position: absolute; top: 10px; left: 10px; right: 10px; bottom: 10px; border: 1px solid #ddd; pointer-events: none; }
          .header { text-align: center; border-bottom: 2px solid #1a1a2e; padding-bottom: 20px; margin-bottom: 20px; }
          .school-name { font-size: 28px; font-weight: bold; color: #b45309; margin-bottom: 5px; }
          .school-affiliation { font-size: 12px; color: #666; }
          .title { font-size: 22px; font-weight: bold; margin: 15px 0; text-align: center; color: #1a1a2e; letter-spacing: 2px; }
          .info-section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; background: #fafafa; }
          .info-row { display: flex; margin: 8px 0; padding: 5px; }
          .label { font-weight: bold; width: 130px; color: #555; }
          .value { flex: 1; color: #333; border-bottom: 1px dotted #ccc; }
          .subjects { margin: 20px 0; }
          .subjects h3 { margin-bottom: 10px; color: #1a1a2e; }
          .subjects table { width: 100%; border-collapse: collapse; }
          .subjects th, .subjects td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          .subjects th { background: #f5f5f5; font-weight: bold; }
          .instructions { margin: 20px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #b45309; }
          .instructions h3 { margin-bottom: 10px; color: #1a1a2e; }
          .instructions ul { margin: 10px 0; padding-left: 20px; }
          .instructions li { margin: 5px 0; line-height: 1.4; }
          .signature { margin-top: 30px; display: flex; justify-content: space-between; padding-top: 20px; }
          .signature div { text-align: center; }
          .photo-container { float: right; width: 120px; height: 140px; border: 1px solid #ddd; margin-left: 20px; margin-bottom: 15px; text-align: center; overflow: hidden; background: #f5f5f5; display: flex; align-items: center; justify-content: center; }
          .photo-container img { width: 100%; height: 100%; object-fit: cover; }
          .photo-container span { color: #999; font-size: 12px; }
          .clearfix::after { content: ""; clear: both; display: table; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 11px; color: #666; }
          @media print { body { background: white; padding: 0; margin: 0; } .hall-ticket { box-shadow: none; padding: 20px; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="hall-ticket">
          ${hasSchoolInfo ? `
          <div class="header">
            <div class="school-name">${escapeHtml(data.schoolName || '')}</div>
            <div class="school-affiliation">${escapeHtml(data.schoolAffiliation || '')}</div>
            <div class="title">${escapeHtml(data.examTitle || 'HALL TICKET')}</div>
          </div>
          ` : ''}
          
          <div class="clearfix">
            <div class="photo-container">
              ${photo ? `<img src="${photo}" alt="Student Photo" />` : '<span>No Photo</span>'}
            </div>
            <div class="info-section">
              <div class="info-row"><div class="label">Student Name:</div><div class="value">${escapeHtml(data.studentName || 'N/A')}</div></div>
              <div class="info-row"><div class="label">Father's Name:</div><div class="value">${escapeHtml(data.fatherName || 'N/A')}</div></div>
              <div class="info-row"><div class="label">Mother's Name:</div><div class="value">${escapeHtml(data.motherName || 'N/A')}</div></div>
              <div class="info-row"><div class="label">Date of Birth:</div><div class="value">${escapeHtml(data.dateOfBirth || 'N/A')}</div></div>
              <div class="info-row"><div class="label">Roll Number:</div><div class="value">${escapeHtml(data.rollNumber || 'N/A')}</div></div>
              <div class="info-row"><div class="label">Class/Section:</div><div class="value">${escapeHtml(data.studentClass || 'N/A')} ${data.section ? `- ${escapeHtml(data.section)}` : ''}</div></div>
              <div class="info-row"><div class="label">Admission No:</div><div class="value">${escapeHtml(data.admissionNumber || 'N/A')}</div></div>
              <div class="info-row"><div class="label">Gender:</div><div class="value">${escapeHtml(data.gender || 'N/A')}</div></div>
            </div>
          </div>

          ${data.examType || data.examDate || data.examTime ? `
          <div class="info-section">
            ${data.examType ? `<div class="info-row"><div class="label">Exam Type:</div><div class="value">${escapeHtml(data.examType)}</div></div>` : ''}
            ${data.examDate ? `<div class="info-row"><div class="label">Exam Date:</div><div class="value">${escapeHtml(data.examDate)}</div></div>` : ''}
            ${data.examTime ? `<div class="info-row"><div class="label">Exam Time:</div><div class="value">${escapeHtml(data.examTime)}</div></div>` : ''}
          </div>
          ` : ''}

          ${hasSubjects ? `
          <div class="subjects">
            <h3>Examination Schedule</h3>
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Subject Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Venue</th>
                </tr>
              </thead>
              <tbody>
                ${data.subjects.filter(s => s.name).map((subject, index) => `
                  <tr>
                    <td>${escapeHtml(subject.code || '')}</td>
                    <td>${escapeHtml(subject.name)}</td>
                    <td>${escapeHtml(subject.date || '')}</td>
                    <td>${escapeHtml(subject.time || '')}</td>
                    <td>${escapeHtml(subject.venue || '')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ` : ''}

          ${hasInstructions ? `
          <div class="instructions">
            <h3> Important Instructions:</h3>
            <ul>
              ${data.instructions.filter(i => i.trim()).map(instruction => `<li>${escapeHtml(instruction)}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          <div class="signature">
            <div>_________________<br>${escapeHtml(data.studentSignature || 'Student\'s Signature')}</div>
            <div>_________________<br>${escapeHtml(data.principalSignature || 'Principal')}<br>${escapeHtml(data.principalName || '')}</div>
          </div>
          <div class="footer">
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
        </div>
        
      </body>
      </html>
    `;
  };

  const viewHallTicket = async (student) => {
    setSelectedStudent(student);
    setIsLoading(true);

    try {
      const result = await StudentApi.getHallTicket(student.studentId);
      if (result.success && result.hallTicket) {
        setSavedHallTicket(result.hallTicket);
        setHallTicketData(result.hallTicket.hallTicketData);
        if (result.hallTicket.imageUrl) {
          setPhotoPreview(result.hallTicket.imageUrl);
        }
        setIsViewModalOpen(true);
      } else {
        generateHallTicket(student);
      }
    } catch (error) {
      console.error('Error viewing hall ticket:', error);
      generateHallTicket(student);
    } finally {
      setIsLoading(false);
    }
  };


  const editHallTicket = async (student) => {
    setSelectedStudent(student);
    setIsLoading(true);

    try {
      const result = await StudentApi.getHallTicket(student.studentId);
      if (result.success && result.hallTicket) {
        setSavedHallTicket(result.hallTicket);
        setHallTicketData(result.hallTicket.hallTicketData);
        if (result.hallTicket.imageUrl) {
          setPhotoPreview(result.hallTicket.imageUrl);
        }
      } else {
        const admissionNo = getStudentInfo(student, 'admissionNumber');
        setHallTicketData({
          schoolName: '',
          schoolAffiliation: '',
          examTitle: '',
          studentName: getStudentInfo(student, 'fullName'),
          fatherName: getStudentInfo(student, 'fatherName'),
          motherName: getStudentInfo(student, 'motherName'),
          studentClass: getStudentInfo(student, 'className'),
          section: getStudentInfo(student, 'section'),
          admissionNumber: admissionNo,
          rollNumber: admissionNo || `ROLL${student.studentId?.slice(-6)}`,
          dateOfBirth: getStudentInfo(student, 'dob'),
          gender: getStudentInfo(student, 'gender'),
          examType: '',
          examDate: '',
          examTime: '',
          subjects: [],
          instructions: [],
          studentSignature: '',
          principalSignature: '',
          principalName: '',
        });
        setPhotoPreview(null);
        setPhotoFile(null);
      }
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Error editing hall ticket:', error);
      toast.error('Failed to load hall ticket data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Hall Ticket Management</h2>
        <p className="text-gray-600 mt-1">Create and manage hall tickets for students - All fields are customizable</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, admission number, or class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    <Loader className="animate-spin inline-block mr-2" size={20} />
                    Loading students...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No students found</td>
                </tr>
              ) : (
                filteredStudents.map((student, index) => {
                  const basicInfo = student.basicInfo || {};
                  return (
                    <tr key={student.studentId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{basicInfo.admissionNo || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{basicInfo.name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{basicInfo.grade || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{basicInfo.section || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-4">
                          <button onClick={() => viewHallTicket(student)} className="text-blue-600 hover:text-blue-900 inline-flex items-center space-x-2">
                            <Eye size={16} />
                          </button>
                          <button onClick={() => editHallTicket(student)} className="text-green-600 hover:text-green-900 inline-flex items-center space-x-2">
                            <Edit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Hall Ticket Preview</h3>
              <button onClick={() => setIsViewModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div dangerouslySetInnerHTML={{ __html: getHallTicketHTML(hallTicketData, photoPreview) }} />
              <div className="mt-6 flex justify-end space-x-3 pt-4 border-t">
                <button onClick={handleEditHallTicket} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Edit Hall Ticket
                </button>
                <button onClick={downloadHallTicket} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Download / Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                {savedHallTicket ? 'Edit Hall Ticket' : 'Create Hall Ticket'} - {hallTicketData.studentName || selectedStudent.basicInfo?.name}
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader className="animate-spin" size={40} />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* School Information Section */}
                  <div className="border rounded-lg p-4">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FileText size={20} /> School Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                        <input type="text" value={hallTicketData.schoolName} onChange={(e) => handleFieldChange('schoolName', e.target.value)} placeholder="Enter school name" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">School Affiliation</label>
                        <input type="text" value={hallTicketData.schoolAffiliation} onChange={(e) => handleFieldChange('schoolAffiliation', e.target.value)} placeholder="e.g., Affiliated to CBSE" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Exam Title</label>
                        <input type="text" value={hallTicketData.examTitle} onChange={(e) => handleFieldChange('examTitle', e.target.value)} placeholder="e.g., ANNUAL EXAMINATION 2025" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                      </div>
                    </div>
                  </div>

                  {/* Student Information Section - Pre-filled from student data */}
                  <div className="border rounded-lg p-4">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <User size={20} /> Student Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                        <input type="text" value={hallTicketData.studentName} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50" readOnly />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                        <input type="text" value={hallTicketData.fatherName} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50" readOnly />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
                        <input type="text" value={hallTicketData.motherName} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50" readOnly />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                        <input type="date" value={hallTicketData.dateOfBirth} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50" readOnly />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                        <input type="text" value={hallTicketData.rollNumber} onChange={(e) => handleFieldChange('rollNumber', e.target.value)} placeholder="Enter roll number" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                        <input type="text" value={hallTicketData.studentClass} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50" readOnly />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                        <input type="text" value={hallTicketData.section} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50" readOnly />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Admission Number</label>
                        <input type="text" value={hallTicketData.admissionNumber} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50" readOnly />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select value={hallTicketData.gender} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50" disabled>
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Student Photo</label>
                        <div className="flex items-center space-x-4">
                          <input type="file" accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" onChange={handlePhotoUpload} className="flex-1 border border-gray-300 rounded-lg px-3 py-2" />
                          {photoPreview && <img src={photoPreview} alt="Preview" className="w-12 h-12 object-cover rounded" />}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Max size: 5MB. Allowed: JPEG, PNG, GIF, WEBP</p>
                      </div>
                    </div>
                  </div>

                  {/* Exam Information Section */}
                  <div className="border rounded-lg p-4">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Calendar size={20} /> Exam Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                        <input type="text" value={hallTicketData.examType} onChange={(e) => handleFieldChange('examType', e.target.value)} placeholder="e.g., Annual Examination" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Exam Date</label>
                        <input type="text" value={hallTicketData.examDate} onChange={(e) => handleFieldChange('examDate', e.target.value)} placeholder="e.g., March 15, 2025" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Exam Time</label>
                        <input type="text" value={hallTicketData.examTime} onChange={(e) => handleFieldChange('examTime', e.target.value)} placeholder="e.g., 10:00 AM - 1:00 PM" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                      </div>
                    </div>
                  </div>

                  {/* Subjects Section */}
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold flex items-center gap-2">
                        <BookOpen size={20} /> Subjects
                      </h4>
                      <button onClick={addSubject} className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1 text-sm">
                        <Plus size={16} /> Add Subject
                      </button>
                    </div>
                    {hallTicketData.subjects.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No subjects added. Click "Add Subject" to add exam subjects.</p>
                    )}
                    {hallTicketData.subjects.map((subject, index) => (
                      <div key={index} className="border-b pb-4 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium">Subject {index + 1}</h5>
                          <button onClick={() => removeSubject(index)} className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1">
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <input type="text" placeholder="Subject Name" value={subject.name} onChange={(e) => handleSubjectChange(index, 'name', e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2" />
                          <input type="text" placeholder="Subject Code" value={subject.code} onChange={(e) => handleSubjectChange(index, 'code', e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2" />
                          <input type="text" placeholder="Date" value={subject.date} onChange={(e) => handleSubjectChange(index, 'date', e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2" />
                          <input type="text" placeholder="Time" value={subject.time} onChange={(e) => handleSubjectChange(index, 'time', e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2" />
                          <input type="text" placeholder="Venue" value={subject.venue} onChange={(e) => handleSubjectChange(index, 'venue', e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Instructions Section */}
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold flex items-center gap-2">
                        <FileText size={20} /> Instructions
                      </h4>
                      <button onClick={addInstruction} className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1 text-sm">
                        <Plus size={16} /> Add Instruction
                      </button>
                    </div>
                    {hallTicketData.instructions.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No instructions added. Click "Add Instruction" to add exam instructions.</p>
                    )}
                    {hallTicketData.instructions.map((instruction, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input type="text" value={instruction} onChange={(e) => handleInstructionChange(index, e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-3 py-2" placeholder={`Instruction ${index + 1}`} />
                        <button onClick={() => removeInstruction(index)} className="text-red-600 hover:text-red-700">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Signatures Section */}
                  <div className="border rounded-lg p-4">
                    <h4 className="text-lg font-semibold mb-4">Signatures</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Student Signature Label</label>
                        <input type="text" value={hallTicketData.studentSignature} onChange={(e) => handleFieldChange('studentSignature', e.target.value)} placeholder="e.g., Student's Signature" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Principal Signature Label</label>
                        <input type="text" value={hallTicketData.principalSignature} onChange={(e) => handleFieldChange('principalSignature', e.target.value)} placeholder="e.g., Principal" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Principal Name</label>
                        <input type="text" value={hallTicketData.principalName} onChange={(e) => handleFieldChange('principalName', e.target.value)} placeholder="Enter principal's name" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-6 flex justify-end space-x-3 pt-4 border-t">
                <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400" disabled={isSaving}>
                  Cancel
                </button>
                <button onClick={handleSaveHallTicket} disabled={isSaving} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2 disabled:opacity-50">
                  {isSaving ? (
                    <>
                      <Loader className="animate-spin" size={18} />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Save Hall Ticket</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    handleSaveHallTicket();
                    setTimeout(() => downloadHallTicket(), 1000);
                  }}
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
                >
                  <Printer size={18} />
                  <span>Save & Print</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HallTicket;
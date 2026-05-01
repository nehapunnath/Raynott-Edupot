// src/Components/HallTicket.jsx
import React, { useState, useEffect } from 'react';
import { Eye, Edit, Download, Search, X, Save, Printer, Upload, Calendar, Clock, MapPin, BookOpen, FileText, User } from 'lucide-react';
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
  const [studentPhoto, setStudentPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  
  const [hallTicketData, setHallTicketData] = useState({
    // Header Information
    schoolName: 'Raynott Edupot',
    schoolAddress: '123 Education Street, Knowledge City',
    schoolAffiliation: 'Affiliated to CBSE',
    examTitle: 'ANNUAL EXAMINATION 2025',
    
    // Student Details
    studentName: '',
    fatherName: '',
    motherName: '',
    studentClass: '',
    section: '',
    admissionNumber: '',
    rollNumber: '',
    dateOfBirth: '',
    gender: '',
    
    // Exam Details
    examType: 'Annual Examination',
    examDate: 'March 15, 2025',
    examTime: '10:00 AM - 1:00 PM',
    
    // Subjects
    subjects: [
      { name: 'Mathematics', code: '041', date: 'March 15, 2025', time: '10:00 AM - 1:00 PM', venue: 'Main Examination Hall' },
      { name: 'Science', code: '086', date: 'March 17, 2025', time: '10:00 AM - 1:00 PM', venue: 'Main Examination Hall' },
      { name: 'English', code: '184', date: 'March 19, 2025', time: '10:00 AM - 1:00 PM', venue: 'Main Examination Hall' },
      { name: 'Social Studies', code: '087', date: 'March 21, 2025', time: '10:00 AM - 1:00 PM', venue: 'Main Examination Hall' },
      { name: 'Computer Science', code: '083', date: 'March 23, 2025', time: '10:00 AM - 1:00 PM', venue: 'Computer Lab' }
    ],
    
    // Instructions
    instructions: [
      'Report at the venue 30 minutes before exam time',
      'Bring your school ID card and hall ticket',
      'No electronic devices allowed in examination hall',
      'Use only blue or black pen',
      'Write your roll number clearly on answer sheet',
      'Check all pages of answer booklet before starting'
    ],
    
    // Signatures
    studentSignature: 'Student\'s Signature',
    principalSignature: 'Principal',
    principalName: 'Dr. S. Kumar',
  });

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

  // Helper function to safely get student info
  const getStudentInfo = (student, field) => {
    const basicInfo = student.basicInfo || {};
    switch(field) {
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

  // Generate Hall Ticket
  const generateHallTicket = (student) => {
    const admissionNo = getStudentInfo(student, 'admissionNumber');
    const className = getStudentInfo(student, 'className');
    const section = getStudentInfo(student, 'section');
    
    const defaultData = {
      ...hallTicketData,
      studentName: getStudentInfo(student, 'fullName'),
      fatherName: getStudentInfo(student, 'fatherName'),
      motherName: getStudentInfo(student, 'motherName'),
      studentClass: className,
      section: section,
      admissionNumber: admissionNo,
      dateOfBirth: getStudentInfo(student, 'dob'),
      gender: getStudentInfo(student, 'gender'),
      rollNumber: admissionNo || `ROLL${student.studentId?.slice(-6)}`,
    };
    
    setHallTicketData(defaultData);
    setSelectedStudent(student);
    
    // Load saved photo if exists
    const savedPhoto = localStorage.getItem(`hallTicketPhoto_${student.studentId}`);
    if (savedPhoto) {
      setPhotoPreview(savedPhoto);
      setStudentPhoto(savedPhoto);
    } else {
      setPhotoPreview(null);
      setStudentPhoto(null);
    }
    
    setIsViewModalOpen(true);
  };

  // Edit Hall Ticket
  const handleEditHallTicket = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(true);
  };

  // Handle Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setStudentPhoto(base64String);
        setPhotoPreview(base64String);
        localStorage.setItem(`hallTicketPhoto_${selectedStudent.studentId}`, base64String);
        toast.success('Photo uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Hall Ticket data
  const handleSaveHallTicket = async () => {
    try {
      const hallTicketRecord = {
        studentId: selectedStudent.studentId,
        hallTicketData: hallTicketData,
        photo: studentPhoto,
        generatedAt: new Date().toISOString()
      };
      
      const existingTickets = JSON.parse(localStorage.getItem('hallTickets') || '{}');
      existingTickets[selectedStudent.studentId] = hallTicketRecord;
      localStorage.setItem('hallTickets', JSON.stringify(existingTickets));
      
      toast.success('Hall ticket saved successfully!');
      setIsEditModalOpen(false);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error('Error saving hall ticket:', error);
      toast.error('Failed to save hall ticket');
    }
  };

  // Download Hall Ticket as PDF
  const downloadHallTicket = async () => {
    try {
      const printWindow = window.open('', '_blank');
      const content = getHallTicketHTML(selectedStudent, hallTicketData, studentPhoto);
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
      toast.success('Hall ticket ready for download');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download hall ticket');
    }
  };

  // Handle field changes in edit mode
  const handleFieldChange = (field, value) => {
    setHallTicketData({...hallTicketData, [field]: value});
  };

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...hallTicketData.subjects];
    updatedSubjects[index][field] = value;
    setHallTicketData({...hallTicketData, subjects: updatedSubjects});
  };

  const addSubject = () => {
    setHallTicketData({
      ...hallTicketData,
      subjects: [...hallTicketData.subjects, { name: '', code: '', date: '', time: '', venue: '' }]
    });
  };

  const removeSubject = (index) => {
    const updatedSubjects = hallTicketData.subjects.filter((_, i) => i !== index);
    setHallTicketData({...hallTicketData, subjects: updatedSubjects});
  };

  const handleInstructionChange = (index, value) => {
    const updatedInstructions = [...hallTicketData.instructions];
    updatedInstructions[index] = value;
    setHallTicketData({...hallTicketData, instructions: updatedInstructions});
  };

  const addInstruction = () => {
    setHallTicketData({
      ...hallTicketData,
      instructions: [...hallTicketData.instructions, '']
    });
  };

  const removeInstruction = (index) => {
    const updatedInstructions = hallTicketData.instructions.filter((_, i) => i !== index);
    setHallTicketData({...hallTicketData, instructions: updatedInstructions});
  };

  // Get Hall Ticket HTML for printing/download
  const getHallTicketHTML = (student, data, photo) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Hall Ticket - ${data.studentName}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f0f0f0;
          }
          .hall-ticket {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border: 2px solid #333;
            padding: 30px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          .school-name {
            font-size: 28px;
            font-weight: bold;
            color: #b45309;
            margin-bottom: 5px;
          }
          .title {
            font-size: 24px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
          }
          .info-section {
            margin: 20px 0;
            padding: 15px;
            border: 1px solid #ddd;
          }
          .info-row {
            display: flex;
            margin: 10px 0;
            padding: 5px;
          }
          .label {
            font-weight: bold;
            width: 150px;
          }
          .value {
            flex: 1;
          }
          .subjects {
            margin: 20px 0;
          }
          .subjects table {
            width: 100%;
            border-collapse: collapse;
          }
          .subjects th, .subjects td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }
          .subjects th {
            background: #f5f5f5;
          }
          .instructions {
            margin: 20px 0;
            padding: 15px;
            background: #f9f9f9;
          }
          .instructions ul {
            margin: 10px 0;
            padding-left: 20px;
          }
          .instructions li {
            margin: 5px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
          }
          .signature {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
          }
          .photo-container {
            float: right;
            width: 100px;
            height: 120px;
            border: 1px solid #ddd;
            margin-left: 15px;
            margin-bottom: 15px;
            text-align: center;
            overflow: hidden;
          }
          .photo-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .clearfix::after {
            content: "";
            clear: both;
            display: table;
          }
          @media print {
            body {
              background: white;
              padding: 0;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="hall-ticket">
          <div class="header">
            <div class="school-name">${data.schoolName}</div>
            <div>${data.schoolAffiliation}</div>
            <div class="title">${data.examTitle}</div>
          </div>
          
          <div class="clearfix">
            ${photo ? `<div class="photo-container"><img src="${photo}" alt="Student Photo" /></div>` : '<div class="photo-container">No Photo</div>'}
            
            <div class="info-section">
              <div class="info-row">
                <div class="label">Student Name:</div>
                <div class="value">${data.studentName || 'N/A'}</div>
              </div>
              <div class="info-row">
                <div class="label">Father's Name:</div>
                <div class="value">${data.fatherName || 'N/A'}</div>
              </div>
              <div class="info-row">
                <div class="label">Mother's Name:</div>
                <div class="value">${data.motherName || 'N/A'}</div>
              </div>
              <div class="info-row">
                <div class="label">Date of Birth:</div>
                <div class="value">${data.dateOfBirth || 'N/A'}</div>
              </div>
              <div class="info-row">
                <div class="label">Roll Number:</div>
                <div class="value">${data.rollNumber}</div>
              </div>
              <div class="info-row">
                <div class="label">Class/Section:</div>
                <div class="value">${data.studentClass} - ${data.section}</div>
              </div>
              <div class="info-row">
                <div class="label">Admission No:</div>
                <div class="value">${data.admissionNumber || 'N/A'}</div>
              </div>
              <div class="info-row">
                <div class="label">Gender:</div>
                <div class="value">${data.gender || 'N/A'}</div>
              </div>
            </div>
          </div>

          <div class="info-section">
            <div class="info-row">
              <div class="label">Exam Type:</div>
              <div class="value">${data.examType || 'N/A'}</div>
            </div>
            <div class="info-row">
              <div class="label">Exam Date:</div>
              <div class="value">${data.examDate}</div>
            </div>
            <div class="info-row">
              <div class="label">Exam Time:</div>
              <div class="value">${data.examTime}</div>
            </div>
          </div>

          <div class="subjects">
            <h3>Subjects</h3>
            <table>
              <thead>
                <tr><th>Code</th><th>Subject Name</th><th>Date</th><th>Time</th><th>Venue</th></tr>
              </thead>
              <tbody>
                ${data.subjects.map((subject, index) => `
                  <tr>
                    <td>${subject.code || index + 1}</td>
                    <td>${subject.name || 'Subject ' + (index + 1)}</td>
                    <td>${subject.date || data.examDate}</td>
                    <td>${subject.time || data.examTime}</td>
                    <td>${subject.venue || 'Main Hall'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="instructions">
            <h3>Important Instructions:</h3>
            <ul>
              ${data.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
            </ul>
          </div>

          <div class="signature">
            <div>_________________<br>${data.studentSignature || 'Student\'s Signature'}</div>
            <div>_________________<br>${data.principalSignature}<br>${data.principalName}</div>
          </div>

          <div class="footer">
            <p>* This hall ticket is valid only for the mentioned examination</p>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px;" class="no-print">
          <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">Print Hall Ticket</button>
        </div>
      </body>
      </html>
    `;
  };

  // View existing hall ticket
  const viewHallTicket = (student) => {
    const savedTicket = JSON.parse(localStorage.getItem('hallTickets') || '{}')[student.studentId];
    if (savedTicket) {
      setHallTicketData(savedTicket.hallTicketData);
      setStudentPhoto(savedTicket.photo);
      setPhotoPreview(savedTicket.photo);
      setSelectedStudent(student);
      setIsViewModalOpen(true);
    } else {
      generateHallTicket(student);
    }
  };

  // Edit existing hall ticket
  const editHallTicket = (student) => {
    const savedTicket = JSON.parse(localStorage.getItem('hallTickets') || '{}')[student.studentId];
    if (savedTicket) {
      setHallTicketData(savedTicket.hallTicketData);
      setStudentPhoto(savedTicket.photo);
      setPhotoPreview(savedTicket.photo);
    } else {
      const admissionNo = getStudentInfo(student, 'admissionNumber');
      setHallTicketData({
        ...hallTicketData,
        studentName: getStudentInfo(student, 'fullName'),
        fatherName: getStudentInfo(student, 'fatherName'),
        motherName: getStudentInfo(student, 'motherName'),
        studentClass: getStudentInfo(student, 'className'),
        section: getStudentInfo(student, 'section'),
        admissionNumber: admissionNo,
        dateOfBirth: getStudentInfo(student, 'dob'),
        gender: getStudentInfo(student, 'gender'),
        rollNumber: admissionNo || `ROLL${student.studentId?.slice(-6)}`,
      });
      setStudentPhoto(null);
      setPhotoPreview(null);
    }
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Hall Ticket Management</h2>
        <p className="text-gray-600 mt-1">Generate and manage hall tickets for students</p>
      </div>

      {/* Search Bar */}
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

      {/* Students Table */}
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
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">Loading students...</td>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {basicInfo.admissionNo || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {basicInfo.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {basicInfo.grade || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {basicInfo.section || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => viewHallTicket(student)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center space-x-1"
                        >
                          <Eye size={16} />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => editHallTicket(student)}
                          className="text-green-600 hover:text-green-900 inline-flex items-center space-x-1 ml-3"
                        >
                          <Edit size={16} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => generateHallTicket(student)}
                          className="text-purple-600 hover:text-purple-900 inline-flex items-center space-x-1 ml-3"
                        >
                          <Download size={16} />
                          <span>Download</span>
                        </button>
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
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div dangerouslySetInnerHTML={{ __html: getHallTicketHTML(selectedStudent, hallTicketData, studentPhoto) }} />
              
              <div className="mt-6 flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={handleEditHallTicket}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Edit Hall Ticket
                </button>
                <button
                  onClick={downloadHallTicket}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
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
                Edit Hall Ticket - {hallTicketData.studentName}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* School Information Section */}
                <div className="border rounded-lg p-4">
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText size={20} /> School Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                      <input
                        type="text"
                        value={hallTicketData.schoolName}
                        onChange={(e) => handleFieldChange('schoolName', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">School Affiliation</label>
                      <input
                        type="text"
                        value={hallTicketData.schoolAffiliation}
                        onChange={(e) => handleFieldChange('schoolAffiliation', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Exam Title</label>
                      <input
                        type="text"
                        value={hallTicketData.examTitle}
                        onChange={(e) => handleFieldChange('examTitle', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Student Information Section */}
                <div className="border rounded-lg p-4">
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User size={20} /> Student Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                      <input
                        type="text"
                        value={hallTicketData.studentName}
                        onChange={(e) => handleFieldChange('studentName', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                      <input
                        type="text"
                        value={hallTicketData.fatherName}
                        onChange={(e) => handleFieldChange('fatherName', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
                      <input
                        type="text"
                        value={hallTicketData.motherName}
                        onChange={(e) => handleFieldChange('motherName', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={hallTicketData.dateOfBirth}
                        onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                      <input
                        type="text"
                        value={hallTicketData.rollNumber}
                        onChange={(e) => handleFieldChange('rollNumber', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                      <input
                        type="text"
                        value={hallTicketData.studentClass}
                        onChange={(e) => handleFieldChange('studentClass', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                      <input
                        type="text"
                        value={hallTicketData.section}
                        onChange={(e) => handleFieldChange('section', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Admission Number</label>
                      <input
                        type="text"
                        value={hallTicketData.admissionNumber}
                        onChange={(e) => handleFieldChange('admissionNumber', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        value={hallTicketData.gender}
                        onChange={(e) => handleFieldChange('gender', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Student Photo</label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                        {photoPreview && (
                          <img src={photoPreview} alt="Preview" className="w-12 h-12 object-cover rounded" />
                        )}
                      </div>
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
                      <input
                        type="text"
                        value={hallTicketData.examType}
                        onChange={(e) => handleFieldChange('examType', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Exam Date</label>
                      <input
                        type="text"
                        value={hallTicketData.examDate}
                        onChange={(e) => handleFieldChange('examDate', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="e.g., March 15, 2025"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Exam Time</label>
                      <input
                        type="text"
                        value={hallTicketData.examTime}
                        onChange={(e) => handleFieldChange('examTime', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="e.g., 10:00 AM - 1:00 PM"
                      />
                    </div>
                  </div>
                </div>

                {/* Subjects Section */}
                <div className="border rounded-lg p-4">
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookOpen size={20} /> Subjects
                  </h4>
                  {hallTicketData.subjects.map((subject, index) => (
                    <div key={index} className="border-b pb-4 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium">Subject {index + 1}</h5>
                        <button
                          onClick={() => removeSubject(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Subject Name"
                          value={subject.name}
                          onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2"
                        />
                        <input
                          type="text"
                          placeholder="Subject Code"
                          value={subject.code}
                          onChange={(e) => handleSubjectChange(index, 'code', e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2"
                        />
                        <input
                          type="text"
                          placeholder="Date"
                          value={subject.date}
                          onChange={(e) => handleSubjectChange(index, 'date', e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2"
                        />
                        <input
                          type="text"
                          placeholder="Time"
                          value={subject.time}
                          onChange={(e) => handleSubjectChange(index, 'time', e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2"
                        />
                        <input
                          type="text"
                          placeholder="Venue"
                          value={subject.venue}
                          onChange={(e) => handleSubjectChange(index, 'venue', e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addSubject}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    + Add Subject
                  </button>
                </div>

                {/* Instructions Section */}
                <div className="border rounded-lg p-4">
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText size={20} /> Instructions
                  </h4>
                  {hallTicketData.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={instruction}
                        onChange={(e) => handleInstructionChange(index, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                        placeholder={`Instruction ${index + 1}`}
                      />
                      <button
                        onClick={() => removeInstruction(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addInstruction}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    + Add Instruction
                  </button>
                </div>

                {/* Signatures Section */}
                <div className="border rounded-lg p-4">
                  <h4 className="text-lg font-semibold mb-4">Signatures</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Student Signature Label</label>
                      <input
                        type="text"
                        value={hallTicketData.studentSignature}
                        onChange={(e) => handleFieldChange('studentSignature', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Principal Signature Label</label>
                      <input
                        type="text"
                        value={hallTicketData.principalSignature}
                        onChange={(e) => handleFieldChange('principalSignature', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Principal Name</label>
                      <input
                        type="text"
                        value={hallTicketData.principalName}
                        onChange={(e) => handleFieldChange('principalName', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveHallTicket}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <Save size={18} />
                  <span>Save Hall Ticket</span>
                </button>
                <button
                  onClick={() => {
                    handleSaveHallTicket();
                    setTimeout(() => downloadHallTicket(), 500);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
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
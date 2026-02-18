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
  X,
  Mail,
  FileText,
  Home,
  School,
  Hash,
  DollarSign,
  Briefcase,
  Award,
  FileDigit,
  Plus,
  Trash2
} from 'lucide-react';

// ────────────────────────────────────────────────
//  IMPORTANT: adjust path according to your project structure
// ────────────────────────────────────────────────
import StudentApi from '../service/StudentApi';
import { toast } from 'react-toastify';

const AddStudent = ({ onStudentAdded, onCancel }) => {
  const initialStudentState = {
    basicInfo: {
      name: '',
      dob: '',
      studentAadhar: '',
      fatherName: '',
      fatherAadhar: '',
      motherName: '',
      motherAadhar: '',
      fatherPhone: '',
      motherPhone: '',
      fatherOccupation: '',
      motherOccupation: '',
      fatherEmail: '',
      motherEmail: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      grade: '',
      section: '',
      admissionNo: '',
      admissionDate: new Date().toISOString().split('T')[0],
      previousSchool: '',
      bloodGroup: '',
      emergencyContact: '',
      emergencyPhone: ''
    },
    feeStructure: {
      tuition: '',
      books: '',
      uniform: '',
      transport: '',
      other: '',
      total: 0,
      includesBooks: false,
      includesUniform: false,
      includesTransport: false
    },
    installmentConfig: {
      numberOfInstallments: 3,
      installments: [
        { number: 1, dueDate: new Date().toISOString().split('T')[0], amount: '' },
        { number: 2, dueDate: '', amount: '' },
        { number: 3, dueDate: '', amount: '' }
      ]
    },
    marksConfig: {
      subjects: [],      // [{ name: string, maxMarks: number }]
      examTypes: []
    }
  };
  ;

  const [newStudent, setNewStudent] = useState(initialStudentState);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectMaxMarks, setNewSubjectMaxMarks] = useState('');
  const [newExamType, setNewExamType] = useState('');
  const [newSubjectObtainedMarks, setNewSubjectObtainedMarks] = useState('');
  // API states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const resetForm = () => {
    setNewStudent(initialStudentState);
    setNewSubjectName('');
    setNewExamType('');
    setNewGrade({ grade: '', min: '' });
    setError(null);
  };

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

  const updateInstallmentAmounts = (totalFees) => {
    const numberOfInstallments = newStudent.installmentConfig.numberOfInstallments;
    const baseAmount = Math.floor(totalFees / numberOfInstallments);
    const remainder = totalFees % numberOfInstallments;

    const installments = Array.from({ length: numberOfInstallments }, (_, i) => ({
      number: i + 1,
      dueDate: i === 0 ? new Date().toISOString().split('T')[0] : '',
      amount: baseAmount + (i === numberOfInstallments - 1 ? remainder : 0)
    }));

    setNewStudent(prev => ({
      ...prev,
      installmentConfig: {
        ...prev.installmentConfig,
        installments
      }
    }));
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
      [field]: field.includes('include') ? !!value : Number(value) || 0
    };

    const totalFees = calculateTotalFees();
    updatedFees.total = totalFees;

    setNewStudent(prev => ({
      ...prev,
      feeStructure: updatedFees
    }));

    updateInstallmentAmounts(totalFees);
  };

  const handleInstallmentConfigChange = (field, value) => {
    if (field === 'numberOfInstallments') {
      const num = parseInt(value) || 1;
      const totalFees = calculateTotalFees();
      const baseAmount = Math.floor(totalFees / num);
      const remainder = totalFees % num;

      const installments = Array.from({ length: num }, (_, i) => ({
        number: i + 1,
        dueDate: i === 0 ? new Date().toISOString().split('T')[0] : '',
        amount: baseAmount + (i === num - 1 ? remainder : 0)
      }));

      setNewStudent(prev => ({
        ...prev,
        installmentConfig: {
          ...prev.installmentConfig,
          numberOfInstallments: num,
          installments
        }
      }));
    }
  };

  const handleInstallmentChange = (index, field, value) => {
    const updatedInstallments = [...newStudent.installmentConfig.installments];
    updatedInstallments[index] = {
      ...updatedInstallments[index],
      [field]: field === 'amount' ? Number(value) || 0 : value
    };

    setNewStudent(prev => ({
      ...prev,
      installmentConfig: {
        ...prev.installmentConfig,
        installments: updatedInstallments
      }
    }));
  };

  const handleAddSubject = () => {
    if (newSubjectName.trim() && newSubjectMaxMarks && newSubjectObtainedMarks !== '') {
      const max = Number(newSubjectMaxMarks);
      const obtained = Number(newSubjectObtainedMarks);

      // Optional: basic validation
      if (obtained > max) {
        toast.error("Obtained marks cannot be greater than maximum marks");
        return;
      }

      setNewStudent(prev => ({
        ...prev,
        marksConfig: {
          ...prev.marksConfig,
          subjects: [
            ...prev.marksConfig.subjects,
            {
              name: newSubjectName.trim(),
              maxMarks: max,
              obtainedMarks: obtained
            }
          ]
        }
      }));

      // Clear inputs
      setNewSubjectName('');
      setNewSubjectMaxMarks('');
      setNewSubjectObtainedMarks('');
    } else {
      toast.warn("Please fill all subject fields");
    }
  };
  const handleRemoveSubject = (index) => {
    setNewStudent(prev => ({
      ...prev,
      marksConfig: {
        ...prev.marksConfig,
        subjects: prev.marksConfig.subjects.filter((_, i) => i !== index)
      }
    }));
  };

  // ==================== EXAM TYPES ====================
  const handleAddExamType = () => {
    if (newExamType.trim()) {
      setNewStudent(prev => ({
        ...prev,
        marksConfig: {
          ...prev.marksConfig,
          examTypes: [...prev.marksConfig.examTypes, newExamType.trim()]
        }
      }));
      setNewExamType('');
    }
  };

  const handleRemoveExamType = (index) => {
    setNewStudent(prev => ({
      ...prev,
      marksConfig: {
        ...prev.marksConfig,
        examTypes: prev.marksConfig.examTypes.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const totalFees = calculateTotalFees();

      const installments = newStudent.installmentConfig.installments.map((inst, index) => ({
        id: Date.now() + index + 1,
        number: inst.number,
        amount: Number(inst.amount) || 0,
        paid: 0,
        dueDate: inst.dueDate || '',
        paidDate: '',
        status: 'pending',
        paymentMode: '',
        notes: ''
      }));

      const studentData = {
        basicInfo: { ...newStudent.basicInfo },
        feeStructure: { ...newStudent.feeStructure, total: totalFees },
        installments,
        marks: {
          subjects: newStudent.marksConfig.subjects,   // now has obtainedMarks
          examTypes: newStudent.marksConfig.examTypes,
          exams: [],  // you can later populate this with per-exam data
          totalMarks: newStudent.marksConfig.subjects.reduce((sum, s) => sum + s.maxMarks, 0),
          totalObtained: newStudent.marksConfig.subjects.reduce((sum, s) => sum + s.obtainedMarks, 0),
          averagePercentage: newStudent.marksConfig.subjects.length > 0
            ? ((newStudent.marksConfig.subjects.reduce((sum, s) => sum + s.obtainedMarks, 0) /
              newStudent.marksConfig.subjects.reduce((sum, s) => sum + s.maxMarks, 0)) * 100).toFixed(2)
            : 0,
          overallGrade: ''   // you can compute this later based on percentage
        },
        totalPaid: 0,
        pendingAmount: totalFees
      };

      const result = await StudentApi.createStudent(studentData);

      if (!result.success) {
        throw new Error(result.error || 'Failed to create student');
      }

      toast.success(`Student created successfully!`);

      if (onStudentAdded) {
        onStudentAdded(result.student);
      }

      // Reset form after success
      resetForm();

    } catch (err) {
      console.error('Student creation failed:', err);
      setError(err.message || 'Could not create student. Please check your input.');
      toast.error(err.message || "Student creation failed")
    } finally {
      setLoading(false);
    } 
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
            disabled={loading}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 flex items-center space-x-2 disabled:opacity-50"
          >
            <X size={20} />
            <span>Cancel</span>
          </button>
        </div>

        {/* {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )} */}

        <div className="space-y-8">

          {/* ────────────────────────────────────────────────
               STUDENT INFORMATION
          ──────────────────────────────────────────────── */}
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
            <div className="flex items-center space-x-3 mb-6">
              <User className="text-amber-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Student Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={newStudent.basicInfo.name}
                  onChange={(e) => handleBasicInfoChange('name', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter student name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                <input
                  type="date"
                  value={newStudent.basicInfo.dob}
                  onChange={(e) => handleBasicInfoChange('dob', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student Aadhar Number *</label>
                <input
                  type="text"
                  value={newStudent.basicInfo.studentAadhar}
                  onChange={(e) => handleBasicInfoChange('studentAadhar', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  pattern="[0-9]{4}-[0-9]{4}-[0-9]{4}"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                <select
                  value={newStudent.basicInfo.bloodGroup}
                  onChange={(e) => handleBasicInfoChange('bloodGroup', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade/Class *</label>
                <select
                  value={newStudent.basicInfo.grade}
                  onChange={(e) => handleBasicInfoChange('grade', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Grade</option>
                  <option value="Nursery">Nursery</option>
                  <option value="LKG">LKG</option>
                  <option value="UKG">UKG</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                    <option key={grade} value={grade.toString()}>Grade {grade}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                <input
                  type="text"
                  value={newStudent.basicInfo.section}
                  onChange={(e) => handleBasicInfoChange('section', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="A, B, C..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admission Number *</label>
                <input
                  type="text"
                  value={newStudent.basicInfo.admissionNo}
                  onChange={(e) => handleBasicInfoChange('admissionNo', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admission Date *</label>
                <input
                  type="date"
                  value={newStudent.basicInfo.admissionDate}
                  onChange={(e) => handleBasicInfoChange('admissionDate', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────
               PARENT INFORMATION
          ──────────────────────────────────────────────── */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center space-x-3 mb-6">
              <User className="text-blue-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Parent Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <h4 className="font-semibold text-gray-700 mb-4 border-b pb-2">Father's Details</h4>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Father's Name *</label>
                <input
                  type="text"
                  value={newStudent.basicInfo.fatherName}
                  onChange={(e) => handleBasicInfoChange('fatherName', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter father's name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Father's Aadhar Number *</label>
                <input
                  type="text"
                  value={newStudent.basicInfo.fatherAadhar}
                  onChange={(e) => handleBasicInfoChange('fatherAadhar', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  pattern="[0-9]{4}-[0-9]{4}-[0-9]{4}"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Father's Occupation</label>
                <input
                  type="text"
                  value={newStudent.basicInfo.fatherOccupation}
                  onChange={(e) => handleBasicInfoChange('fatherOccupation', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Occupation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Father's Phone *</label>
                <input
                  type="tel"
                  value={newStudent.basicInfo.fatherPhone}
                  onChange={(e) => handleBasicInfoChange('fatherPhone', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="9876543210"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Father's Email</label>
                <input
                  type="email"
                  value={newStudent.basicInfo.fatherEmail}
                  onChange={(e) => handleBasicInfoChange('fatherEmail', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="father@email.com"
                />
              </div>

              <div className="md:col-span-2 mt-6">
                <h4 className="font-semibold text-gray-700 mb-4 border-b pb-2">Mother's Details</h4>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Name *</label>
                <input
                  type="text"
                  value={newStudent.basicInfo.motherName}
                  onChange={(e) => handleBasicInfoChange('motherName', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter mother's name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Aadhar Number *</label>
                <input
                  type="text"
                  value={newStudent.basicInfo.motherAadhar}
                  onChange={(e) => handleBasicInfoChange('motherAadhar', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  pattern="[0-9]{4}-[0-9]{4}-[0-9]{4}"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Occupation</label>
                <input
                  type="text"
                  value={newStudent.basicInfo.motherOccupation}
                  onChange={(e) => handleBasicInfoChange('motherOccupation', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Occupation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Phone *</label>
                <input
                  type="tel"
                  value={newStudent.basicInfo.motherPhone}
                  onChange={(e) => handleBasicInfoChange('motherPhone', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="9876543211"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Email</label>
                <input
                  type="email"
                  value={newStudent.basicInfo.motherEmail}
                  onChange={(e) => handleBasicInfoChange('motherEmail', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="mother@email.com"
                />
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────
               ADDRESS INFORMATION
          ──────────────────────────────────────────────── */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center space-x-3 mb-6">
              <Home className="text-green-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Address Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <textarea
                  value={newStudent.basicInfo.address}
                  onChange={(e) => handleBasicInfoChange('address', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Full address"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  value={newStudent.basicInfo.city}
                  onChange={(e) => handleBasicInfoChange('city', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="City"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                <input
                  type="text"
                  value={newStudent.basicInfo.state}
                  onChange={(e) => handleBasicInfoChange('state', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="State"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                <input
                  type="text"
                  value={newStudent.basicInfo.pincode}
                  onChange={(e) => handleBasicInfoChange('pincode', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Pincode"
                  required
                />
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────
               EMERGENCY CONTACT
          ──────────────────────────────────────────────── */}
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
            <div className="flex items-center space-x-3 mb-6">
              <Phone className="text-red-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Emergency Contact</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name *</label>
                <input
                  type="text"
                  value={newStudent.basicInfo.emergencyContact}
                  onChange={(e) => handleBasicInfoChange('emergencyContact', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Emergency contact name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Phone *</label>
                <input
                  type="tel"
                  value={newStudent.basicInfo.emergencyPhone}
                  onChange={(e) => handleBasicInfoChange('emergencyPhone', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="9876543212"
                  required
                />
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────
               FEE STRUCTURE + INSTALLMENTS
          ──────────────────────────────────────────────── */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center space-x-3 mb-6">
              <Calculator className="text-purple-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Fee Structure</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tuition Fee</label>
                <input
                  type="number"
                  value={newStudent.feeStructure.tuition || ''}
                  onChange={(e) => handleFeeChange('tuition', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Books & Stationery</label>
                <input
                  type="number"
                  value={newStudent.feeStructure.books || ''}
                  onChange={(e) => handleFeeChange('books', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <label className="inline-flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={newStudent.feeStructure.includesBooks}
                    onChange={(e) => handleFeeChange('includesBooks', e.target.checked)}
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Include in total</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Uniform</label>
                <input
                  type="number"
                  value={newStudent.feeStructure.uniform || ''}
                  onChange={(e) => handleFeeChange('uniform', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <label className="inline-flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={newStudent.feeStructure.includesUniform}
                    onChange={(e) => handleFeeChange('includesUniform', e.target.checked)}
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Include in total</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transport</label>
                <input
                  type="number"
                  value={newStudent.feeStructure.transport || ''}
                  onChange={(e) => handleFeeChange('transport', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <label className="inline-flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={newStudent.feeStructure.includesTransport}
                    onChange={(e) => handleFeeChange('includesTransport', e.target.checked)}
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Include in total</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Other Fees</label>
                <input
                  type="number"
                  value={newStudent.feeStructure.other || ''}
                  onChange={(e) => handleFeeChange('other', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Miscellaneous fees"
                />
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-center">
                  <div className="text-sm text-gray-600">Total Fees</div>
                  <div className="text-2xl font-bold text-purple-700">
                    ₹{calculateTotalFees().toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Installment Configuration */}
            <div className="border-t border-purple-200 pt-6 mt-6">
              <div className="flex items-center space-x-3 mb-6">
                <Calculator className="text-purple-600" size={24} />
                <h3 className="text-lg font-semibold text-gray-800">Installment Configuration</h3>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Installments</label>
                <select
                  value={newStudent.installmentConfig.numberOfInstallments}
                  onChange={(e) => handleInstallmentConfigChange('numberOfInstallments', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} Installment{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                {newStudent.installmentConfig.installments.map((inst, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">
                        Installment {inst.number} Amount
                      </label>
                      <input
                        type="number"
                        value={inst.amount || ''}
                        onChange={(e) => handleInstallmentChange(index, 'amount', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">Due Date</label>
                      <input
                        type="date"
                        value={inst.dueDate}
                        onChange={(e) => handleInstallmentChange(index, 'dueDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────
               MARKS / ACADEMIC CONFIGURATION
          ──────────────────────────────────────────────── */}
          <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
            <div className="flex items-center space-x-3 mb-6">
              <Award className="text-indigo-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Academic Marks Configuration</h3>
            </div>

            <div className="space-y-10">

              {/* SUBJECTS WITH MAX MARKS */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">Subjects (with Maximum Marks)</label>
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Subject name e.g. Mathematics"
                  />
                  <input
                    type="number"
                    value={newSubjectObtainedMarks}
                    onChange={(e) => setNewSubjectObtainedMarks(e.target.value)}
                    className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Obtained"
                    min="0"
                  />
                  <input
                    type="number"
                    value={newSubjectMaxMarks}
                    onChange={(e) => setNewSubjectMaxMarks(e.target.value)}
                    className="w-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Max marks"
                    min="1"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubject}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                  >
                    <Plus size={18} /> Add
                  </button>
                </div>

                <div className="space-y-2">
                  {newStudent.marksConfig.subjects.map((sub, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-300"
                    >
                      <div>
                        <span className="font-medium">{sub.name}</span>
                        <span className="text-indigo-600 ml-2">
                          (Max: {sub.maxMarks} | Obtained: {sub.obtainedMarks})
                        </span>
                        <span className="text-gray-500 ml-3">
                          {((sub.obtainedMarks / sub.maxMarks) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* EXAM TYPES */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">Exam Types</label>
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={newExamType}
                    onChange={(e) => setNewExamType(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Exam type e.g. Half Yearly"
                  />
                  <button
                    type="button"
                    onClick={handleAddExamType}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                  >
                    <Plus size={18} /> Add
                  </button>
                </div>

                <div className="space-y-2">
                  {newStudent.marksConfig.examTypes.map((exam, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-300">
                      <span className="text-sm font-medium text-gray-800">{exam}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExamType(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────
               ACTION BUTTONS
          ──────────────────────────────────────────────── */}
          <div className="flex justify-end space-x-4 mt-10">
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-6 py-3 text-white rounded-lg font-medium flex items-center space-x-2 ${loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800'
                }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Save Student</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddStudent;
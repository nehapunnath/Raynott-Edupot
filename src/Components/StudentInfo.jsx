import React, { useState, useEffect, useCallback } from 'react';
import { 
  User, Users, MapPin, Phone, Edit2, Save, X, Loader2, AlertCircle
} from 'lucide-react';

const StudentInfo = ({ 
  student, 
  editedStudent, 
  isEditing, 
  isSaving, 
  showSuccessMessage,
  onEditToggle, 
  onSaveChanges, 
  onChange,
  onCancel
}) => {
  // Editable Field Component
  const EditableField = ({ label, value: initialValue, onCommit, type = 'text', className = '' }) => {
    const [localValue, setLocalValue] = useState(initialValue ?? '');

    useEffect(() => {
      setLocalValue(initialValue ?? '');
    }, [initialValue]);

    const handleLocalChange = (e) => {
      setLocalValue(e.target.value);
    };

    const handleBlur = () => {
      if (localValue !== initialValue) {
        onCommit(localValue);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.target.blur();
      }
    };

    return (
      <div className={className}>
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        {isEditing ? (
          <input
            type={type}
            value={localValue}
            onChange={handleLocalChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            autoComplete="off"
          />
        ) : (
          <p className="font-medium text-gray-900">{initialValue || '—'}</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Edit controls */}
      <div className="flex justify-end">
        {isEditing ? (
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              disabled={isSaving}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2 disabled:opacity-60 transition-colors"
            >
              <X size={18} /> Cancel
            </button>
            <button
              onClick={onSaveChanges}
              disabled={isSaving}
              className={`px-7 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors ${
                isSaving ? 'opacity-70 cursor-wait' : ''
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={18} /> Save Changes
                </>
              )}
            </button>
          </div>
        ) : (
          <button
            onClick={onEditToggle}
            className="px-7 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <Edit2 size={18} /> Edit Information
          </button>
        )}
      </div>

      {showSuccessMessage && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-center gap-3 animate-fade-in">
          <AlertCircle size={20} />
          <span>Student information updated successfully!</span>
        </div>
      )}

      {/* Personal Information */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
          <User size={22} /> Personal Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <EditableField 
            label="Full Name" 
            value={editedStudent.basicInfo.name} 
            onCommit={(v) => onChange('name', v)} 
          />
          <EditableField 
            label="Date of Birth" 
            value={editedStudent.basicInfo.dob} 
            onCommit={(v) => onChange('dob', v)} 
            type="date" 
          />
          <EditableField 
            label="Grade" 
            value={editedStudent.basicInfo.grade} 
            onCommit={(v) => onChange('grade', v)} 
          />
          <EditableField 
            label="Section" 
            value={editedStudent.basicInfo.section} 
            onCommit={(v) => onChange('section', v)} 
          />
          <EditableField 
            label="Blood Group" 
            value={editedStudent.basicInfo.bloodGroup} 
            onCommit={(v) => onChange('bloodGroup', v)} 
          />
          <EditableField 
            label="Student Aadhar" 
            value={editedStudent.basicInfo.studentAadhar} 
            onCommit={(v) => onChange('studentAadhar', v)} 
          />
          <EditableField 
            label="Admission Date" 
            value={editedStudent.basicInfo.admissionDate} 
            onCommit={(v) => onChange('admissionDate', v)} 
            type="date" 
          />
        </div>
      </div>

      {/* Parent Information */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
          <Users size={22} /> Parent / Guardian Information
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <p className="font-medium text-gray-700 mb-4">Father's Details</p>
            <div className="space-y-4">
              <EditableField 
                label="Name" 
                value={editedStudent.basicInfo.fatherName} 
                onCommit={(v) => onChange('fatherName', v)} 
              />
              <EditableField 
                label="Aadhar" 
                value={editedStudent.basicInfo.fatherAadhar} 
                onCommit={(v) => onChange('fatherAadhar', v)} 
              />
              <EditableField 
                label="Phone" 
                value={editedStudent.basicInfo.fatherPhone} 
                onCommit={(v) => onChange('fatherPhone', v)} 
              />
              <EditableField 
                label="Email" 
                value={editedStudent.basicInfo.fatherEmail} 
                onCommit={(v) => onChange('fatherEmail', v)} 
                type="email" 
              />
              <EditableField 
                label="Occupation" 
                value={editedStudent.basicInfo.fatherOccupation} 
                onCommit={(v) => onChange('fatherOccupation', v)} 
              />
            </div>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-4">Mother's Details</p>
            <div className="space-y-4">
              <EditableField 
                label="Name" 
                value={editedStudent.basicInfo.motherName} 
                onCommit={(v) => onChange('motherName', v)} 
              />
              <EditableField 
                label="Aadhar" 
                value={editedStudent.basicInfo.motherAadhar} 
                onCommit={(v) => onChange('motherAadhar', v)} 
              />
              <EditableField 
                label="Phone" 
                value={editedStudent.basicInfo.motherPhone} 
                onCommit={(v) => onChange('motherPhone', v)} 
              />
              <EditableField 
                label="Email" 
                value={editedStudent.basicInfo.motherEmail} 
                onCommit={(v) => onChange('motherEmail', v)} 
                type="email" 
              />
              <EditableField 
                label="Occupation" 
                value={editedStudent.basicInfo.motherOccupation} 
                onCommit={(v) => onChange('motherOccupation', v)} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Address & Emergency Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-green-50 rounded-xl p-6 border border-green-100 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <MapPin size={22} /> Address
          </h3>
          <div className="space-y-4">
            <EditableField 
              label="Full Address" 
              value={editedStudent.basicInfo.address} 
              onCommit={(v) => onChange('address', v)} 
            />
            <div className="grid grid-cols-3 gap-4">
              <EditableField 
                label="City" 
                value={editedStudent.basicInfo.city} 
                onCommit={(v) => onChange('city', v)} 
              />
              <EditableField 
                label="State" 
                value={editedStudent.basicInfo.state} 
                onCommit={(v) => onChange('state', v)} 
              />
              <EditableField 
                label="Pincode" 
                value={editedStudent.basicInfo.pincode} 
                onCommit={(v) => onChange('pincode', v)} 
              />
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-xl p-6 border border-red-100 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <Phone size={22} /> Emergency Contact
          </h3>
          <div className="space-y-4">
            <EditableField 
              label="Contact Name" 
              value={editedStudent.basicInfo.emergencyContact} 
              onCommit={(v) => onChange('emergencyContact', v)} 
            />
            <EditableField 
              label="Phone Number" 
              value={editedStudent.basicInfo.emergencyPhone} 
              onCommit={(v) => onChange('emergencyPhone', v)} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentInfo;
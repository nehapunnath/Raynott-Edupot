import React, { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import StudentApi from '../service/StudentApi'; // Adjust path as needed

const FeesInstallment = ({ student, onUpdateStudent }) => {
  const [showCustomStatus, setShowCustomStatus] = useState({});
  const [customStatusText, setCustomStatusText] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Local pending changes — key = installment.id
  const [localChanges, setLocalChanges] = useState({});

  const studentId = student.studentId || student.id;

  // ────────────────────────────────────────────────
  // Refresh from backend after successful operations
  // ────────────────────────────────────────────────
  const refreshStudent = async () => {
    try {
      const res = await StudentApi.getStudent(studentId);
      if (res.success && res.student) {
        // Update parent component (important for list & progress)
        onUpdateStudent(res.student);
        
        // Clear all local edits so fields show real database values
        setLocalChanges({});
        setShowCustomStatus({});
        setCustomStatusText({});
      } else {
        console.warn("Refresh didn't return valid student", res);
      }
    } catch (err) {
      console.error("Failed to refresh student data", err);
    }
  };

  // Get value to display: prefer local edit → otherwise real database value
  const getValue = (instId, field) => {
    // If we have unsaved local change → show it
    if (localChanges[instId]?.hasOwnProperty(field)) {
      return localChanges[instId][field];
    }

    // Otherwise show real value from prop (database)
    const inst = student.installments?.find(i => i.id === instId);
    const val = inst?.[field];

    // For numeric fields: show empty string instead of 0 when appropriate
    if (['amount', 'paid'].includes(field)) {
      return (val == null || Number(val) === 0) ? '' : val;
    }

    return val ?? '';
  };

  const hasChanges = (instId) => !!localChanges[instId];

  const updateLocal = (instId, field, value) => {
    setLocalChanges(prev => ({
      ...prev,
      [instId]: {
        ...prev[instId],
        [field]: value,
      },
    }));
  };

  // ────────────────────────────────────────────────
  // Save changes for one installment
  // ────────────────────────────────────────────────
  const saveInstallment = async (instId) => {
    if (savingId) return;
    setSavingId(instId);
    setErrorMsg(null);

    try {
      const changes = localChanges[instId] || {};
      if (Object.keys(changes).length === 0) return;

      const payload = { ...changes };
      if ('amount' in payload) payload.amount = Number(payload.amount) || 0;
      if ('paid'   in payload) payload.paid   = Number(payload.paid)   || 0;

      const result = await StudentApi.updateInstallment(studentId, instId, payload);

      if (result.success) {
        await refreshStudent(); // ← this updates everything
      } else {
        setErrorMsg(result.message || result.error || 'Failed to save');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Network/server error');
      console.error('Save failed:', err);
    } finally {
      setSavingId(null);
    }
  };

  // ────────────────────────────────────────────────
  // Add new installment (saves immediately)
  // ────────────────────────────────────────────────
  const addInstallment = async () => {
    if (savingId) return;
    setSavingId('add');
    setErrorMsg(null);

    try {
      const count = student.installments?.length || 0;
      const suggested = Math.round((student.feeStructure?.total || 0) / (count + 1)) || 0;

      const newData = {
        amount: suggested,
        dueDate: '',
        paid: 0,
        paidDate: '',
        paymentMode: '',
        notes: '',
      };

      const result = await StudentApi.addInstallment(studentId, newData);

      if (result.success) {
        await refreshStudent();
      } else {
        setErrorMsg(result.error || 'Failed to add installment');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error adding installment');
    } finally {
      setSavingId(null);
    }
  };

  // ────────────────────────────────────────────────
  // Delete installment
  // ────────────────────────────────────────────────
  const deleteInstallment = async (instId) => {
  if (savingId) return;
  if (!window.confirm('Delete this installment?')) return;

  setSavingId(instId);
  setErrorMsg(null);

  console.log("DELETE called with →", {
    studentId,
    installmentId: instId,
    typeOfId: typeof instId,
    currentInstallments: student.installments?.map(i => ({id: i.id, type: typeof i.id}))
  });

  try {
    const result = await StudentApi.deleteInstallment(studentId, instId);
    console.log("DELETE response:", result);

    if (result.success) {
      console.log("Delete success → refreshing");
      await refreshStudent();
    } else {
      setErrorMsg(result.message || result.error || 'Delete failed');
    }
  } catch (err) {
    console.error("Delete error:", err);
    setErrorMsg(err.message || 'Network/server error during delete');
  } finally {
    setSavingId(null);
  }
};

  // ────────────────────────────────────────────────
  // Status handling
  // ────────────────────────────────────────────────
  const handleStatusChange = (instId, value) => {
    if (value === 'custom') {
      setShowCustomStatus(prev => ({ ...prev, [instId]: true }));
      return;
    }
    updateLocal(instId, 'status', value);
  };

  const saveCustomStatus = (instId) => {
    const custom = (customStatusText[instId] || '').trim();
    if (!custom) return;

    updateLocal(instId, 'status', custom);
    setShowCustomStatus(prev => ({ ...prev, [instId]: false }));
    setCustomStatusText(prev => ({ ...prev, [instId]: '' }));
    // User must click Save button to persist
  };

  // ────────────────────────────────────────────────
  // Calculated summary (always from latest prop)
  // ────────────────────────────────────────────────
  const totalFees     = student.feeStructure?.total || 0;
  const totalPaid     = student.totalPaid || 0;
  const pendingAmount = student.pendingAmount || 0;
  const progress      = totalFees > 0 ? Math.round((totalPaid / totalFees) * 100) : 0;

  // ────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────
  const statusOptions = [
    { value: 'pending',   label: 'Pending'   },
    { value: 'partial',   label: 'Partial'   },
    { value: 'paid',      label: 'Paid'      },
    { value: 'overdue',   label: 'Overdue'   },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded',  label: 'Refunded'  },
    { value: 'custom',    label: 'Custom…'   },
  ];

  return (
    <div className="relative">
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
          {errorMsg}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Fee Installments</h3>
          <p className="text-sm text-gray-600 mt-1">
            Edit → click <strong>Save</strong> → values & progress update
          </p>
        </div>

        <button
          onClick={addInstallment}
          disabled={!!savingId}
          className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 disabled:opacity-60 flex items-center gap-2 shadow-sm"
        >
          <Plus size={18} />
          Add Installment
        </button>
      </div>

      <div className="space-y-6">
        {(student.installments || []).map(inst => {
          const isSaving = savingId === inst.id;
          const hasUnsaved = hasChanges(inst.id);
          const currentStatus = getValue(inst.id, 'status') || 'pending';

          return (
            <div
              key={inst.id}
              className={`border rounded-xl p-5 transition-all ${
                hasUnsaved
                  ? 'border-amber-400 bg-amber-50/40 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      currentStatus === 'paid' || currentStatus === 'completed' ? 'bg-green-500' :
                      currentStatus === 'partial' ? 'bg-amber-500' :
                      currentStatus === 'overdue' ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}
                  />
                  <span className="font-bold text-lg text-gray-900">
                    Installment {inst.number}
                  </span>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                    {currentStatus.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => saveInstallment(inst.id)}
                    disabled={isSaving || !hasUnsaved}
                    className={`px-5 py-2 rounded-lg text-white flex items-center gap-2 text-sm font-medium transition ${
                      hasUnsaved && !isSaving
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-green-400 cursor-not-allowed opacity-70'
                    }`}
                  >
                    <Save size={16} />
                    {isSaving ? 'Saving…' : 'Save'}
                  </button>

                  <button
                    onClick={() => deleteInstallment(inst.id)}
                    disabled={isSaving}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>

                {showCustomStatus[inst.id] ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customStatusText[inst.id] || ''}
                      onChange={e => setCustomStatusText(p => ({ ...p, [inst.id]: e.target.value }))}
                      placeholder="Custom status..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      disabled={isSaving}
                    />
                    <button
                      onClick={() => saveCustomStatus(inst.id)}
                      disabled={isSaving}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60 text-sm"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => {
                        setShowCustomStatus(p => ({ ...p, [inst.id]: false }));
                        setCustomStatusText(p => ({ ...p, [inst.id]: '' }));
                      }}
                      disabled={isSaving}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-60 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <select
                    value={currentStatus}
                    onChange={e => handleStatusChange(inst.id, e.target.value)}
                    disabled={isSaving}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    value={getValue(inst.id, 'amount')}
                    onChange={e => updateLocal(inst.id, 'amount', e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Paid</label>
                  <input
                    type="number"
                    value={getValue(inst.id, 'paid')}
                    onChange={e => updateLocal(inst.id, 'paid', e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={getValue(inst.id, 'dueDate')}
                    onChange={e => updateLocal(inst.id, 'dueDate', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Paid Date</label>
                  <input
                    type="date"
                    value={getValue(inst.id, 'paidDate')}
                    onChange={e => updateLocal(inst.id, 'paidDate', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode</label>
                  <select
                    value={getValue(inst.id, 'paymentMode')}
                    onChange={e => updateLocal(inst.id, 'paymentMode', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
                    disabled={isSaving}
                  >
                    <option value="">— Select —</option>
                    <option value="Cash">Cash</option>
                    <option value="Online">Online</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={getValue(inst.id, 'notes')}
                    onChange={e => updateLocal(inst.id, 'notes', e.target.value)}
                    placeholder="Transaction ID, remarks, etc..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 min-h-[90px]"
                    disabled={isSaving}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary – updates automatically when student prop changes */}
      <div className="mt-10 p-6 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border border-amber-200">
        <h4 className="font-semibold text-gray-800 mb-4 text-lg">Fee Summary</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-sm text-gray-600">Total Fees</p>
            <p className="text-2xl font-bold text-gray-900">₹{totalFees.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Paid</p>
            <p className="text-2xl font-bold text-green-700">₹{totalPaid.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-red-700">₹{pendingAmount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Installments</p>
            <p className="text-2xl font-bold text-blue-700">{student.installments?.length || 0}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-700 mb-2 font-medium">
            <span>Collection Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeesInstallment;
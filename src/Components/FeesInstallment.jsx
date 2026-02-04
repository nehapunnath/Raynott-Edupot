import React, { useState } from 'react';
import { Plus, Trash2, CreditCard, Calculator } from 'lucide-react';

const FeesInstallment = ({ student, onUpdateStudent }) => {
  const [showCustomStatus, setShowCustomStatus] = useState({});
  const [customStatusText, setCustomStatusText] = useState({});

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-red-100 text-red-800' },
    { value: 'partial', label: 'Partial', color: 'bg-amber-100 text-amber-800' },
    { value: 'paid', label: 'Paid', color: 'bg-green-100 text-green-800' },
    { value: 'overdue', label: 'Overdue', color: 'bg-orange-100 text-orange-800' },
    { value: 'completed', label: 'Completed', color: 'bg-blue-100 text-blue-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-gray-100 text-gray-800' },
    { value: 'refunded', label: 'Refunded', color: 'bg-purple-100 text-purple-800' },
    { value: 'custom', label: 'Custom Status', color: 'bg-indigo-100 text-indigo-800' }
  ];

  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status) || 
                   statusOptions.find(opt => opt.value === 'custom');
    return option?.color || 'bg-blue-100 text-blue-800';
  };

  const getStatusLabel = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    if (option) return option.label;
    
    // Check if it's a custom status
    if (status && !statusOptions.find(opt => opt.value === status)) {
      return status;
    }
    
    return 'Pending';
  };

  const addInstallment = () => {
    const newInstallmentNumber = student.installments.length + 1;
    const averageAmount = Math.round(student.feeStructure.total / student.installments.length) || 0;
    
    const updatedStudent = {
      ...student,
      installments: [
        ...student.installments,
        {
          id: Date.now(),
          number: newInstallmentNumber,
          amount: averageAmount,
          paid: 0,
          dueDate: '',
          paidDate: '',
          status: 'pending',
          paymentMode: '',
          notes: ''
        }
      ]
    };

    onUpdateStudent(updatedStudent);
  };

  const updateInstallment = (installmentId, field, value) => {
    const updatedInstallments = student.installments.map(inst => 
      inst.id === installmentId 
        ? { 
            ...inst, 
            [field]: field === 'amount' || field === 'paid' ? parseInt(value) || 0 : value
          }
        : inst
    );
    
    // Recalculate totals based on paid amounts
    const totalPaid = updatedInstallments.reduce((sum, inst) => sum + (inst.paid || 0), 0);
    const pendingAmount = student.feeStructure.total - totalPaid;
    
    const updatedStudent = {
      ...student,
      installments: updatedInstallments,
      totalPaid,
      pendingAmount,
      status: pendingAmount === 0 ? 'completed' : 'active'
    };

    onUpdateStudent(updatedStudent);
  };

  const updateInstallmentStatus = (installmentId, status) => {
    if (status === 'custom') {
      setShowCustomStatus(prev => ({ ...prev, [installmentId]: true }));
      return;
    }

    const updatedInstallments = student.installments.map(inst => 
      inst.id === installmentId 
        ? { ...inst, status }
        : inst
    );

    const updatedStudent = {
      ...student,
      installments: updatedInstallments
    };

    onUpdateStudent(updatedStudent);
    setShowCustomStatus(prev => ({ ...prev, [installmentId]: false }));
  };

  const saveCustomStatus = (installmentId) => {
    const customStatus = customStatusText[installmentId]?.trim();
    if (!customStatus) return;

    const updatedInstallments = student.installments.map(inst => 
      inst.id === installmentId 
        ? { ...inst, status: customStatus }
        : inst
    );

    const updatedStudent = {
      ...student,
      installments: updatedInstallments
    };

    onUpdateStudent(updatedStudent);
    setShowCustomStatus(prev => ({ ...prev, [installmentId]: false }));
    setCustomStatusText(prev => ({ ...prev, [installmentId]: '' }));
  };

  const deleteInstallment = (installmentId) => {
    const updatedInstallments = student.installments.filter(inst => inst.id !== installmentId)
      .map((inst, index) => ({ ...inst, number: index + 1 }));
    
    const totalPaid = updatedInstallments.reduce((sum, inst) => sum + (inst.paid || 0), 0);
    const pendingAmount = student.feeStructure.total - totalPaid;
    
    const updatedStudent = {
      ...student,
      installments: updatedInstallments,
      totalPaid,
      pendingAmount,
      status: pendingAmount === 0 ? 'completed' : 'active'
    };

    onUpdateStudent(updatedStudent);
  };

  const updateNotes = (installmentId, notes) => {
    const updatedInstallments = student.installments.map(inst => 
      inst.id === installmentId 
        ? { ...inst, notes }
        : inst
    );

    const updatedStudent = {
      ...student,
      installments: updatedInstallments
    };

    onUpdateStudent(updatedStudent);
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Fee Installments</h3>
            <p className="text-sm text-gray-600">Manage payment installments and status</p>
          </div>
          <button
            onClick={addInstallment}
            className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg text-sm hover:from-amber-700 hover:to-amber-800 flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Installment</span>
          </button>
        </div>
        
        <div className="space-y-4">
          {student.installments.map((installment) => (
            <div key={installment.id} className="border border-gray-200 rounded-xl p-4 hover:border-amber-300 transition-colors bg-white">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    installment.status === 'paid' || installment.status === 'completed' ? 'bg-green-500' :
                    installment.status === 'partial' ? 'bg-amber-500' : 
                    installment.status === 'overdue' ? 'bg-orange-500' : 'bg-red-500'
                  }`}></div>
                  <span className="font-bold text-gray-800">Installment {installment.number}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(installment.status)}`}>
                    {getStatusLabel(installment.status).toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => deleteInstallment(installment.id)}
                  className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                  title="Delete installment"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              {/* Status Selection */}
              <div className="mb-3">
                <label className="block text-sm text-gray-600 mb-1">Payment Status</label>
                {showCustomStatus[installment.id] ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={customStatusText[installment.id] || ''}
                      onChange={(e) => setCustomStatusText(prev => ({ 
                        ...prev, 
                        [installment.id]: e.target.value 
                      }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                      placeholder="Enter custom status"
                    />
                    <button
                      onClick={() => saveCustomStatus(installment.id)}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setShowCustomStatus(prev => ({ ...prev, [installment.id]: false }))}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <select
                    value={installment.status}
                    onChange={(e) => updateInstallmentStatus(installment.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Total Amount</label>
                  <input
                    type="number"
                    value={installment.amount}
                    onChange={(e) => updateInstallment(installment.id, 'amount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="Amount"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Paid Amount</label>
                  <input
                    type="number"
                    value={installment.paid}
                    onChange={(e) => updateInstallment(installment.id, 'paid', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="Paid"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={installment.dueDate}
                    onChange={(e) => updateInstallment(installment.id, 'dueDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Paid Date</label>
                  <input
                    type="date"
                    value={installment.paidDate}
                    onChange={(e) => updateInstallment(installment.id, 'paidDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    disabled={!installment.paid}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Payment Mode</label>
                  <select
                    value={installment.paymentMode}
                    onChange={(e) => updateInstallment(installment.id, 'paymentMode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Select Payment Mode</option>
                    <option value="Cash">Cash</option>
                    <option value="Online">Online</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Card">Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="UPI">UPI</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
              </div>

             
              
            </div>
          ))}
        </div>

        {/* Fee Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border border-amber-200">
          <h4 className="font-semibold text-gray-800 mb-3">Fee Summary</h4>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">Total Fees</div>
              <div className="text-xl font-bold text-gray-800">₹{student.feeStructure.total.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Paid</div>
              <div className="text-xl font-bold text-green-600">₹{student.totalPaid.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Pending</div>
              <div className="text-xl font-bold text-red-600">₹{student.pendingAmount.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Installments</div>
              <div className="text-xl font-bold text-blue-600">{student.installments.length}</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Payment Progress</span>
              <span>{Math.round((student.totalPaid / student.feeStructure.total) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full"
                style={{ width: `${(student.totalPaid / student.feeStructure.total) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

       
      </div>

      {/* Empty column to maintain layout */}
      <div></div>
    </>
  );
};

export default FeesInstallment;
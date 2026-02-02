// src/components/dashboard/FeesInstallment.jsx
import React, { useState } from 'react';
import { Plus, Trash2, CreditCard, Calculator } from 'lucide-react';

const FeesInstallment = ({ student, onUpdateStudent }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'completed':
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-amber-100 text-amber-800';
      case 'pending': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const calculateInstallmentStatus = (installment, newPaidAmount) => {
    if (newPaidAmount === 0) return 'pending';
    if (newPaidAmount === installment.amount) return 'paid';
    if (newPaidAmount > 0 && newPaidAmount < installment.amount) return 'partial';
    return 'pending';
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
          paymentMode: ''
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
            [field]: field === 'amount' || field === 'paid' ? parseInt(value) || 0 : value,
            status: field === 'paid' ? calculateInstallmentStatus(inst, value) : inst.status
          }
        : inst
    );
    
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

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Fee Installments</h3>
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
            <div key={installment.id} className="border border-gray-200 rounded-xl p-4 hover:border-amber-300 transition-colors">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    installment.status === 'paid' ? 'bg-green-500' :
                    installment.status === 'partial' ? 'bg-amber-500' : 'bg-red-500'
                  }`}></div>
                  <span className="font-bold text-gray-800">Installment {installment.number}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(installment.status)}`}>
                    {installment.status.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => deleteInstallment(installment.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
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
                </select>
              </div>
            </div>
          ))}
        </div>

        {/* Fee Summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border border-amber-200">
          <h4 className="font-semibold text-gray-800 mb-3">Fee Summary</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">Total</div>
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
          </div>
        </div>
      </div>

      {/* Empty column to maintain layout */}
      <div></div>
    </>
  );
};

export default FeesInstallment;
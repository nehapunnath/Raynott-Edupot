// src/components/dashboard/components/AssessmentModal.jsx
import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Edit2, Trash2, Save, Award, Target, 
  TrendingUp, BarChart3, Calendar, MessageSquare, 
  PenTool, BookOpen, ChevronDown, ChevronUp, Settings
} from 'lucide-react';
import StudentApi from '../service/StudentApi';
import { toast } from 'react-toastify';

const AssessmentModal = ({ student, onClose, onUpdateStudent }) => {
  const [loading, setLoading] = useState(false);
  const [assessments, setAssessments] = useState({ categories: [], assessments: [] });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddAssessment, setShowAddAssessment] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    weightage: 100
  });
  const [newAssessment, setNewAssessment] = useState({
    categoryId: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    score: '',
    maxScore: '',
    percentage: '',
    grade: '',
    remarks: '',
    evaluator: ''
  });

  // Predefined assessment types
  const predefinedCategories = [
    { name: 'Reading', description: 'Reading comprehension and fluency', icon: 'BookOpen', weightage: 100 },
    { name: 'Writing', description: 'Writing skills and creativity', icon: 'PenTool', weightage: 100 },
    { name: 'Communication', description: 'Verbal and non-verbal communication', icon: 'MessageSquare', weightage: 100 },
    { name: 'Baseline Performance', description: 'Initial baseline assessment', icon: 'Target', weightage: 100 }
  ];

  useEffect(() => {
    loadAssessments();
  }, [student]);

  // Replace the loadAssessments function with this safer version
const loadAssessments = async () => {
  setLoading(true);
  try {
    const result = await StudentApi.getAssessments(student.studentId);
    if (result.success && result.assessments) {
      // Ensure categories and assessments are always arrays
      setAssessments({
        categories: result.assessments.categories || [],
        assessments: result.assessments.assessments || []
      });
    } else {
      // Set default empty arrays if the API call fails
      setAssessments({ categories: [], assessments: [] });
      toast.error(result.error || 'Failed to load assessments');
    }
  } catch (error) {
    console.error('Load assessments error:', error);
    // Set default empty arrays on error
    setAssessments({ categories: [], assessments: [] });
    toast.error('Failed to load assessments');
  } finally {
    setLoading(false);
  }
};
  const calculatePercentage = (score, maxScore) => {
    if (!score || !maxScore) return 0;
    return Math.round((parseFloat(score) / parseFloat(maxScore)) * 100);
  };

  const calculateGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  };

  const handleAssessmentChange = (field, value) => {
    const updated = { ...newAssessment, [field]: value };
    
    if (field === 'score' || field === 'maxScore') {
      const percentage = calculatePercentage(updated.score, updated.maxScore);
      updated.percentage = percentage;
      updated.grade = calculateGrade(percentage);
    }
    
    setNewAssessment(updated);
  };

  const addCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setLoading(true);
    try {
      const result = await StudentApi.addAssessmentCategory(student.studentId, newCategory);
      if (result.success) {
        toast.success('Category added successfully');
        setAssessments(prev => ({
          ...prev,
          categories: [...prev.categories, result.category]
        }));
        setShowAddCategory(false);
        setNewCategory({ name: '', description: '', weightage: 100 });
        onUpdateStudent({ ...student });
      } else {
        toast.error(result.error || 'Failed to add category');
      }
    } catch (error) {
      console.error('Add category error:', error);
      toast.error('Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async () => {
    if (!editingCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setLoading(true);
    try {
      const result = await StudentApi.updateAssessmentCategory(
        student.studentId,
        editingCategory.id,
        { name: editingCategory.name, description: editingCategory.description, weightage: editingCategory.weightage }
      );
      if (result.success) {
        toast.success('Category updated successfully');
        setAssessments(prev => ({
          ...prev,
          categories: prev.categories.map(cat => 
            cat.id === editingCategory.id ? editingCategory : cat
          )
        }));
        setEditingCategory(null);
        onUpdateStudent({ ...student });
      } else {
        toast.error(result.error || 'Failed to update category');
      }
    } catch (error) {
      console.error('Update category error:', error);
      toast.error('Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? All related assessments will also be deleted.')) {
      return;
    }

    setLoading(true);
    try {
      const result = await StudentApi.deleteAssessmentCategory(student.studentId, categoryId);
      if (result.success) {
        toast.success('Category deleted successfully');
        setAssessments(prev => ({
          categories: prev.categories.filter(cat => cat.id !== categoryId),
          assessments: prev.assessments.filter(assessment => assessment.categoryId !== categoryId)
        }));
        onUpdateStudent({ ...student });
      } else {
        toast.error(result.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Delete category error:', error);
      toast.error('Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const addAssessment = async () => {
    if (!newAssessment.categoryId) {
      toast.error('Please select a category');
      return;
    }
    if (!newAssessment.score) {
      toast.error('Please enter score');
      return;
    }
    if (!newAssessment.maxScore) {
      toast.error('Please enter maximum score');
      return;
    }

    setLoading(true);
    try {
      const result = await StudentApi.addAssessment(student.studentId, newAssessment);
      if (result.success) {
        toast.success('Assessment added successfully');
        setAssessments(prev => ({
          ...prev,
          assessments: [...prev.assessments, result.assessment]
        }));
        setShowAddAssessment(false);
        setNewAssessment({
          categoryId: '',
          assessmentDate: new Date().toISOString().split('T')[0],
          score: '',
          maxScore: '',
          percentage: '',
          grade: '',
          remarks: '',
          evaluator: ''
        });
        onUpdateStudent({ ...student });
      } else {
        toast.error(result.error || 'Failed to add assessment');
      }
    } catch (error) {
      console.error('Add assessment error:', error);
      toast.error('Failed to add assessment');
    } finally {
      setLoading(false);
    }
  };

  const updateAssessment = async () => {
    setLoading(true);
    try {
      const result = await StudentApi.updateAssessment(
        student.studentId,
        editingAssessment.id,
        editingAssessment
      );
      if (result.success) {
        toast.success('Assessment updated successfully');
        setAssessments(prev => ({
          ...prev,
          assessments: prev.assessments.map(assessment =>
            assessment.id === editingAssessment.id ? editingAssessment : assessment
          )
        }));
        setEditingAssessment(null);
        onUpdateStudent({ ...student });
      } else {
        toast.error(result.error || 'Failed to update assessment');
      }
    } catch (error) {
      console.error('Update assessment error:', error);
      toast.error('Failed to update assessment');
    } finally {
      setLoading(false);
    }
  };

  const deleteAssessment = async (assessmentId) => {
    if (!window.confirm('Are you sure you want to delete this assessment record?')) {
      return;
    }

    setLoading(true);
    try {
      const result = await StudentApi.deleteAssessment(student.studentId, assessmentId);
      if (result.success) {
        toast.success('Assessment deleted successfully');
        setAssessments(prev => ({
          ...prev,
          assessments: prev.assessments.filter(assessment => assessment.id !== assessmentId)
        }));
        onUpdateStudent({ ...student });
      } else {
        toast.error(result.error || 'Failed to delete assessment');
      }
    } catch (error) {
      console.error('Delete assessment error:', error);
      toast.error('Failed to delete assessment');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (categoryName) => {
    const icons = {
      'Reading': <BookOpen size={20} className="text-blue-600" />,
      'Writing': <PenTool size={20} className="text-green-600" />,
      'Communication': <MessageSquare size={20} className="text-purple-600" />,
      'Baseline Performance': <Target size={20} className="text-orange-600" />
    };
    return icons[categoryName] || <Award size={20} className="text-gray-600" />;
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'text-green-600 bg-green-50',
      'A': 'text-blue-600 bg-blue-50',
      'B+': 'text-amber-600 bg-amber-50',
      'B': 'text-yellow-600 bg-yellow-50',
      'C': 'text-purple-600 bg-purple-50',
      'D': 'text-orange-600 bg-orange-50',
      'F': 'text-red-600 bg-red-50'
    };
    return colors[grade] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Assessment Reports: {student.basicInfo?.name}
            </h2>
            <p className="text-gray-600">
              Adm No: {student.basicInfo?.admissionNo} • Grade {student.basicInfo?.grade} - {student.basicInfo?.section}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Assessment Categories Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Assessment Categories</h3>
              <button
                onClick={() => setShowAddCategory(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2 text-sm"
              >
                <Plus size={16} />
                <span>Add Category</span>
              </button>
            </div>

            {/* Add Category Form */}
            {showAddCategory && (
              <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Reading, Writing, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <input
                      type="text"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="Brief description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weightage (%)</label>
                    <input
                      type="number"
                      value={newCategory.weightage}
                      onChange={(e) => setNewCategory({ ...newCategory, weightage: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="100"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAddCategory(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addCategory}
                    disabled={loading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                  >
                    {loading ? 'Saving...' : 'Save Category'}
                  </button>
                </div>
              </div>
            )}

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assessments.categories?.map(category => (
                <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  {editingCategory?.id === category.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        value={editingCategory.description || ''}
                        onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Description"
                      />
                      <input
                        type="number"
                        value={editingCategory.weightage}
                        onChange={(e) => setEditingCategory({ ...editingCategory, weightage: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="px-3 py-1 text-sm border border-gray-300 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={updateCategory}
                          className="px-3 py-1 text-sm bg-purple-600 text-white rounded-lg"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(category.name)}
                          <h4 className="font-semibold text-gray-800">{category.name}</h4>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => setEditingCategory(category)}
                            className="p-1 text-gray-500 hover:text-purple-600"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => deleteCategory(category.id)}
                            className="p-1 text-gray-500 hover:text-red-600"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      {category.description && (
                        <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                      )}
                      <div className="text-xs text-gray-500">
                        Weightage: {category.weightage}%
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {assessments.categories.length === 0 && !showAddCategory && (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No assessment categories yet</p>
                <p className="text-sm text-gray-500">Add categories to track student assessments</p>
              </div>
            )}
          </div>

          {/* Assessment Records Section */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Assessment Records</h3>
              <button
                onClick={() => setShowAddAssessment(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2 text-sm"
              >
                <Plus size={16} />
                <span>Add Assessment</span>
              </button>
            </div>

            {/* Add Assessment Form */}
            {showAddAssessment && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={newAssessment.categoryId}
                      onChange={(e) => handleAssessmentChange('categoryId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Category</option>
                      {assessments.categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Date</label>
                    <input
                      type="date"
                      value={newAssessment.assessmentDate}
                      onChange={(e) => handleAssessmentChange('assessmentDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Score *</label>
                    <input
                      type="number"
                      value={newAssessment.score}
                      onChange={(e) => handleAssessmentChange('score', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., 85"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Score *</label>
                    <input
                      type="number"
                      value={newAssessment.maxScore}
                      onChange={(e) => handleAssessmentChange('maxScore', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., 100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Percentage</label>
                    <input
                      type="text"
                      value={newAssessment.percentage || ''}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                      placeholder="Auto-calculated"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                    <input
                      type="text"
                      value={newAssessment.grade || ''}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                      placeholder="Auto-calculated"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Evaluator</label>
                    <input
                      type="text"
                      value={newAssessment.evaluator}
                      onChange={(e) => handleAssessmentChange('evaluator', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Teacher name"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                    <input
                      type="text"
                      value={newAssessment.remarks}
                      onChange={(e) => handleAssessmentChange('remarks', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Additional comments"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAddAssessment(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addAssessment}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                  >
                    {loading ? 'Saving...' : 'Save Assessment'}
                  </button>
                </div>
              </div>
            )}

            {assessments.assessments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Score</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Max Score</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">%</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Grade</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Evaluator</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Remarks</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessments.assessments.map(assessment => {
                      const category = assessments.categories.find(c => c.id === assessment.categoryId);
                      return editingAssessment?.id === assessment.id ? (
                        <tr key={assessment.id} className="border-b border-gray-200">
                          <td className="px-4 py-3">
                            <select
                              value={editingAssessment.categoryId}
                              onChange={(e) => setEditingAssessment({ ...editingAssessment, categoryId: e.target.value })}
                              className="w-full px-2 py-1 border border-gray-300 rounded"
                            >
                              {assessments.categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="date"
                              value={editingAssessment.assessmentDate}
                              onChange={(e) => setEditingAssessment({ ...editingAssessment, assessmentDate: e.target.value })}
                              className="w-full px-2 py-1 border border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={editingAssessment.score}
                              onChange={(e) => {
                                const newScore = e.target.value;
                                const percentage = calculatePercentage(newScore, editingAssessment.maxScore);
                                const grade = calculateGrade(percentage);
                                setEditingAssessment({ 
                                  ...editingAssessment, 
                                  score: newScore,
                                  percentage,
                                  grade
                                });
                              }}
                              className="w-full px-2 py-1 border border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={editingAssessment.maxScore}
                              onChange={(e) => {
                                const newMaxScore = e.target.value;
                                const percentage = calculatePercentage(editingAssessment.score, newMaxScore);
                                const grade = calculateGrade(percentage);
                                setEditingAssessment({ 
                                  ...editingAssessment, 
                                  maxScore: newMaxScore,
                                  percentage,
                                  grade
                                });
                              }}
                              className="w-full px-2 py-1 border border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-4 py-3">{editingAssessment.percentage}%</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(editingAssessment.grade)}`}>
                              {editingAssessment.grade}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={editingAssessment.evaluator || ''}
                              onChange={(e) => setEditingAssessment({ ...editingAssessment, evaluator: e.target.value })}
                              className="w-full px-2 py-1 border border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={editingAssessment.remarks || ''}
                              onChange={(e) => setEditingAssessment({ ...editingAssessment, remarks: e.target.value })}
                              className="w-full px-2 py-1 border border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button
                              onClick={updateAssessment}
                              className="p-1 text-green-600 hover:text-green-800"
                            >
                              <Save size={16} />
                            </button>
                            <button
                              onClick={() => setEditingAssessment(null)}
                              className="p-1 text-gray-600 hover:text-gray-800"
                            >
                              <X size={16} />
                            </button>
                          </td>
                        </tr>
                      ) : (
                        <tr key={assessment.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              {getCategoryIcon(category?.name)}
                              <span className="font-medium">{category?.name || 'Unknown'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">{assessment.assessmentDate}</td>
                          <td className="px-4 py-3 font-medium">{assessment.score}</td>
                          <td className="px-4 py-3">{assessment.maxScore}</td>
                          <td className="px-4 py-3 font-semibold">{assessment.percentage}%</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(assessment.grade)}`}>
                              {assessment.grade}
                            </span>
                          </td>
                          <td className="px-4 py-3">{assessment.evaluator || '—'}</td>
                          <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{assessment.remarks || '—'}</td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button
                              onClick={() => setEditingAssessment(assessment)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => deleteAssessment(assessment.id)}
                              className="p-1 text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No assessment records yet</p>
                <p className="text-sm text-gray-500">Add assessments to track student progress</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentModal;
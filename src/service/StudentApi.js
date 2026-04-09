// src/services/StudentApi.js
import { auth } from './firebase';  // Your Firebase config/import
import BASE_URL from './base_urls';  // e.g. http://localhost:5000/api or production URL

class StudentApi {
  static async getAuthHeader() {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken(/* forceRefresh */ true);
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // ────────────────────────────────────────────────
  // Student CRUD
  // ────────────────────────────────────────────────

  /**
   * Create a new student (school admin only)
   * @param {Object} studentData - Full student object from AddStudent component
   */
  static async createStudent(studentData) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/students`, {
        method: 'POST',
        headers,
        body: JSON.stringify(studentData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || 'Failed to create student');
      }

      return {
        success: true,
        studentId: data.studentId,
        student: data.student,
        message: 'Student created successfully',
      };
    } catch (error) {
      console.error('Create student error:', error);
      return { success: false, error: error.message || 'Could not create student' };
    }
  }

  /**
   * Get all students for the current school
   */
  static async getAllStudents() {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/students`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load students');
      }

      return {
        success: true,
        students: data.students || [],
      };
    } catch (error) {
      console.error('Get students error:', error);
      return { success: false, error: error.message || 'Could not fetch students' };
    }
  }

  /**
   * Get single student by ID
   * @param {string} studentId 
   */
  static async getStudent(studentId) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/students/${studentId}`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Student not found');
      }

      return { success: true, student: data.student };
    } catch (error) {
      console.error('Get student error:', error);
      return { success: false, error: error.message || 'Could not fetch student' };
    }
  }

  /**
   * Update any student fields (basicInfo, feeStructure, etc.)
   * @param {string} studentId 
   * @param {Object} updates 
   */
  static async updateStudent(studentId, updates) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/students/${studentId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      return data; // { success: true } or { success: false, message }
    } catch (error) {
      console.error('Update student error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete a student (permanent)
   */
  static async deleteStudent(studentId) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/students/${studentId}`, {
        method: 'DELETE',
        headers,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Delete failed');
      }

      return { success: true };
    } catch (error) {
      console.error('Delete student error:', error);
      return { success: false, error: error.message };
    }
  }

  // ────────────────────────────────────────────────
  // Fee Installments CRUD
  // ────────────────────────────────────────────────

  /**
   * Add a new installment
   * @param {string} studentId 
   * @param {Object} installmentData - { amount, dueDate, paymentMode?, notes?, ... }
   */
  static async addInstallment(studentId, installmentData) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/students/${studentId}/installments`, {
        method: 'POST',
        headers,
        body: JSON.stringify(installmentData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to add installment');
      }

      return { success: true, installment: data.installment };
    } catch (error) {
      console.error('Add installment error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update an existing installment (amount, paid, status, dueDate, etc.)
   */
  static async updateInstallment(studentId, installmentId, updates) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/students/${studentId}/installments/${installmentId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update installment error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete an installment
   */
  static async deleteInstallment(studentId, installmentId) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/students/${studentId}/installments/${installmentId}`, {
        method: 'DELETE',
        headers,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Delete installment error:', error);
      return { success: false, error: error.message };
    }
  }

  // ────────────────────────────────────────────────
  // Marks / Academic Configuration
  // ────────────────────────────────────────────────
/**
   * Get only the marks object for a student
   * @param {string} studentId
   * @returns {Promise<{success: boolean, marks?: object, error?: string}>}
   */
  static async getMarks(studentId) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/students/${studentId}/marks`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch marks');
      }

      return {
        success: true,
        marks: data.marks || null,
      };
    } catch (error) {
      console.error('Get marks error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Add a new exam to the student's marks
   * @param {string} studentId
   * @param {object} examData - { examType, examDate, subjects: [...], ... }
   */
  static async addExam(studentId, examData) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/students/${studentId}/marks/exams`, {
        method: 'POST',
        headers,
        body: JSON.stringify(examData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to add exam');
      }

      return {
        success: true,
        exam: data.exam,
      };
    } catch (error) {
      console.error('Add exam error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete an exam by its ID
   * @param {string} studentId
   * @param {string} examId
   */
  static async deleteExam(studentId, examId) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/students/${studentId}/marks/exams/${examId}`, {
        method: 'DELETE',
        headers,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to delete exam');
      }

      return { success: true };
    } catch (error) {
      console.error('Delete exam error:', error);
      return { success: false, error: error.message };
    }
  }
  /**
   * Update full marks object (subjects, examTypes, gradingScale, exams array, totals, etc.)
   * This replaces the entire marks field — matches how Marks.jsx updates
   * @param {string} studentId 
   * @param {Object} marksData - Full { subjects, examTypes, gradingScale, maxMarks, exams: [...] }
   */
  static async updateMarks(studentId, marksData) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/students/${studentId}/marks`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(marksData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update marks');
      }

      return { success: true };
    } catch (error) {
      console.error('Update marks error:', error);
      return { success: false, error: error.message };
    }
  }

static async searchStudents(criteria = {}) {
  try {
    const headers = await this.getAuthHeader();
    
    // Remove empty fields to make URL cleaner
    const cleanCriteria = {};
    Object.entries(criteria).forEach(([key, value]) => {
      if (value && String(value).trim() !== '') {
        cleanCriteria[key] = value.trim();
      }
    });

    const params = new URLSearchParams(cleanCriteria).toString();
    const url = `${BASE_URL}/students/search?${params}`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    // Even if no students found → success with empty array
    if (response.ok) {
      return {
        success: true,
        students: data.students || [],
        count: data.count || 0
      };
    }

    // Only throw on real server errors (4xx/5xx with meaningful message)
    throw new Error(data.error || data.message || `Server responded with status ${response.status}`);
  } catch (error) {
    console.error('Search students error:', error);
    return { 
      success: false, 
      error: error.message || 'Could not search students. Please try again.' 
    };
  }
}


  // ────────────────────────────────────────────────
  // Assessment Reports
  // ────────────────────────────────────────────────

  /**
   * Get all assessments for a student
   */
  static async getAssessments(studentId) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/students/${studentId}/assessments`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch assessments');
      }

      return {
        success: true,
        assessments: data.assessments || { categories: [], assessments: [] }
      };
    } catch (error) {
      console.error('Get assessments error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Add a new assessment category
   */
  static async addAssessmentCategory(studentId, categoryData) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/students/${studentId}/assessments/categories`, {
        method: 'POST',
        headers,
        body: JSON.stringify(categoryData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to add category');
      }

      return { success: true, category: data.category };
    } catch (error) {
      console.error('Add category error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update an assessment category
   */
  static async updateAssessmentCategory(studentId, categoryId, updates) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/students/${studentId}/assessments/categories/${categoryId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update category error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete an assessment category
   */
  static async deleteAssessmentCategory(studentId, categoryId) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/students/${studentId}/assessments/categories/${categoryId}`, {
        method: 'DELETE',
        headers,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Delete category error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Add an assessment record
   */
  static async addAssessment(studentId, assessmentData) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/students/${studentId}/assessments/records`, {
        method: 'POST',
        headers,
        body: JSON.stringify(assessmentData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to add assessment');
      }

      return { success: true, assessment: data.assessment };
    } catch (error) {
      console.error('Add assessment error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update an assessment record
   */
  static async updateAssessment(studentId, assessmentId, updates) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/students/${studentId}/assessments/records/${assessmentId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update assessment error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete an assessment record
   */
  static async deleteAssessment(studentId, assessmentId) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/students/${studentId}/assessments/records/${assessmentId}`, {
        method: 'DELETE',
        headers,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Delete assessment error:', error);
      return { success: false, error: error.message };
    }
  }

  // Add this to StudentApi.js if needed
static async getStudentsBySchool(schoolId) {
  try {
    const headers = await this.getAuthHeader();
    const response = await fetch(`${BASE_URL}/students?schoolId=${schoolId}`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to load students');
    }

    return {
      success: true,
      students: data.students || [],
    };
  } catch (error) {
    console.error('Get students by school error:', error);
    return { success: false, error: error.message || 'Could not fetch students' };
  }
}
}

export default StudentApi;

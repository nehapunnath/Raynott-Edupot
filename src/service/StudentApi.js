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
}

export default StudentApi;

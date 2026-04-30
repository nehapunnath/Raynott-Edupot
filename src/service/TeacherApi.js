// src/service/TeacherApi.js
import { auth } from './firebase';
import BASE_URL from './base_urls';

class TeacherApi {
  static async getAuthHeader() {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken(true);
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  // ============ Teacher Management API ============

  /**
   * Get all teachers
   * @returns {Promise<{success: boolean, teachers: Array, error?: string}>}
   */
  static async getAllTeachers() {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/teachers`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load teachers');
      }

      return {
        success: true,
        teachers: data.teachers || []
      };
    } catch (error) {
      console.error('Get teachers error:', error);
      return { success: false, error: error.message, teachers: [] };
    }
  }

  /**
   * Get teacher by ID
   * @param {string} teacherId 
   * @returns {Promise<{success: boolean, teacher?: object, error?: string}>}
   */
  static async getTeacherById(teacherId) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/teachers/${teacherId}`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load teacher');
      }

      return {
        success: true,
        teacher: data.teacher
      };
    } catch (error) {
      console.error('Get teacher error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create a new teacher
   * @param {object} teacherData - Teacher details
   * @returns {Promise<{success: boolean, teacherId?: string, teacher?: object, error?: string}>}
   */
  static async createTeacher(teacherData) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/teachers`, {
        method: 'POST',
        headers,
        body: JSON.stringify(teacherData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create teacher');
      }

      return {
        success: true,
        teacherId: data.teacherId,
        teacher: data.teacher
      };
    } catch (error) {
      console.error('Create teacher error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update teacher
   * @param {string} teacherId 
   * @param {object} updates - Fields to update
   * @returns {Promise<{success: boolean, message?: string, error?: string}>}
   */
  static async updateTeacher(teacherId, updates) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/teachers/${teacherId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update teacher error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete teacher
   * @param {string} teacherId 
   * @returns {Promise<{success: boolean, message?: string, error?: string}>}
   */
  static async deleteTeacher(teacherId) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/teachers/${teacherId}`, {
        method: 'DELETE',
        headers,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Delete teacher error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update class performance for a teacher
   * @param {string} teacherId 
   * @param {string} className 
   * @param {object} performanceData - { averagePercentage, totalStudents, examCount }
   * @returns {Promise<{success: boolean, message?: string, error?: string}>}
   */
  static async updateClassPerformance(teacherId, className, performanceData) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/teachers/${teacherId}/performance/${className}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(performanceData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update class performance error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get teachers by subject
   * @param {string} subject 
   * @returns {Promise<{success: boolean, teachers: Array, error?: string}>}
   */
  static async getTeachersBySubject(subject) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/teachers/subject/${encodeURIComponent(subject)}`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load teachers');
      }

      return {
        success: true,
        teachers: data.teachers || []
      };
    } catch (error) {
      console.error('Get teachers by subject error:', error);
      return { success: false, error: error.message, teachers: [] };
    }
  }

  /**
   * Get teachers by class
   * @param {string} className 
   * @returns {Promise<{success: boolean, teachers: Array, error?: string}>}
   */
  static async getTeachersByClass(className) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/teachers/class/${encodeURIComponent(className)}`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load teachers');
      }

      return {
        success: true,
        teachers: data.teachers || []
      };
    } catch (error) {
      console.error('Get teachers by class error:', error);
      return { success: false, error: error.message, teachers: [] };
    }
  }

  /**
   * Get teacher statistics for dashboard
   * @returns {Promise<{success: boolean, stats?: object, error?: string}>}
   */
  static async getTeacherStats() {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/teachers/stats/dashboard`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load teacher statistics');
      }

      return {
        success: true,
        stats: data.stats
      };
    } catch (error) {
      console.error('Get teacher stats error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Bulk import teachers
   * @param {Array} teachersData - Array of teacher objects
   * @returns {Promise<{success: boolean, results?: Array, error?: string}>}
   */
  static async bulkImportTeachers(teachersData) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/teachers/bulk-import`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ teachers: teachersData }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to import teachers');
      }

      return {
        success: true,
        results: data.results
      };
    } catch (error) {
      console.error('Bulk import teachers error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Export teachers data
   * @returns {Promise<Blob>} - CSV/Excel file blob
   */
  static async exportTeachers() {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/teachers/export`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to export teachers');
      }

      return await response.blob();
    } catch (error) {
      console.error('Export teachers error:', error);
      throw error;
    }
  }

  /**
   * Get teacher performance summary
   * @param {string} teacherId 
   * @returns {Promise<{success: boolean, performance?: object, error?: string}>}
   */
  static async getTeacherPerformance(teacherId) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/teachers/${teacherId}/performance`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load teacher performance');
      }

      return {
        success: true,
        performance: data.performance
      };
    } catch (error) {
      console.error('Get teacher performance error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default TeacherApi;
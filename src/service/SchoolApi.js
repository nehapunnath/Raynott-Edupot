// src/services/SchoolApi.js
import { auth } from './firebase';           // your firebase config
import BASE_URL from './base_urls';          // your backend base (e.g. http://localhost:5000/api or production URL)

class SchoolApi {
  static async getAuthHeader() {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');
    const token = await user.getIdToken(/* forceRefresh */ true);
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Fetch all schools (only visible to super admin)
   */
  static async getAllSchools() {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/schools`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load schools');
      }

      return {
        success: true,
        schools: data.schools || [],
      };
    } catch (error) {
      console.error('Get schools error:', error);
      return {
        success: false,
        error: error.message || 'Could not fetch schools',
      };
    }
  }

  /**
   * Create new school (super admin only)
   * @returns {Promise<{success: boolean, schoolId?: string, email?: string, message?: string, error?: string}>}
   */
  static async createSchool(schoolData) {
    const { name, email, password, phone } = schoolData;

    if (!name || !email || !password) {
      return { success: false, error: 'Name, email and password are required' };
    }

    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/schools`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to create school');
      }

      return {
        success: true,
        schoolId: data.schoolId,
        email: data.email,
        message: data.message,
      };
    } catch (error) {
      console.error('Create school error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Toggle school status (active ↔ inactive)
   */
  static async toggleSchoolStatus(schoolId, newStatus) {
    if (!['active', 'inactive'].includes(newStatus)) {
      return { success: false, error: 'Invalid status value' };
    }

    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/schools/${schoolId}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      return data; // { success: true } or { success: false, message }
    } catch (error) {
      console.error('Toggle status error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Reset school admin password (returns success only — password shown in UI)
   */
  static async resetSchoolPassword(schoolId, newPassword) {
    if (!newPassword || newPassword.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters' };
    }

    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/schools/${schoolId}/reset-password`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Password reset failed');
      }

      return { success: true, email: data.email };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete school + associated auth user
   */
  static async deleteSchool(schoolId) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/schools/${schoolId}`, {
        method: 'DELETE',
        headers,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Delete failed');
      }

      return { success: true };
    } catch (error) {
      console.error('Delete school error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default SchoolApi;
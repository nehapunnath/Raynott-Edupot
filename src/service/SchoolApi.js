// src/services/SchoolApi.js
import { auth } from './firebase';           
import BASE_URL from './base_urls';          

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

  static async getUserProfile(uid) {
  try {
    const headers = await this.getAuthHeader();
    const response = await fetch(`${BASE_URL}/users/${uid}/profile`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch user profile');
    }

    return { success: true, profile: data };
  } catch (error) {
    console.error('Get user profile error:', error);
    return { success: false, error: error.message };
  }
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

static async createSchoolUser(userData) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/schools/${userData.schoolId}/users`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || 'Failed to create user');
      }

      return { success: true, ...data };
    } catch (error) {
      console.error('Create school user error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all users of a specific school
   */
  // In SchoolApi.js - Update getSchoolUsers method
static async getSchoolUsers(schoolId) {
  try {
    const headers = await this.getAuthHeader();
    const response = await fetch(`${BASE_URL}/schools/${schoolId}/users`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to fetch users');
    }

    // Filter out school_admin on client side as well for safety
    const regularUsers = (data.users || []).filter(user => user.role !== 'school_admin');
    
    return { success: true, users: regularUsers };
  } catch (error) {
    console.error('Get school users error:', error);
    return { success: false, error: error.message };
  }
}
  /**
   * Update a school user (name, fullAccess, etc.)
   */
  static async updateSchoolUser(uid, updateData) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/schools/users/${uid}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updateData),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to update user');
      }

      return { success: true };
    } catch (error) {
      console.error('Update school user error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete a school user
   */
  static async deleteSchoolUser(uid) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/schools/users/${uid}`, {
        method: 'DELETE',
        headers,
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete user');
      }

      return { success: true };
    } catch (error) {
      console.error('Delete school user error:', error);
      return { success: false, error: error.message };
    }
  }

  // ====================== TAB CONFIGURATION ======================

  /**
   * Update tab configuration for a school
   */
  static async updateSchoolTabConfig(schoolId, enabledTabs) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/schools/${schoolId}/tab-config`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ enabledTabs }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to update tab config');
      }

      return { success: true };
    } catch (error) {
      console.error('Update tab config error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get tab configuration for a school
   */
  static async getSchoolTabConfig(schoolId) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch(`${BASE_URL}/schools/${schoolId}/tab-config`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch tab config');
      }

      return { success: true, enabledTabs: data.enabledTabs || [] };
    } catch (error) {
      console.error('Get tab config error:', error);
      return { success: false, error: error.message };
    }
  }
  // Add to SchoolApi.js
// In SchoolApi.js - Fix this method
static async resetSchoolUserPassword(uid, newPassword) {
  try {
    const headers = await this.getAuthHeader();
    const response = await fetch(`${BASE_URL}/schools/users/${uid}/reset-password`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ newPassword }),
    });

    const data = await response.json();
    
    // Check if response is ok
    if (!response.ok) {
      // Extract error message from response
      const errorMessage = data.message || data.error || 'Password reset failed';
      throw new Error(errorMessage);
    }
    
    if (!data.success) {
      throw new Error(data.message || 'Password reset failed');
    }

    return { success: true, message: data.message };
  } catch (error) {
    console.error('Reset user password error:', error);
    return { success: false, error: error.message };
  }
}
// Add to SchoolApi.js
static async updateUserTabConfig(uid, enabledTabs) {
  try {
    const headers = await this.getAuthHeader();
    const response = await fetch(`${BASE_URL}/schools/users/${uid}/tab-config`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ enabledTabs }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to update user tab config');
    }

    return { success: true };
  } catch (error) {
    console.error('Update user tab config error:', error);
    return { success: false, error: error.message };
  }
}
}

export default SchoolApi;
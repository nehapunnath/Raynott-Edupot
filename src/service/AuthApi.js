// src/services/AuthApi.js
import { signInWithEmailAndPassword, getIdToken } from 'firebase/auth';
import { auth } from './firebase';
import BASE_URL from './base_urls'

// const auth = getAuth();

class AuthApi {
 
  static async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);

      const idToken = await getIdToken(userCredential.user, true);

      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.message || 'Backend authentication failed');
      }

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      console.error('Login error:', error.code, error.message);

      let message = 'Login failed. Please try again.';

      if (error.code === 'auth/invalid-email')          message = 'Invalid email format';
      if (error.code === 'auth/user-not-found' ||
          error.code === 'auth/wrong-password')         message = 'Invalid email or password';
      if (error.code === 'auth/too-many-requests')      message = 'Too many attempts. Try again later.';
      if (error.code === 'auth/user-disabled')          message = 'Account is disabled.';
      if (error.code === 'auth/network-request-failed') message = 'Network error — check your connection';

      return { success: false, error: message };
    }
  }

  
  static async logout() {
    try {
      await auth.signOut();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

 
  static async getCurrentUser() {
    const user = auth.currentUser;
    if (!user) return null;

    try {
      const idToken = await getIdToken(user, true);
      const response = await fetch(`${BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      return data.user || null;
    } catch (err) {
      console.error('Get current user failed:', err);
      return null;
    }
  }
}

export default AuthApi;
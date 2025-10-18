// User Session Management Service
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserService from './UserService';

export class UserSessionService {
  static USER_SESSION_KEY = 'kaki_user_session';

  /**
   * Save user session to local storage
   * @param {Object} userData - User data to save
   */
  static async saveUserSession(userData) {
    try {
      const sessionData = {
        userId: userData.id,
        name: userData.name,
        phoneNumber: userData.phone_number,
        countryCode: userData.country_code,
        lastLogin: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem(this.USER_SESSION_KEY, JSON.stringify(sessionData));
      console.log('User session saved:', sessionData);
      return sessionData;
    } catch (error) {
      console.error('Error saving user session:', error);
      throw error;
    }
  }

  /**
   * Get user session from local storage
   * @returns {Promise<Object|null>} User session data or null
   */
  static async getUserSession() {
    try {
      const sessionData = await AsyncStorage.getItem(this.USER_SESSION_KEY);
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        console.log('User session retrieved:', parsed);
        return parsed;
      }
      return null;
    } catch (error) {
      console.error('Error getting user session:', error);
      return null;
    }
  }

  /**
   * Clear user session from local storage
   */
  static async clearUserSession() {
    try {
      await AsyncStorage.removeItem(this.USER_SESSION_KEY);
      console.log('User session cleared');
    } catch (error) {
      console.error('Error clearing user session:', error);
    }
  }

  /**
   * Check if user session exists and is valid
   * @returns {Promise<boolean>} True if valid session exists
   */
  static async hasValidSession() {
    try {
      const session = await this.getUserSession();
      return session !== null && session.userId && session.name && session.phoneNumber;
    } catch (error) {
      console.error('Error checking session validity:', error);
      return false;
    }
  }

  /**
   * Restore user from session and verify with database
   * @returns {Promise<Object|null>} User data or null if not found/invalid
   */
  static async restoreUserFromSession() {
    try {
      const session = await this.getUserSession();
      if (!session) {
        return null;
      }

      // Verify user still exists in database
      const userData = await UserService.getUserById(session.userId);
      if (userData) {
        console.log('User restored from session:', userData);
        return userData;
      } else {
        // User no longer exists in database, clear session
        await this.clearUserSession();
        return null;
      }
    } catch (error) {
      console.error('Error restoring user from session:', error);
      await this.clearUserSession();
      return null;
    }
  }

  /**
   * Create new user session after successful onboarding
   * @param {Object} userData - User data from database
   * @returns {Promise<Object>} Session data
   */
  static async createUserSession(userData) {
    try {
      const sessionData = await this.saveUserSession(userData);
      console.log('New user session created:', sessionData);
      return sessionData;
    } catch (error) {
      console.error('Error creating user session:', error);
      throw error;
    }
  }
}

export default UserSessionService;

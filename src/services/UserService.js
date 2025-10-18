// User Service for Supabase operations
import { supabase } from '../config/supabase';

export class UserService {
  /**
   * Create a new user in the database or update existing user
   * @param {Object} userData - User data object
   * @param {string} userData.name - User's name
   * @param {string} userData.phoneNumber - User's phone number (unique identifier)
   * @param {string} userData.countryCode - Country code (default: '+65')
   * @returns {Promise<Object>} Created or updated user data
   */
  static async createUser({ name, phoneNumber, countryCode = '+65' }) {
    try {
      // Clean phone number (remove all non-digit characters)
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
      
      // Validate cleaned phone number
      if (!this.validatePhoneNumber(cleanPhoneNumber)) {
        throw new Error('Invalid phone number format');
      }
      
      // Check if user already exists using cleaned phone number
      const existingUser = await this.getUserByPhone(cleanPhoneNumber);
      
      if (existingUser) {
        // Update existing user's name if it's different
        if (existingUser.name !== name.trim()) {
          const updatedUser = await this.updateUser(existingUser.id, {
            name: name.trim(),
            updated_at: new Date().toISOString(),
          });
          console.log('Updated existing user:', updatedUser);
          return updatedUser;
        }
        console.log('User already exists:', existingUser);
        return existingUser;
      }

      // Create new user
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            name: name.trim(),
            phone_number: cleanPhoneNumber,
            country_code: countryCode,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        throw new Error(error.message);
      }

      console.log('Created new user:', data);
      return data;
    } catch (error) {
      console.error('UserService.createUser error:', error);
      throw error;
    }
  }

  /**
   * Get user by phone number
   * @param {string} phoneNumber - Phone number to search for
   * @returns {Promise<Object|null>} User data or null if not found
   */
  static async getUserByPhone(phoneNumber) {
    try {
      // Clean phone number for consistent lookup
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone_number', cleanPhoneNumber)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching user:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('UserService.getUserByPhone error:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} User data or null if not found
   */
  static async getUserById(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('UserService.getUserById error:', error);
      throw error;
    }
  }

  /**
   * Update user information
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user data
   */
  static async updateUser(userId, updateData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('UserService.updateUser error:', error);
      throw error;
    }
  }

  /**
   * Deactivate user (soft delete)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Updated user data
   */
  static async deactivateUser(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ is_active: false })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error deactivating user:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('UserService.deactivateUser error:', error);
      throw error;
    }
  }

  /**
   * Get all active users (for admin purposes)
   * @returns {Promise<Array>} Array of user data
   */
  static async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('UserService.getAllUsers error:', error);
      throw error;
    }
  }

  /**
   * Validate phone number format (exactly 8 digits)
   * @param {string} phoneNumber - Phone number to validate
   * @returns {boolean} True if valid
   */
  static validatePhoneNumber(phoneNumber) {
    // Remove all non-digit characters
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    // Check if exactly 8 digits
    return cleanNumber.length === 8;
  }

  /**
   * Validate name format
   * @param {string} name - Name to validate
   * @returns {boolean} True if valid
   */
  static validateName(name) {
    // Name should be at least 2 characters, no numbers or special characters
    const nameRegex = /^[a-zA-Z\s]{2,}$/;
    return nameRegex.test(name.trim());
  }
}

export default UserService;

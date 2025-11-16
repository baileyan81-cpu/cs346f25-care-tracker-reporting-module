/**
 * Module: Provides logic for this feature.
 */

const supabase = require('./supabase');

class UsersModel {
  /**
   * Model helper method 'getProgressReportByUserId' encapsulating a reusable database operation.
   */
  static async getUserByUserId(userId) {
    const { data, error } = await supabase
      .from('v_users')
      .select('user_id, first_name, last_name, full_name, role_level')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    if (!data) return null;

    // --- START DATA MAPPING ---
    return {
      userId: data.user_id,
      firstName: data.first_name,
      lastName: data.last_name,
      fullName: data.full_name,
      roleLevel: data.role_level,
    };
    // --- END DATA MAPPING ---
  }

  static async createUpdateCareUser(firstName, lastName, userId) {
    const { data, error } = await supabase.rpc('create_update_care_user', {
      p_first_name: firstName,
      p_last_name: lastName,
      p_user_id: userId,
    });

    if (error) {
      throw error;
    }
    if (!data) {
      return null;
    }

    // --- START DATA MAPPING ---
    return {
      userId: data.user_id,
      firstName: data.first_name,
      lastName: data.last_name,
      fullName: data.full_name,
      roleLevel: data.role_level,
    };
    // --- END DATA MAPPING ---
  }
}

module.exports = UsersModel;

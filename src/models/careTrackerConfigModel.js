/**
 * Model: Provides data-access logic and interaction with the database or external services.
 */

const supabase = require('./supabase');

class CareTrackerConfigModel {
  /**
   * Returns all rows from the underlying table, typically used to populate lists or dropdowns.
   */
  static async getAll() {
    const { data, error } = await supabase
      .from('dropdown_codes')
      .select('code_id, code_type, code_group, code_text, code_meaning') // Ensure you select these columns
      .order('created_at', { ascending: false });

    if (error) throw error;

    // --- START DATA MAPPING ---
    return data.map((c) => ({
      // EJS uses CodeId
      CodeId: c.code_id,
      // EJS uses CodeType
      CodeType: c.code_type,
      // EJS uses CodeGroup
      CodeGroup: c.code_group,
      // EJS uses Code (which is code_text in the DB)
      Code: c.code_text,
      // EJS uses CodeMeaning
      CodeMeaning: c.code_meaning,
    }));
    // --- END DATA MAPPING ---
  }

  /**
   * Inserts a new row based on the provided payload object and returns the created record.
   */
  static async create(config) {
    const { data, error } = await supabase
      .from('dropdown_codes')
      .insert([config])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Deletes a row by its primary key (code_id).
   */
  static async deleteById(codeId) {
    const { error } = await supabase
      .from('dropdown_codes')
      .delete()
      .eq('code_id', codeId);

    if (error) throw error;
  }
}

module.exports = CareTrackerConfigModel;

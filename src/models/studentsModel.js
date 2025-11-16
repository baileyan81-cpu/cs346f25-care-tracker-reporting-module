/**
 * Model: Provides data-access logic and interaction with the database or external services.
 */

const supabase = require('./supabase');

class StudentsModel {
/**
 * Returns all rows from the underlying table, typically used to populate lists or dropdowns.
 */
  static async getAll() {
    const { data, error } = await supabase
      .from('v_students')
      .select('user_id, full_name') // Ensure you select these columns
      .order('full_name');

    if (error) throw error;

    // --- START DATA MAPPING ---
    return data.map((c) => ({
      userId: c.user_id,
      fullName: c.full_name,
    }));
    // --- END DATA MAPPING ---
  }

/**
 * Model helper method 'getDomainReportByUserId' encapsulating a reusable database operation.
 */
  static async getDomainReportByUserId(userId) {
    const { data, error } = await supabase
      .from('v_domain_progress')
      .select('user_id, full_name, code_group, code_text, completed')
      .eq('user_id', userId)
      // order so groups and items are predictable
      .order('code_group', { ascending: true })
      .order('code_text', { ascending: true });

    if (error) throw error;

    // Build: { [code_group]: { domain, competencies: [] } }
    const byDomain = new Map();

    for (const row of data || []) {
      const domainLabel = row.code_group; // assumes this already contains "Domain X: ..." text
      if (!byDomain.has(domainLabel)) {
        byDomain.set(domainLabel, { domain: domainLabel, competencies: [] });
      }
      byDomain.get(domainLabel).competencies.push({
        text: row.code_text,
        // coerce to boolean in case it's 0/1, 't'/'f', etc.
        complete:
          typeof row.completed === 'boolean' ? row.completed : !!row.completed,
      });
    }

    // Return exactly the old nested array shape
    return Array.from(byDomain.values());
  }

/**
 * Model helper method 'getProgressReportByUserId' encapsulating a reusable database operation.
 */
  static async getProgressReportByUserId(userId) {
    const { data, error } = await supabase
      .from('v_student_progress')
      .select('user_id, full_name, completed, total, progress_label')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    if (!data) return null;

    // --- START DATA MAPPING ---
    return {
      userId: data.user_id,
      fullName: data.full_name,
      completed: data.completed,
      total: data.total,
      progressLabel: data.progress_label,
    };
    // --- END DATA MAPPING ---
  }

/**
 * Model helper method 'getStudentsByClassId' encapsulating a reusable database operation.
 */
  static async getStudentsByClassId(classroomId) {
    const { data, error } = await supabase
      .from('v_students_in_class')
      .select('user_id, full_name')
      .eq('classroom_id', classroomId);

    if (error) throw error;

    // --- START DATA MAPPING ---
    return data.map((c) => ({
      userId: c.user_id,
      fullName: c.full_name,
    }));
    // --- END DATA MAPPING ---
  }
}

module.exports = StudentsModel;
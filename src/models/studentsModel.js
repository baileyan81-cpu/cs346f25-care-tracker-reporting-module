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
      .select(
        'user_id, full_name, code_group, code_text, completed, iterations, completion_date, most_recent'
      )
      .eq('user_id', userId)
      .order('code_group', { ascending: true }) // still fine; we'll clean it up in JS
      .order('code_text', { ascending: true });

    if (error) throw error;

    const byDomain = new Map();

    for (const row of data || []) {
      const domainLabel = row.code_group; // e.g. "Domain 7: Systems-Based Practice"

      if (!byDomain.has(domainLabel)) {
        byDomain.set(domainLabel, { domain: domainLabel, competencies: [] });
      }

      byDomain.get(domainLabel).competencies.push({
        text: row.code_text,
        complete:
          typeof row.completed === 'boolean' ? row.completed : !!row.completed,

        iterations: row.iterations,
        completionDate: formatDateYmd(row.completion_date),
        mostRecent: formatDateYmd(row.most_recent),
      });
    }

    // Convert map -> array
    const domains = Array.from(byDomain.values());

    // ✅ Sort by the numeric part of "Domain X: ..." instead of plain string
    domains.sort((a, b) => {
      const na = extractDomainNumber(a.domain);
      const nb = extractDomainNumber(b.domain);
      if (na !== nb) return na - nb;
      // tie-breaker: fall back to alpha
      return String(a.domain).localeCompare(String(b.domain));
    });

    return domains;
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

// Helper to format dates as YYYYMMDD
function formatDateYmd(value) {
  if (!value) return null;

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    // If it's not a valid date, just return the original
    return value;
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}/${month}/${day}`;
}

function extractDomainNumber(label) {
  if (!label) return Number.MAX_SAFE_INTEGER;
  const match = String(label).match(/\d+/); // first run of digits
  return match ? parseInt(match[0], 10) : Number.MAX_SAFE_INTEGER;
}

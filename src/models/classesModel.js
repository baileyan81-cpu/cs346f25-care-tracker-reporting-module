/**
 * Model: Provides data-access logic and interaction with the database or external services.
 */

const supabase = require('./supabase');

class ClassesModel {
/**
 * Returns all rows from the underlying table, typically used to populate lists or dropdowns.
 */
  static async getAll() {
    const { data, error } = await supabase
      .from('v_classrooms')
      .select('classroom_id, class_name, semester, class_number');

    if (error) throw error;

    // --- START DATA MAPPING ---
    return data.map((c) => ({
      classroomId: c.classroom_id,
      className: c.class_name,
      semester: c.semester,
      classNumber: c.class_number,
    }));
    // --- END DATA MAPPING ---
  }

/**
 * Model helper method 'getClassByClassId' encapsulating a reusable database operation.
 */
  static async getClassByClassId(classroomId) {
    const { data, error } = await supabase
      .from('v_classrooms')
      .select('classroom_id, class_name, semester, class_number')
      .eq('classroom_id', classroomId)
      .single();

    if (error) throw error;
    if (!data) return null;

    // --- START DATA MAPPING ---
    return {
      classroomId: data.classroom_id,
      className: data.class_name,
      semester: data.semester,
      classNumber: data.class_number,
    };
    // --- END DATA MAPPING ---
  }
}

module.exports = ClassesModel;
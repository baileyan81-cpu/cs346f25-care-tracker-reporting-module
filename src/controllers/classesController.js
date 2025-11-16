/**
 * Controller: Handles HTTP request/response flow for this feature.
 */

const classesModel = require('../models/classesModel');
const studentsModel = require('../models/studentsModel');

/**
 * Handles GET /.
 * Uses classesModel model(s) to access persistent data.
 * Renders the 'classes' view, providing template locals: title, courses, //csrfToken.
 * Delegates unexpected errors to the Express error-handling middleware via next(err).
 */
exports.getClasses = async (req, res, next) => {
  try {
    const allClasses = await classesModel.getAll();
    res.render('classes', {
      title: 'Classes',
      courses: allClasses,
      //csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles GET /class_report/:id.
 * Renders the 'classReport' view, providing template locals: title.
 * Reads route parameters from req.params to identify the resource being operated on.
 * Delegates unexpected errors to the Express error-handling middleware via next(err).
 */
exports.getClassById = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const course = await classesModel.getClassByClassId(courseId);
    const students = await studentsModel.getStudentsByClassId(courseId);

    if (!course) {
      return res.status(404).render('error', {
        title: 'Class Not Found',
        message: `Course with ID "${courseId}" was not found.`,
        error: { status: 404 },
      });
    }
    res.render('classReport', {
      title: `Report for ${course.classNumber}: ${course.className}`,
      course: course,
      students: students,
      //csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};

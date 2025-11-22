/**
 * Controller: Handles HTTP request/response flow for this feature.
 */

const model = require('../models/studentsModel');

/**
 * GET /about
 * Display the about page
 */
/**
 * Handles GET /.
 * Uses model model(s) to access persistent data.
 * Renders the 'students' view, providing template locals: title, students, //csrfToken.
 * Delegates unexpected errors to the Express error-handling middleware via next(err).
 */
exports.getStudents = async (req, res, next) => {
  try {
    const allStudents = await model.getAll();
    res.render('students', {
      title: 'Students',
      students: allStudents,
      //csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles GET /studentReport/:name/:user_id.
 * Renders the 'studentReport' view, providing template locals: title, student_name, competencies, progressData, //csrfToken.
 * Reads route parameters from req.params to identify the resource being operated on.
 * Delegates unexpected errors to the Express error-handling middleware via next(err).
 */
exports.getStudentReportByUserID = async (req, res, next) => {
  try {
    const userId = req.params.user_id;
    const competencyData = await model.getDomainReportByUserId(userId);
    const progressData = await model.getProgressReportByUserId(userId);
    const studentName = req.params.name;
    res.render('studentReport', {
      title: 'StudentByName',
      backUrl: '/students',
      backLabel: '← Back to Students',
      student_name: studentName,
      competencies: competencyData,
      progressData: progressData,
      //csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};
/**
 * Handles GET /classStudentReport/:name/:user_id/:class_id.
 * Renders the 'classStudentReport' view, providing template locals: title, student_name, competencies, progressData, class_id, //csrfToken.
 * Reads route parameters from req.params to identify the resource being operated on.
 * Delegates unexpected errors to the Express error-handling middleware via next(err).
 */
exports.getClassStudentByUserId = async (req, res, next) => {
  try {
    const userId = req.params.user_id;
    const competencyData = await model.getDomainReportByUserId(userId);
    const progressData = await model.getProgressReportByUserId(userId);
    const studentName = req.params.name;
    const classId = req.params.class_id;
    res.render('studentReport', {
      title: 'StudentByName',
      student_name: studentName,
      competencies: competencyData,
      progressData: progressData,
      class_id: classId,
      //csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};
/**
 * Handles GET /selfReport.
 * Renders the 'selfReport' view, providing template locals: title, student_name, competencies, progressData, //csrfToken.
 * Reads route parameters from req.params to identify the resource being operated on.
 * Delegates unexpected errors to the Express error-handling middleware via next(err).
 */
exports.getSelfReport = async (req, res, next) => {
  try {
    const userId = req.session.user.userId;
    const competencyData = await model.getDomainReportByUserId(userId);
    const progressData = await model.getProgressReportByUserId(userId);
    const studentName = req.params.name;
    res.render('studentReport', {
      title: 'Student Report',
      student_name: studentName,
      competencies: competencyData,
      progressData: progressData,
      //csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};

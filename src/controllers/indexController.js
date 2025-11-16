/**
 * GET /
 * Display the home page
 */
/**
 * Renders the 'index' view, providing template locals: title, // data, //csrfToken.
 * Delegates unexpected errors to the Express error-handling middleware via next(err).
 */
exports.getHome = async (req, res, next) => {
  try {
    var showStudentFeatures = false;
    var showTeacherFeatures = false;
    var showManagerFeatures = false;
    if (req.session && req.session.user) {
      if (req.session.user.roleLevel == 0) showStudentFeatures = true;
      if (req.session.user.roleLevel == 1) showTeacherFeatures = true;
      if (req.session.user.roleLevel == 2) showManagerFeatures = true;
    }

    res.render('index', {
      title: 'Home',
      showStudentFeatures: showStudentFeatures,
      showTeacherFeatures: showTeacherFeatures,
      showManagerFeatures: showManagerFeatures,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /about
 * Display the about page
 */
/**
 * Renders the 'about' view, providing template locals: title, //csrfToken.
 * Delegates unexpected errors to the Express error-handling middleware via next(err).
 */
exports.getAbout = async (req, res, next) => {
  try {
    res.render('about', {
      title: 'About',
    });
  } catch (error) {
    next(error);
  }
};

// Add more controller methods as needed

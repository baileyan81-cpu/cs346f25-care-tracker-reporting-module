/**
 * GET /about
 * Display the about page
 */
/**
 * Handles GET /.
 * Renders the 'about' view, providing template locals: title, //csrfToken.
 * Delegates unexpected errors to the Express error-handling middleware via next(err).
 */
exports.getAbout = async (req, res, next) => {
  try {
    res.render('about', {
      title: 'About',
      //csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};

// Add more controller methods as needed

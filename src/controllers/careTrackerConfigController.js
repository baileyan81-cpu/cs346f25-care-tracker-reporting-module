/**
 * Controller: Handles HTTP request/response flow for this feature.
 */

const CareTrackerConfig = require('../models/careTrackerConfigModel');

/**
 * Handles GET /, and GET /.
 * Uses CareTrackerConfig model(s) to access persistent data.
 * Renders the 'careTrackerConfig' view, providing template locals: title, user, csrfToken, form.
 */
exports.showConfigPage = async (req, res) => {
  try {
    const codes = await CareTrackerConfig.getAll();
    res.render('careTrackerConfig', {
      title: 'Care Tracker Config',
      codes,
      user: req.session?.user || null,
      csrfToken: req.csrfToken ? req.csrfToken() : '',
      form: {},
    });
  } catch (err) {
    res.render('careTrackerConfig', {
      title: 'Care Tracker Config',
      codes: [],
      error: err.message,
      user: req.session?.user || null,
      csrfToken: req.csrfToken ? req.csrfToken() : '',
    });
  }
};

/**
 * Handles POST /add_config.
 * Uses CareTrackerConfig model(s) to access persistent data.
 * Redirects the client to '/caretrackerconfig' after successful completion.
 * Reads user-submitted form data from req.body and maps fields into a payload object.
 */
exports.addConfig = async (req, res) => {
  try {
    const newCodeData = {
      code_type: req.body.codeType,
      code_group: req.body.codeGroup,
      code_text: req.body.code,
      code_meaning: req.body.codeMeaning,
    };

    await CareTrackerConfig.create(newCodeData);

    res.redirect('/caretrackerconfig');
  } catch (err) {
    console.error('Error inserting data into Supabase:', err);
    res.status(500).send(`Error adding code: ${err.message}`);
  }
};

/**
 * Handles POST /caretrackerconfig/delete.
 * Deletes a dropdown_codes row by code_id.
 * Only role_level 2 should be allowed (DB RLS enforces this, but we also check here).
 */
exports.deleteConfig = async (req, res) => {
  try {
    const user = req.session?.user || null;
    const { codeId } = req.body;

    if (!user || user.roleLevel !== 2) {
      return res.status(403).send('Forbidden: only managers can delete codes.');
    }

    if (!codeId) {
      return res.status(400).send('Missing codeId.');
    }

    await CareTrackerConfig.deleteById(codeId);

    res.redirect('/caretrackerconfig');
  } catch (err) {
    console.error('Error deleting code from Supabase:', err);
    res.status(500).send(`Error deleting code: ${err.message}`);
  }
};

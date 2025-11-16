/**
 * Users Controller
 *
 * Handles Supabase-based authentication.
 * Uses sessions to remember the logged-in user between requests.
 */

const supabase = require('../models/supabase'); // same client used by your models
const usersModel = require('../models/usersModel');

function mapRoleLabel(roleLevel) {
  switch (roleLevel) {
    case 0:
      return 'Student';
    case 1:
      return 'Teacher';
    case 2:
      return 'Manager';
    default:
      return 'Unknown';
  }
}

/**
 * GET /users/login
 * Render the login page.
 */
exports.getLogin = (req, res) => {
  // If already logged in, just go home (optional behavior)
  if (req.session && req.session.user) {
    return res.redirect('/');
  }

  res.render('login', {
    title: 'Login',
    csrfToken: req.csrfToken ? req.csrfToken() : '',
    user: req.session ? req.session.user : null,
    error: null,
    email: '',
  });
};

/**
 * GET /users/login
 * Render the login page.
 */
exports.getRegister = (req, res) => {
  // If already logged in, just go home (optional behavior)
  if (req.session && req.session.user) {
    return res.redirect('/');
  }

  res.render('register', {
    title: 'Register',
    csrfToken: req.csrfToken ? req.csrfToken() : '',
    user: req.session ? req.session.user : null,
    error: null,
    email: '',
  });
};

/**
 * POST /users/login
 * Authenticate against Supabase and persist in session.
 */
exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Call Supabase Auth: email/password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data || !data.session || !data.user) {
      ///Something has gone wrong with our sign-in.
      return res.status(401).render('login', {
        title: 'Login',
        csrfToken: req.csrfToken ? req.csrfToken() : '',
        user: null,
        email,
        error: 'Invalid email or password.',
      });
    }

    const userId = data.user.id;
    const careData = await usersModel.getUserByUserId(userId);

    if (error || !data || !careData || !data.session || !data.user) {
      ///We have a supabase account but not a care_user row?
      return res.status(401).render('login', {
        title: 'Login',
        csrfToken: req.csrfToken ? req.csrfToken() : '',
        user: null,
        email,
        error: 'Invalid email or password.',
      });
    }

    // Store user info in the session
    req.session.user = {
      userId: data.user.id,
      email: data.user.email,
      firstName: careData.firstName,
      lastName: careData.lastName,
      fullName: careData.fullName,
      roleLevel: careData.roleLevel,
    };

    // Optionally keep the access token if you want user-specific queries later
    req.session.supabase = {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };

    res.redirect('/');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /users/register
 * Create a new Supabase user, set role via joinCode, and persist in session.
 */
exports.postRegister = async (req, res, next) => {
  const { email, password, firstName, lastName, joinCode } = req.body;

  try {
    // --- Basic server-side validation ---
    const missingFields = [];
    if (!email) missingFields.push('Email');
    if (!password) missingFields.push('Password');
    if (!firstName) missingFields.push('First name');
    if (!lastName) missingFields.push('Last name');
    if (!joinCode) missingFields.push('Join code');

    if (missingFields.length > 0) {
      return res.status(400).render('register', {
        title: 'Register',
        csrfToken: req.csrfToken ? req.csrfToken() : '',
        user: null,
        email,
        firstName,
        lastName,
        joinCode,
        error: `Please fill out: ${missingFields.join(', ')}.`,
      });
    }

    // --- Create user in Supabase Auth ---
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Store basic profile in user_metadata (optional, but nice)
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error || !data || !data.user) {
      return res.status(400).render('register', {
        title: 'Register',
        csrfToken: req.csrfToken ? req.csrfToken() : '',
        user: null,
        email,
        firstName,
        lastName,
        joinCode,
        error: error?.message || 'Unable to register. Please try again.',
      });
    }

    // --- Create care_users row via DB function (through the model) ---
    let careUser;
    try {
      careUser = await usersModel.createUpdateCareUser(
        firstName,
        lastName,
        data.user.id
      );
    } catch (rpcErr) {
      console.error(
        'Error calling create_update_care_user via usersModel:',
        rpcErr
      );
      // If this fails, you can decide whether to block registration
      // or allow it and handle profile creation later.
      return res.status(500).render('register', {
        title: 'Register',
        csrfToken: req.csrfToken ? req.csrfToken() : '',
        user: null,
        email,
        firstName,
        lastName,
        joinCode,
        error: 'Error creating user profile. Please try again.',
      });
    }

    if (joinCode && joinCode.trim() !== '') {
      try {
        const { data: rpcResult, error: rpcError } = await supabase.rpc(
          'set_role_from_join_code',
          { joincode: joinCode.trim() } // param name is lowercase in JS
        );

        if (rpcError) {
          console.error('Error calling set_role_from_join_code:', rpcError);
        } else {
          careUser.roleLevel = rpcResult; // 0, 1, or null
        }
      } catch (rpcErr) {
        console.error('RPC set_role_from_join_code failed:', rpcErr);
      }
    }

    // Store user info in the session
    req.session.user = {
      userId: data.user.id,
      email: data.user.email,
      firstName: careUser.firstName,
      lastName: careUser.lastName,
      fullName: careUser.fullName,
      roleLevel: careUser.roleLevel,
    };

    // Optionally keep the access token if you want user-specific queries later
    req.session.supabase = {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };

    // You can choose to redirect home or to a "welcome" page.
    res.redirect('/');
  } catch (err) {
    next(err);
  }
};

/**
 * POST /users/logout
 * Clear session and log out.
 */
exports.postLogout = (req, res, _next) => {
  if (!req.session) {
    return res.redirect('/');
  }

  // Destroy session; Supabase will treat the token as expired on client side.
  req.session.destroy(() => {
    res.redirect('/');
  });
};

/**
 * GET /profile
 * Show the logged-in user's profile.
 */
exports.getProfile = async (req, res, next) => {
  try {
    // Must be logged in
    if (!req.session || !req.session.user) {
      return res.redirect('/users/login');
    }

    const sessionUser = req.session.user;

    // Load the latest user info from v_users via the model
    const careData = await usersModel.getUserByUserId(sessionUser.userId);

    if (!careData) {
      return res.status(404).render('profile', {
        title: 'My Profile',
        csrfToken: req.csrfToken ? req.csrfToken() : '',
        user: sessionUser,
        profile: null,
        error: 'Profile not found.',
        success: null,
      });
    }

    // Sync session user with latest DB values
    req.session.user = {
      ...sessionUser,
      firstName: careData.firstName,
      lastName: careData.lastName,
      fullName: careData.fullName,
      roleLevel: careData.roleLevel,
    };

    const roleLabel = mapRoleLabel(careData.roleLevel);

    const profile = {
      email: sessionUser.email, // from session, not v_users
      firstName: careData.firstName,
      lastName: careData.lastName,
      roleLevel: careData.roleLevel,
      roleLabel,
    };

    res.render('profile', {
      title: 'My Profile',
      csrfToken: req.csrfToken ? req.csrfToken() : '',
      user: req.session.user,
      profile,
      error: null,
      success: null,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /profile
 * Update first and last name for the logged-in user.
 */
exports.postProfile = async (req, res, next) => {
  const { firstName, lastName } = req.body;

  try {
    if (!req.session || !req.session.user) {
      return res.redirect('/users/login');
    }

    const sessionUser = req.session.user;
    const errors = [];

    if (!firstName || !firstName.trim()) errors.push('First name is required.');
    if (!lastName || !lastName.trim()) errors.push('Last name is required.');

    if (errors.length > 0) {
      const roleLabel = mapRoleLabel(sessionUser.roleLevel);

      const profile = {
        email: sessionUser.email,
        firstName,
        lastName,
        roleLevel: sessionUser.roleLevel,
        roleLabel,
      };

      return res.status(400).render('profile', {
        title: 'My Profile',
        csrfToken: req.csrfToken ? req.csrfToken() : '',
        user: sessionUser,
        profile,
        error: errors.join(' '),
        success: null,
      });
    }

    // Update care_users via your Supabase function wrapped in the model
    const updated = await usersModel.createUpdateCareUser(
      firstName.trim(),
      lastName.trim(),
      sessionUser.userId
    );

    // Sync session with updated values
    req.session.user = {
      ...sessionUser,
      firstName: updated.firstName,
      lastName: updated.lastName,
      fullName: updated.fullName,
      roleLevel: updated.roleLevel,
    };

    const roleLabel = mapRoleLabel(updated.roleLevel);

    const profile = {
      email: sessionUser.email,
      firstName: updated.firstName,
      lastName: updated.lastName,
      roleLevel: updated.roleLevel,
      roleLabel,
    };

    res.render('profile', {
      title: 'My Profile',
      csrfToken: req.csrfToken ? req.csrfToken() : '',
      user: req.session.user,
      profile,
      error: null,
      success: 'Profile updated successfully.',
    });
  } catch (err) {
    next(err);
  }
};

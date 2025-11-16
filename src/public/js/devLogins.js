///This JS is used by the Dev shortcut logins.  They will be removed in production, and this file with them.
(function () {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  function quickFill(email) {
    if (!emailInput || !passwordInput) return;
    emailInput.value = email;
    passwordInput.value = '123';
    emailInput.focus();
  }

  document
    .getElementById('dev-student')
    ?.addEventListener('click', function () {
      quickFill('student@care.com');
    });

  document
    .getElementById('dev-teacher')
    ?.addEventListener('click', function () {
      quickFill('teacher@care.com');
    });

  document
    .getElementById('dev-manager')
    ?.addEventListener('click', function () {
      quickFill('manager@care.com');
    });
})();

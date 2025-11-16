///JS used by the registration page.
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('register-form');
    if (!form) return;

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const joinCodeInput = document.getElementById('joinCode');

    const clientErrors = document.getElementById('client-errors');
    const clientErrorsList = document.getElementById('client-errors-list');

    function clearFieldError(input) {
      if (!input) return;
      input.classList.remove('input-error');
    }

    function setFieldError(input) {
      if (!input) return;
      input.classList.add('input-error');
    }

    function validateEmail(value) {
      if (!value) return 'Email is required.';
      // Simple email pattern; adjust as needed
      const emailPattern = /\S+@\S+\.\S+/;
      if (!emailPattern.test(value))
        return 'Please enter a valid email address.';
      return null;
    }

    function validatePassword(value) {
      if (!value) return 'Password is required.';
      if (value.length < 6) return 'Password must be at least 6 characters.';
      return null;
    }

    function validateRequired(value, label) {
      if (!value || !value.trim()) return `${label} is required.`;
      return null;
    }

    form.addEventListener('submit', function (event) {
      const errors = [];

      // Clear previous field error styles
      [
        emailInput,
        passwordInput,
        firstNameInput,
        lastNameInput,
        joinCodeInput,
      ].forEach(clearFieldError);

      const emailError = validateEmail(emailInput.value.trim());
      if (emailError) {
        errors.push(emailError);
        setFieldError(emailInput);
      }

      const passwordError = validatePassword(passwordInput.value);
      if (passwordError) {
        errors.push(passwordError);
        setFieldError(passwordInput);
      }

      const firstNameError = validateRequired(
        firstNameInput.value,
        'First name'
      );
      if (firstNameError) {
        errors.push(firstNameError);
        setFieldError(firstNameInput);
      }

      const lastNameError = validateRequired(lastNameInput.value, 'Last name');
      if (lastNameError) {
        errors.push(lastNameError);
        setFieldError(lastNameInput);
      }

      const joinCodeError = validateRequired(joinCodeInput.value, 'Join code');
      if (joinCodeError) {
        errors.push(joinCodeError);
        setFieldError(joinCodeInput);
      }

      if (errors.length > 0) {
        event.preventDefault();

        // Render error list
        if (clientErrors && clientErrorsList) {
          clientErrorsList.innerHTML = '';
          errors.forEach((msg) => {
            const li = document.createElement('li');
            li.textContent = msg;
            clientErrorsList.appendChild(li);
          });
          clientErrors.style.display = 'block';
        }
      } else {
        // No client-side errors; hide error box (if previously shown)
        if (clientErrors) {
          clientErrors.style.display = 'none';
        }
      }
    });
  });
})();

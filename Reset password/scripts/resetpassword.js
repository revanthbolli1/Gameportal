const form = document.querySelector('form');
const newPasswordInput = document.querySelector('#new-password');
const confirmPasswordInput = document.querySelector('#confirm-password');
const passwordError = document.querySelector('#password-error');

function validatePassword() {
    if (newPasswordInput.value === '') {
        newPasswordInput.classList.add('error');
        passwordError.textContent = 'New password is required';
        return false;
    } else if (newPasswordInput.value.length < 8) {
        newPasswordInput.classList.add('error');
        passwordError.textContent = 'New password must be at least 8 characters long';
        return false;
    } else {
        newPasswordInput.classList.remove('error');
        passwordError.textContent = '';
    }

    if (confirmPasswordInput.value === '') {
        confirmPasswordInput.classList.add('error');
        passwordError.textContent = 'Confirm password is required';
        return false;
    } else if (newPasswordInput.value !== confirmPasswordInput.value) {
        confirmPasswordInput.classList.add('error');
        passwordError.textContent = 'Passwords do not match';
        return false;
    } else {
        confirmPasswordInput.classList.remove('error');
        passwordError.textContent = '';
    }

    return true;
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (validatePassword()) {
        form.submit();
    }
});

newPasswordInput.addEventListener('input', validatePassword);
confirmPasswordInput.addEventListener('input', validatePassword);



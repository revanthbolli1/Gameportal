const emailInput = document.getElementById("email");
const emailError = document.getElementById("email-error");
const resetButton = document.querySelector('input[type="submit"]');
const successMessage = document.getElementById("success-message");

emailInput.addEventListener("input", function () {
  if (emailInput.validity.valid) {
    emailError.textContent = "";
    emailError.className = "error-message";
    resetButton.disabled = false;
  } else {
    showError();
    resetButton.disabled = true;
  }
});

function showError() {
  if (emailInput.validity.valueMissing) {
    emailError.textContent = "Please enter an email address";
  } else if (emailInput.validity.typeMismatch) {
    emailError.textContent = "Please enter a valid email address";
  }
  emailError.className = "error-message active";
}

resetButton.addEventListener("click", function (event) {
  event.preventDefault();
  successMessage.textContent = "A reset password link has been sent to your registered mail!";
  emailInput.remove();
  resetButton.remove();
  document.querySelector('label[for="email"]').remove();
});

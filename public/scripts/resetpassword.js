const newPasswordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmpassword");
const passwordError = document.getElementById("passworderror");
const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const newPassword = newPasswordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  console.log(newPassword, confirmPassword)
  if (!isValidPassword(newPassword) || newPassword !== confirmPassword) {
    passwordError.textContent = "Please enter a valid password and make sure the passwords match.";
    return;
  }
  form.submit();
});

function isValidPassword(password) {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return regex.test(password);
}

[newPasswordInput, confirmPasswordInput].forEach((input) => {
  input.addEventListener("input", () => {
    if (newPasswordInput.classList.contains("error") || confirmPasswordInput.classList.contains("error")) {
      newPasswordInput.classList.remove("error");
      confirmPasswordInput.classList.remove("error");
      passwordError.textContent = "";
    }
  });
});
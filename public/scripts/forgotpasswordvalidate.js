const emailInput = document.getElementById("email");
const emailError = document.getElementById("email-error");
const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = emailInput.value;
  if (!isValidEmail(email)) {
    emailInput.classList.add("error");
    emailError.textContent = "Please enter a valid email address.";
    return;
  }
  form.submit();
});

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

emailInput.addEventListener("input", () => {
  if (emailInput.classList.contains("error")) {
    emailInput.classList.remove("error");
    emailError.textContent = "";
  }
});


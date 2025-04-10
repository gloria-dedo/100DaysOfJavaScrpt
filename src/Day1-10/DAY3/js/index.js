// Form validation script
const form = document.getElementById("form");
const firstName = document.getElementById("Fname");
const lastName = document.getElementById("Lname");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

// validate email
function isValidEmail(email) {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(email);
}

//  sets error message and styling
function setErrorFor(input, message) {
  const controlForm = input.parentElement;
  const small = controlForm.querySelector("small");
  controlForm.className = "control-form fail";
  small.innerText = message;
}

//  sets success styling
function setSuccessFor(input) {
  const controlForm = input.parentElement;
  controlForm.className = "control-form success";
}

// shows success message and hides content
function showSuccessMessage() {
  // Hide the entire main content
  document.querySelector(".flex.h-full").classList.add("hidden");
  
  // Show success message container
  const successMessageContainer = document.getElementById("successMessageContainer");
  successMessageContainer.classList.remove("hidden");
}

//  checks all user inputs
function checkUserInputs() {
  const firstNameValue = firstName.value.trim();
  const lastNameValue = lastName.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();
  const confirmPasswordValue = confirmPassword.value.trim();
  
  let isValid = true;

  // First Name validation
  if (firstNameValue === "") {
    setErrorFor(firstName, "First name cannot be empty");
    isValid = false;
  } else {
    setSuccessFor(firstName);
  }

  // Last Name validation
  if (lastNameValue === "") {
    setErrorFor(lastName, "Last name cannot be empty");
    isValid = false;
  } else {
    setSuccessFor(lastName);
  }

  // Email validation
  if (emailValue === "") {
    setErrorFor(email, "Email cannot be empty");
    isValid = false;
  } else if (!isValidEmail(emailValue)) {
    setErrorFor(email, "Please enter a valid email");
    isValid = false;
  } else {
    setSuccessFor(email);
  }

  // Password validation
  if (passwordValue === "") {
    setErrorFor(password, "Password cannot be empty");
    isValid = false;
  } else if (passwordValue.length < 8) {
    setErrorFor(password, "Password must be at least 8 characters");
    isValid = false;
  } else {
    setSuccessFor(password);
  }

  // Confirm Password validation
  if (confirmPasswordValue === "") {
    setErrorFor(confirmPassword, "Please confirm your password");
    isValid = false;
  } else if (passwordValue !== confirmPasswordValue) {
    setErrorFor(confirmPassword, "Passwords don't match!");
    isValid = false;
  } else {
    setSuccessFor(confirmPassword);
  }
  
  return isValid;
}

// Event listener for form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();
  
  const isValid = checkUserInputs();
  
  if (isValid) {
    showSuccessMessage();
  }
});
const form = document.getElementById("form");
const firstName = document.getElementById("Fname");
const lastName = document.getElementById("Lname");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

//This function checks user inputs
function checkUserInputs() {
  const firstNameValue = firstName.value.trim();
  const lastNameValue = lastName.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();
  const confirmPasswordValue = confirmPassword.value.trim();

  if (firstNameValue === "") {
    setErrorFor(firstName, "Firstname cannot be empty");
  } else {
    setSuccessFor(firstName);
  }

  if (lastNameValue === "") {
    setErrorFor(lastName, "Lastname cannot be empty");
  } else {
    setSuccessFor(lastName);
  }

  if (emailValue === "") {
    setErrorFor(email, "Email cannot be empty");
  } else if (!email(emailValue)) {
    setErrorFor(email, "Please enter a valid email");
  } else {
    setSuccessFor(email);
  }

  if (passwordValue === "") {
    setErrorFor(password, "Password cannot be empty");
  } else {
    setSuccessFor(password);
  }

  if (confirmPasswordValue === "") {
    setErrorFor(confirmPassword, "Password Check cannot be empty");
  } else if (passwordValue !== confirmPassword) {
    setErrorFor(confirmPassword, "Password doesn't match!");
  } else {
    setSuccessFor(confirmPassword);
  }
}
function setErrorFor(input, message) {
  const controlForm = input.parentElement;
  const small = controlForm.querySelector("small");
  controlForm.className = "control-form fail";
  small.innerText = message;
}

function setSuccessFor(input) {
  const controlForm = input.parentElement;
  controlForm.className = "control-form success";
}

function isEmail(email) {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return re.test(email);
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  checkUserInputs();
});

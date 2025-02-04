
let calculation = "";
let currentOperation = null;
let previousValue = "";

// function appendNumber(number) {
//     calculation += number;
//     document.getElementById('display').innerText = calculation;
// }

function appendNumber(number) {
  calculation += number;
  document.getElementById("display").innerText += number;
}

// function chooseOperation(operation) {
//     if (calculation === '') return;
//     if (currentOperation !== null) compute();
//     previousValue = calculation;
//     currentOperation = operation;
//     calculation = previousValue + '' + operation + '';
//     document.getElementById('display').innerText = calculation;
// }

function chooseOperation(operation) {
  if (calculation === "") return;
  if (currentOperation !== null) compute();
  previousValue = calculation;
  currentOperation = operation;
  document.getElementById("display").innerText =
    previousValue + " " + operation + " ";
  calculation = "";
}

function compute() {
  let result;
  const prev = parseFloat(previousValue);
  const current = parseFloat(calculation);
  if (isNaN(prev) || isNaN(current)) return;
  switch (currentOperation) {
    case "+":
      result = prev + current;
      break;
    case "-":
      result = prev - current;
      break;
    case "*":
      result = prev * current;
      break;
    case "/":
      result = prev / current;
      break;
    default:
      return;
  }
  calculation = result;
  currentOperation = null;
  previousValue = "";
  document.getElementById("display").innerText = calculation;
}

function clearDisplay() {
  calculation = "";
  currentOperation = null;
  previousValue = "";
  document.getElementById("display").innerText = calculation;
}

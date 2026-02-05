const display = document.getElementById("display");
const keys = document.querySelector(".keys");

let current = "0";
let firstOperand = null;
let operator = null;
let waitingSecondOperand = false;

function updateDisplay() {
  display.value = current;
}

function inputNumber(number) {
  if (waitingSecondOperand) {
    current = number;
    waitingSecondOperand = false;
    return;
  }

  current = current === "0" ? number : current + number;
}

function inputDecimal() {
  if (waitingSecondOperand) {
    current = "0.";
    waitingSecondOperand = false;
    return;
  }

  if (!current.includes(".")) {
    current += ".";
  }
}

function clearCalculator() {
  current = "0";
  firstOperand = null;
  operator = null;
  waitingSecondOperand = false;
}

function backspace() {
  if (waitingSecondOperand) return;

  current = current.length > 1 ? current.slice(0, -1) : "0";
}

function calculate(a, b, op) {
  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "*") return a * b;
  if (op === "/") return b === 0 ? "Error" : a / b;
  return b;
}

function handleOperator(nextOperator) {
  const inputValue = Number(current);

  if (operator && waitingSecondOperand) {
    operator = nextOperator;
    return;
  }

  if (firstOperand === null) {
    firstOperand = inputValue;
  } else if (operator) {
    const result = calculate(firstOperand, inputValue, operator);
    current = String(result);
    firstOperand = result === "Error" ? null : Number(result);
  }

  waitingSecondOperand = true;
  operator = nextOperator;
}

function handleEquals() {
  if (operator === null || waitingSecondOperand) return;

  const inputValue = Number(current);
  const result = calculate(firstOperand, inputValue, operator);
  current = String(result);
  firstOperand = result === "Error" ? null : Number(result);
  operator = null;
  waitingSecondOperand = false;
}

keys.addEventListener("click", (event) => {
  const target = event.target;
  if (!target.matches("button")) return;

  if (target.dataset.number !== undefined) {
    if (target.dataset.number === ".") {
      inputDecimal();
    } else {
      inputNumber(target.dataset.number);
    }
    updateDisplay();
    return;
  }

  if (target.dataset.operator) {
    handleOperator(target.dataset.operator);
    updateDisplay();
    return;
  }

  switch (target.dataset.action) {
    case "clear":
      clearCalculator();
      break;
    case "backspace":
      backspace();
      break;
    case "calculate":
      handleEquals();
      break;
    default:
      break;
  }

  updateDisplay();
});

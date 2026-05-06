let display;
let currentInput = '';
let operator = null;
let previousValue = null;
let shouldResetDisplay = false;

document.addEventListener('DOMContentLoaded', function() {
    display = document.getElementById('display');
    updateDisplay();
});

// Append number to display
function appendNumber(num) {
    if (num === '.' && currentInput.includes('.')) return;
    if (shouldResetDisplay) {
        currentInput = num;
        shouldResetDisplay = false;
    } else {
        currentInput += num;
    }
    updateDisplay();
}

// Append operator
function appendOperator(op) {
    if (currentInput === '') return;
    
    if (operator !== null && !shouldResetDisplay) {
        calculate();
    }
    
    operator = op;
    previousValue = currentInput;
    shouldResetDisplay = true;
    updateDisplay();
}

// Calculate result
function calculate() {
    if (operator === null || currentInput === '' || previousValue === null) return;
    
    let result;
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentInput);
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert('Cannot divide by zero!');
                clearDisplay();
                return;
            }
            result = prev / current;
            break;
        case '%':
            result = prev % current;
            break;
        default:
            return;
    }
    
    currentInput = result.toString();
    operator = null;
    previousValue = null;
    shouldResetDisplay = true;
    updateDisplay();
}

// Clear display
function clearDisplay() {
    currentInput = '';
    operator = null;
    previousValue = null;
    shouldResetDisplay = false;
    updateDisplay();
}

// Delete last character
function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
}

// Update display
function updateDisplay() {
    if (operator !== null && previousValue !== null) {
        display.value = previousValue + ' ' + operator + ' ' + currentInput;
    } else {
        display.value = currentInput;
    }
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        appendOperator(e.key);
    } else if (e.key === '%') {
        appendOperator('%');
    } else if (e.key === 'Enter' || e.key === '=') {
        calculate();
    } else if (e.key === 'Backspace') {
        deleteLast();
    } else if (e.key === 'Escape') {
        clearDisplay();
    } else if (e.key === '.') {
        appendNumber('.');
    }
});
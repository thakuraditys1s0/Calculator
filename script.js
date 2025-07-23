const display = document.getElementById('display');
const clickSound = document.getElementById('clickSound');
const historyBox = document.getElementById('history');
const toggleThemeBtn = document.querySelector('.toggle-theme');
const toggleSciBtn = document.querySelector('.toggle-scientific');
const toggleHistoryBtn = document.querySelector('.toggle-history');
const clearHistoryBtn = document.querySelector('.clear-history');
const buttonGrid = document.getElementById('button-grid');
const sciGrid = document.getElementById('sci-buttons');

let currentInput = '';
let scientificMode = false;
let historyVisible = false;

const basicButtons = [
  'C','⌫','/','*',
  '7','8','9','-',
  '4','5','6','+',
  '1','2','3','=',
  '0','.','(',')'
];

const scientificButtons = [
  'sin','cos','tan','log',
  'ln','√','x²','x³',
  'π','e','^',''
];

function renderButtons() {
  buttonGrid.innerHTML = '';
  sciGrid.innerHTML = '';

  // Render scientific row if mode ON
  if (scientificMode) {
    sciGrid.style.display = 'grid';
    scientificButtons.forEach(text => {
      const btn = document.createElement('button');
      btn.textContent = text;
      if (['/','*','-','+','^'].includes(text)) btn.classList.add('operator');
      if (text) btn.addEventListener('click', () => handleButton(text));
      sciGrid.appendChild(btn);
    });
  } else {
    sciGrid.style.display = 'none';
  }

  // Render basic grid
  basicButtons.forEach(text => {
    const btn = document.createElement('button');
    btn.textContent = text;
    if (['/','*','-','+','^'].includes(text)) btn.classList.add('operator');
    if (text === 'C') btn.classList.add('clear');
    if (text === '=') btn.classList.add('equal');
    buttonGrid.appendChild(btn);
    btn.addEventListener('click', () => handleButton(text));
  });
}

renderButtons();

function playClickSound() {
  clickSound.currentTime = 0;
  clickSound.play();
}

function popDisplay() {
  display.classList.add('pop');
  setTimeout(() => display.classList.remove('pop'), 150);
}

function addToHistory(expression, result) {
  const entry = document.createElement('div');
  entry.textContent = `${expression} = ${result}`;
  historyBox.prepend(entry);
  clearHistoryBtn.style.display = 'block';
}

function clearHistory() {
  historyBox.innerHTML = '';
  clearHistoryBtn.style.display = 'none';
}

function evaluateExpression() {
  try {
    let expression = currentInput.replace(/π/g, Math.PI).replace(/e/g, Math.E);
    expression = expression.replace(/(\d+)\^(\d+)/g, 'Math.pow($1,$2)');
    expression = expression.replace(/sin/g, 'Math.sin')
                           .replace(/cos/g, 'Math.cos')
                           .replace(/tan/g, 'Math.tan')
                           .replace(/log/g, 'Math.log10')
                           .replace(/ln/g, 'Math.log')
                           .replace(/√/g, 'Math.sqrt')
                           .replace(/x²/g, '**2')
                           .replace(/x³/g, '**3');

    const result = eval(expression);
    addToHistory(currentInput, result);
    currentInput = result.toString();
    display.value = currentInput;
  } catch {
    display.value = 'Error';
    currentInput = '';
  }
  popDisplay();
}

function handleButton(value) {
  playClickSound();
  if (value === 'C') {
    currentInput = '';
    display.value = '';
    popDisplay();
  } else if (value === '=') {
    evaluateExpression();
  } else if (value === '⌫') {
    currentInput = currentInput.slice(0, -1);
    display.value = currentInput;
    popDisplay();
  } else {
    currentInput += value;
    display.value = currentInput;
    popDisplay();
  }
}

toggleThemeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  playClickSound();
});

toggleSciBtn.addEventListener('click', () => {
  scientificMode = !scientificMode;
  toggleSciBtn.textContent = scientificMode ? '🔙 Basic Mode' : '🧪 Scientific Mode';
  renderButtons();
  playClickSound();
});

toggleHistoryBtn.addEventListener('click', () => {
  historyVisible = !historyVisible;
  historyBox.style.display = historyVisible ? 'block' : 'none';
  toggleHistoryBtn.textContent = historyVisible ? '❌ Close History' : '📜 History';
  playClickSound();
});

clearHistoryBtn.addEventListener('click', () => {
  clearHistory();
  playClickSound();
});

document.addEventListener('keydown', (e) => {
  const key = e.key;
  if (!isNaN(key) || ['+', '-', '*', '/', '.', '(', ')'].includes(key)) {
    currentInput += key;
    display.value = currentInput;
    popDisplay();
    playClickSound();
  } else if (key === 'Enter') {
    evaluateExpression();
    playClickSound();
  } else if (key === 'Backspace') {
    currentInput = currentInput.slice(0, -1);
    display.value = currentInput;
    popDisplay();
    playClickSound();
  } else if (key === 'Escape') {
    currentInput = '';
    display.value = '';
    popDisplay();
    playClickSound();
  }
});

/* ---------------------------------- */
/* 🔗 Element References */
/* ---------------------------------- */
const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const resetTime = document.getElementById('reset-time');
const confettiToggle = document.getElementById('confetti-toggle');
const settings = document.getElementById('settings');
const settingsToggle = document.getElementById('settings-toggle');
const unlockBtn = document.getElementById('unlock-pro');
const toast = document.getElementById('toast');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const spoonDisplay = document.getElementById('spoon-display');
const spoonBar = document.getElementById('spoon-bar');
const selfCareContainer = document.querySelector('.self-care-tasks');
const customForm = document.getElementById('custom-self-care-form');
const customTaskInput = document.getElementById('custom-task-text');
const customTaskReward = document.getElementById('custom-task-reward');
const toggleCustomTaskBtn = document.getElementById('toggle-custom-task-form');

/* ---------------------------------- */
/* 🧠 State Initialisation */
/* ---------------------------------- */
let spoonCount = parseInt(localStorage.getItem('spoonCount'), 10) || 0;
let tasks = JSON.parse(localStorage.getItem('spoons-tasks')) || [];
let customSelfCare = JSON.parse(localStorage.getItem('customSelfCare')) || [];
let lastReset = localStorage.getItem('lastReset') || '';
let pendingTaskText = '';

/* ---------------------------------- */
/* 🌒 Dark Mode Preference */
/* ---------------------------------- */
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark');
  darkModeToggle.checked = true;
}

/* ---------------------------------- */
/* ✅ Task Handling Functions */
/* ---------------------------------- */
function renderTasks() {
  list.innerHTML = '';
  tasks.forEach((task, i) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    li.draggable = true;
    li.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button onclick="toggleTask(${i})">✓</button>
        <button onclick="deleteTask(${i})">✗</button>
      </div>`;
    list.appendChild(li);
  });
}

function addTask(e) {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  pendingTaskText = text;
  input.value = '';
  document.getElementById('difficulty-modal').classList.remove('hidden');
}

function setDifficulty(spoons) {
  tasks.push({ text: pendingTaskText, completed: false, spoons });
  pendingTaskText = '';
  saveTasks();
  document.getElementById('difficulty-modal').classList.add('hidden');
}

function toggleTask(index) {
  const task = tasks[index];
  const cost = task.spoons || 1;

  if (!task.completed && spoonCount < cost) {
    alert('Not enough spoons to complete this task.');
    return;
  }

  task.completed = !task.completed;
  spoonCount += task.completed ? -cost : cost;

  localStorage.setItem('spoonCount', spoonCount);
  updateSpoonDisplay();
  saveTasks();

  if (tasks.every(t => t.completed) && confettiToggle.checked) {
    startConfetti();
    setTimeout(stopConfetti, 3000);
    showToast();
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
}

function saveTasks() {
  localStorage.setItem('spoons-tasks', JSON.stringify(tasks));
  renderTasks();
}

/* ---------------------------------- */
/* 🧘 Self-Care Functions */
/* ---------------------------------- */
function completeSelfCare(button, reward) {
  if (button.disabled) return;
  spoonCount += reward;
  localStorage.setItem('spoonCount', spoonCount);
  updateSpoonDisplay();
  button.disabled = true;
}

function renderCustomSelfCare() {
  selfCareContainer.innerHTML = '';
  customSelfCare.forEach(({ text, reward }) => {
    const btn = document.createElement('button');
    btn.className = 'self-care-btn';
    btn.textContent = text;
    btn.onclick = () => completeSelfCare(btn, reward);
    selfCareContainer.appendChild(btn);
  });
}

customForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = customTaskInput.value.trim();
  const reward = parseInt(customTaskReward.value, 10);
  if (!text || isNaN(reward)) return;

  customSelfCare.push({ text, reward });
  localStorage.setItem('customSelfCare', JSON.stringify(customSelfCare));
  renderCustomSelfCare();

  customTaskInput.value = '';
  customTaskReward.value = 1;
});

toggleCustomTaskBtn.addEventListener('click', () => customForm.classList.toggle('hidden'));

/* ---------------------------------- */
/* 🔄 Spoon and Motivation Logic */
/* ---------------------------------- */
function showMotivationPrompt() {
  document.getElementById('motivation-modal').classList.remove('hidden');
}

function setMotivation(level) {
  spoonCount = { low: 10, medium: 15, high: 20 }[level] || 10;
  localStorage.setItem('spoonCount', spoonCount);
  updateSpoonDisplay();
  document.getElementById('motivation-modal').classList.add('hidden');
  spoonDisplay.classList.remove('hidden');
}

function updateSpoonDisplay() {
  spoonBar.innerHTML = '🥄'.repeat(spoonCount);
}

function checkReset() {
  const now = new Date().toDateString();
  if (now !== lastReset) {
    tasks = [];
    localStorage.setItem('spoons-tasks', JSON.stringify(tasks));
    showMotivationPrompt();
    lastReset = now;
    localStorage.setItem('lastReset', lastReset);
  } else {
    updateSpoonDisplay();
    spoonDisplay.classList.remove('hidden');
  }
}

/* ---------------------------------- */
/* 🥳 Feedback & Settings */
/* ---------------------------------- */
function showToast() {
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

function unlockPro() {
  confettiToggle.disabled = false;
  resetTime.disabled = false;
  alert('Pro features unlocked!');
}

/* ---------------------------------- */
/* 🚀 App Initialisation */
/* ---------------------------------- */
form.addEventListener('submit', addTask);
settingsToggle.addEventListener('click', () => settings.classList.toggle('hidden'));
unlockBtn.addEventListener('click', unlockPro);
darkModeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', darkModeToggle.checked);
});

checkReset();
renderTasks();
renderCustomSelfCare();
enableReordering();

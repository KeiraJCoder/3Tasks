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
const spoonCountSpan = document.getElementById('spoon-count');
const selfCareContainer = document.querySelector('.self-care-tasks');

// Custom Self-Care Form Elements
const customForm = document.getElementById('custom-self-care-form');
const customTaskInput = document.getElementById('custom-task-text');
const customTaskReward = document.getElementById('custom-task-reward');

/* ---------------------------------- */
/* 🧠 State Initialisation */
/* ---------------------------------- */
let spoonCount = parseInt(localStorage.getItem('spoonCount')) || 0;
let tasks = JSON.parse(localStorage.getItem('spoons-tasks')) || [];
let lastReset = localStorage.getItem('lastReset') || '';
let customSelfCare = JSON.parse(localStorage.getItem('customSelfCare')) || [];
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
    li.setAttribute('draggable', 'true');
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
  document.getElementById('difficulty-modal').classList.add('hidden');

  tasks.push({ text: pendingTaskText, completed: false, spoons });
  pendingTaskText = '';
  saveTasks();
}

function toggleTask(index) {
  const task = tasks[index];
  const cost = task.spoons || 1;

  if (!task.completed && spoonCount < cost) {
    alert('Not enough spoons to complete this task.');
    return;
  }

  const wasAllComplete = tasks.length && tasks.every(t => t.completed);
  task.completed = !task.completed;

  spoonCount += task.completed ? -cost : cost;

  localStorage.setItem('spoonCount', spoonCount);
  updateSpoonDisplay();
  saveTasks();

  const isAllComplete = tasks.length && tasks.every(t => t.completed);
  if (!wasAllComplete && isAllComplete && confettiToggle.checked) {
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
  localStorage.setItem('microtasks', JSON.stringify(tasks));
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
  customSelfCare.forEach(({ text, reward }) => {
    const btn = document.createElement('button');
    btn.className = 'self-care-btn';
    btn.textContent = text;
    btn.onclick = function () {
      completeSelfCare(this, reward);
    };
    selfCareContainer.appendChild(btn);
  });
}

/* ---------------------------------- */
/* ➕ Custom Self-Care Handling */
/* ---------------------------------- */
customForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = customTaskInput.value.trim();
  const reward = parseInt(customTaskReward.value, 10);
  if (!text || isNaN(reward)) return;

  const newTask = { text, reward };
  customSelfCare.push(newTask);
  localStorage.setItem('customSelfCare', JSON.stringify(customSelfCare));

  const btn = document.createElement('button');
  btn.className = 'self-care-btn';
  btn.textContent = text;
  btn.onclick = function () {
    completeSelfCare(this, reward);
  };
  selfCareContainer.appendChild(btn);

  customTaskInput.value = '';
  customTaskReward.value = 1;
});

const toggleCustomTaskBtn = document.getElementById('toggle-custom-task-form');

toggleCustomTaskBtn?.addEventListener('click', () => {
  customForm.classList.toggle('hidden');
});


/* ---------------------------------- */
/* 🔄 Spoon and Motivation Logic */
/* ---------------------------------- */
function showMotivationPrompt() {
  document.getElementById('motivation-modal').classList.remove('hidden');
}

function setMotivation(level) {
  const values = { low: 10, medium: 15, high: 20 };
  spoonCount = values[level] || 0;
  localStorage.setItem('spoonCount', spoonCount);
  updateSpoonDisplay();

  document.getElementById('motivation-modal').classList.add('hidden');
  spoonDisplay.classList.remove('hidden');
}

function updateSpoonDisplay() {
  const bar = document.getElementById('spoon-bar');
  bar.innerHTML = '🥄'.repeat(spoonCount);
}

function checkReset() {
  const now = new Date().toDateString();
  if (now !== lastReset) {
    tasks = [];
    spoonCount = 0;
    localStorage.setItem('spoonCount', spoonCount);
    lastReset = now;
    localStorage.setItem('lastReset', lastReset);
    saveTasks();
    showMotivationPrompt();
  } else {
    updateSpoonDisplay();
    spoonDisplay.classList.remove('hidden');
  }
}

/* ---------------------------------- */
/* 🥳 Feedback & Visual Effects */
/* ---------------------------------- */
function showToast() {
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

function unlockPro() {
  alert("Mock paywall: Imagine you've paid! Features unlocked.");
  confettiToggle.disabled = false;
  resetTime.disabled = false;
}

/* ---------------------------------- */
/* 🌙 Dark Mode Toggle */
/* ---------------------------------- */
darkModeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', darkModeToggle.checked);
});

/* ---------------------------------- */
/* 🧲 Drag-and-Drop Reordering */
/* ---------------------------------- */
function enableReordering() {
  let dragged;
  list.addEventListener('dragstart', (e) => {
    dragged = e.target;
    e.dataTransfer.effectAllowed = 'move';
  });

  list.addEventListener('dragover', (e) => e.preventDefault());

  list.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.target.tagName === 'LI' && dragged !== e.target) {
      const children = [...list.children];
      const fromIndex = children.indexOf(dragged);
      const toIndex = children.indexOf(e.target);
      tasks.splice(toIndex, 0, tasks.splice(fromIndex, 1)[0]);
      saveTasks();
    }
  });
}

/* ---------------------------------- */
/* 🚀 App Initialisation */
/* ---------------------------------- */
form.addEventListener('submit', addTask);
settingsToggle.addEventListener('click', () => settings.classList.toggle('hidden'));
unlockBtn.addEventListener('click', unlockPro);

checkReset();
showMotivationPrompt(); // TEMPORARY: forces the motivation modal

renderTasks();
renderCustomSelfCare();
enableReordering();

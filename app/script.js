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

let tasks = JSON.parse(localStorage.getItem('microtasks')) || [];
let lastReset = localStorage.getItem('lastReset') || '';

// Load saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark');
  darkModeToggle.checked = true;
}

// Render the task list
function renderTasks() {
  list.innerHTML = '';
  tasks.forEach((task, i) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    li.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button onclick="toggleTask(${i})">✓</button>
        <button onclick="deleteTask(${i})">✗</button>
      </div>`;
    list.appendChild(li);
  });
}

// Add a new task
function addTask(e) {
  e.preventDefault();
  if (tasks.length >= 3) {
    alert('Max 3 tasks per day.');
    return;
  }
  tasks.push({ text: input.value.trim(), completed: false });
  input.value = '';
  saveTasks();
}

// Toggle task completion
function toggleTask(index) {
  const allTasksAdded = tasks.length === 3;
  const wasAllComplete = allTasksAdded && tasks.every(t => t.completed);

  tasks[index].completed = !tasks[index].completed;
  saveTasks();

  const isAllComplete = tasks.length === 3 && tasks.every(t => t.completed);

  if (!wasAllComplete && isAllComplete && confettiToggle.checked) {
    startConfetti();
    setTimeout(stopConfetti, 3000);
    showToast();
  }
}

// Delete a task
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
}

// Save tasks to localStorage and re-render
function saveTasks() {
  localStorage.setItem('microtasks', JSON.stringify(tasks));
  renderTasks();
}

// Reset tasks daily
function checkReset() {
  const now = new Date().toDateString();
  if (now !== lastReset) {
    tasks = [];
    saveTasks();
    lastReset = now;
    localStorage.setItem('lastReset', lastReset);
  }
}

// Toast logic
function showToast() {
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

// Fake "pro unlock" logic
function unlockPro() {
  alert("Mock paywall: Imagine you've paid! Features unlocked.");
  confettiToggle.disabled = false;
  resetTime.disabled = false;
}

// Dark mode toggle
darkModeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', darkModeToggle.checked);
});

// Event listeners
form.addEventListener('submit', addTask);
settingsToggle.addEventListener('click', () => settings.classList.toggle('hidden'));
unlockBtn.addEventListener('click', unlockPro);

// Init
checkReset();
renderTasks();

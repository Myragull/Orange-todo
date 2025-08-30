/* ================================
   1. GLOBAL CONSTANTS & DOM REFERENCES
================================= */
const allInputs = document.querySelectorAll(".user-input");
const toggleBtn = document.getElementById("toggle-btn");
const savedTheme = localStorage.getItem("theme");
const filterButtons = document.querySelectorAll(".filter-btn");
const dateTimeEl = document.querySelector(".datetime");

/* ================================
   2. STATE VARIABLES
================================= */
let currentFilter = "all"; // "all", "completed", "pending"
let todoData = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: [],
};

/* ================================
   3. UTILITY FUNCTIONS
================================= */
// Save to localstorage
function saveToLocalStorage() {
  localStorage.setItem("todoData", JSON.stringify(todoData));
}

// Get data from localstorage
function loadFromLocalStorage() {
  const storedData = localStorage.getItem("todoData");
  if (storedData) {
    todoData = JSON.parse(storedData);
    Object.keys(todoData).forEach((day) => renderTasks(day));
  }
}

// Loader animation
function loaderAnimation() {
  const loader = document.querySelector("#loader");
  setTimeout(() => {
    loader.style.top = "-100%";
  }, 4200);
}

// Format and update date-time
function updateDateTime() {
  const now = new Date();
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  const formatted = now.toLocaleString("en-US", options);
  dateTimeEl.textContent = formatted.replace(",", " -");
}

/* ================================
   4. CORE FUNCTIONS
================================= */
// Render tasks for a day
function renderTasks(day) {
  const daySection = document.querySelector(`.day-section[data-day="${day}"]`);
  const taskList = daySection.querySelector(".task-list");
  taskList.innerHTML = "";

  todoData[day].forEach((task, index) => {
    if (currentFilter === "completed" && !task.completed) return;
    if (currentFilter === "pending" && task.completed) return;

    const li = document.createElement("li");
    li.classList.add("task-item");
    li.innerHTML = `
      <div class="task-content">
        <label>
          <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""}>
          <span class="task-text">${task.text}</span>
        </label>
      </div>
      <div class="task-actions">
        <span class="task-action edit-icon"><i class="ri-pencil-line"></i></span>
        <span class="task-action delete-icon"><i class="ri-delete-bin-4-line"></i></span>
      </div>
    `;

    if (task.completed) li.classList.add("completed");
    taskList.appendChild(li);

    // Delete task
    li.querySelector(".delete-icon").addEventListener("click", () => {
      todoData[day].splice(index, 1);
      saveToLocalStorage();
      renderTasks(day);
    });

    // Edit task
    li.querySelector(".edit-icon").addEventListener("click", () => {
      const taskSpan = li.querySelector(".task-text");
      const oldText = taskSpan.textContent;
      const input = document.createElement("input");
      input.type = "text";
      input.value = oldText;
      input.classList.add("edit-input");
      taskSpan.replaceWith(input);
      input.focus();

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && input.value.trim() !== "") {
          todoData[day][index].text = input.value.trim();
          saveToLocalStorage();
          renderTasks(day);
        }
      });

      input.addEventListener("blur", () => {
        if (input.value.trim() !== "") {
          todoData[day][index].text = input.value.trim();
          saveToLocalStorage();
        }
        renderTasks(day);
      });
    });

    // Toggle complete
    li.querySelector(".task-checkbox").addEventListener("change", (e) => {
      todoData[day][index].completed = e.target.checked;
      saveToLocalStorage();
      li.classList.toggle("completed", e.target.checked);
    });
  });
}

/* ================================
   5. EVENT LISTENERS
================================= */
// Add task on Enter
allInputs.forEach((input) => {
  const day = input.closest(".day-section").dataset.day;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && input.value.trim() !== "") {
      todoData[day].push({ text: input.value.trim(), completed: false });
      renderTasks(day);
      saveToLocalStorage();
      input.value = "";
    }
  });
});

// Apply saved theme
document.body.classList.toggle("dark-theme", savedTheme === "dark-theme");
toggleBtn.className = savedTheme === "dark-theme" ? "ri-moon-line" : "ri-sun-line";

// Toggle theme
toggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDark ? "dark-theme" : "light-theme");
  toggleBtn.className = isDark ? "ri-moon-line" : "ri-sun-line";
});

// Toggle day sections
document.querySelectorAll(".day-header").forEach((header) => {
  header.addEventListener("click", () => {
    header.closest(".day-section").classList.toggle("open");
  });
});

// Filter buttons
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.textContent.trim().toLowerCase();
    Object.keys(todoData).forEach((day) => renderTasks(day));
  });
});

/* ================================
   6. INITIALIZATION
================================= */
updateDateTime();
setInterval(updateDateTime, 60000);
loadFromLocalStorage();
loaderAnimation();

const allInputs = document.querySelectorAll('.user-input');
const toggleBtn = document.getElementById("toggle-btn");
const savedTheme = localStorage.getItem("theme");
const filterButtons = document.querySelectorAll(".filter-btn");
let currentFilter = "all";  // can be "all", "completed", "pending"


let todoData = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: []
};

// save to localstorage
function saveToLocalStorage() {
  localStorage.setItem("todoData", JSON.stringify(todoData));
}

// get the data from localstoarage
function loadFromLocalStorage() {
  const storedData = localStorage.getItem("todoData");
  if (storedData) {
    todoData = JSON.parse(storedData);  
    Object.keys(todoData).forEach(day => renderTasks(day));
  }
}

// loader animation
function loaderAnimation() {
    var loader = document.querySelector("#loader")
    setTimeout(function () {
        loader.style.top = "-100%"
    }, 4200)
}

// Render tasks for a day
function renderTasks(day) {
  const daySection = document.querySelector(`.day-section[data-day="${day}"]`);
  const taskList = daySection.querySelector('.task-list');

  taskList.innerHTML = "";

  todoData[day].forEach((task,index) => {
    if (currentFilter === "completed" && !task.completed) return;
    if (currentFilter === "pending" && task.completed) return;

    
    const li = document.createElement('li');
    li.classList.add('task-item');
    li.innerHTML = `
      <div class="task-content">
      <label>
       <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""}>
  <span class="task-text">${task.text}</span>
      </label>
      </div>
      <div class="task-actions">
        <span class="task-action edit-icon">
               <i class="ri-pencil-line"></i>
        </span>
        <span class="task-action delete-icon">
                 <i class="ri-delete-bin-4-line"></i>
        </span>
      </div>
    `;

     // ✅ restore strike-through if completed
  if (task.completed) {
    li.classList.add("completed");
  }
    taskList.appendChild(li);

  //  Delete button functionality
    const deleteBtn = li.querySelector('.delete-icon');
    deleteBtn.addEventListener('click', () => {
      // remove task from array
      todoData[day].splice(index, 1);
      // save updated data
      saveToLocalStorage();
      // re-render tasks
      renderTasks(day);
    });

    // ✅ Edit button functionality
    const editBtn = li.querySelector('.edit-icon');

    editBtn.addEventListener('click', () => {
      const taskSpan = li.querySelector('.task-text');
      const oldText = taskSpan.textContent;

      // Replace span with an input
      const input = document.createElement('input');
      input.type = "text";
      input.value = oldText;
      input.classList.add("edit-input");

      taskSpan.replaceWith(input);
      input.focus();

      // Save on Enter OR Blur
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

li.querySelector('.task-checkbox').addEventListener("change", (e) => {
    todoData[day][index].completed = e.target.checked;
    saveToLocalStorage();
    li.classList.toggle("completed", e.target.checked);
  });

  });
}

// Add task on Enter
allInputs.forEach(input => {
  const day = input.closest('.day-section').dataset.day;
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim() !== "") {
      todoData[day].push({ text: input.value.trim(), completed: false });   // ✅ NEW
      renderTasks(day);
      saveToLocalStorage();
      input.value = "";
    }
  });
});

// Toggle theme
// Apply saved theme on load
document.body.classList.toggle("dark-theme", savedTheme === "dark-theme");
toggleBtn.className = savedTheme === "dark-theme" ? "ri-moon-line" : "ri-sun-line";

// Toggle theme on click
toggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDark ? "dark-theme" : "light-theme");
  toggleBtn.className = isDark ? "ri-moon-line" : "ri-sun-line";
});


// Toggle day sections
document.querySelectorAll('.day-header').forEach(header => {
  header.addEventListener('click', () => {
    const section = header.closest('.day-section');
    section.classList.toggle('open');
  });
});


// Filter buttons
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // read button text (All, Completed, Pending)
    const filterType = btn.textContent.trim().toLowerCase();
    currentFilter = filterType;  // "all" | "completed" | "pending"

    // re-render all days
    Object.keys(todoData).forEach(day => renderTasks(day));
  });
});



// ✅ Select the date-time element at the very top
const dateTimeEl = document.querySelector(".datetime");

// ✅ Function to format and update date-time
function updateDateTime() {
  const now = new Date();

  // Format options
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  };

  // Format like "August 26, 2025, 2:30 PM"
  const formatted = now.toLocaleString("en-US", options);

  // Replace comma with dash
  dateTimeEl.textContent = formatted.replace(",", " -");
}

// ✅ Call once at start
updateDateTime();

// ✅ Keep updating every minute
setInterval(updateDateTime, 60000);


loadFromLocalStorage();
loaderAnimation()



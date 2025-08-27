const allInputs = document.querySelectorAll('.user-input');

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
    todoData = JSON.parse(storedData);  // replace our empty object
    // re-render tasks for all days
    Object.keys(todoData).forEach(day => renderTasks(day));
  }
}



// Render tasks for a day
function renderTasks(day) {
  const daySection = document.querySelector(`.day-section[data-day="${day}"]`);
  const taskList = daySection.querySelector('.task-list');

  taskList.innerHTML = "";

  todoData[day].forEach((taskText,index) => {
    const li = document.createElement('li');
    li.classList.add('task-item');
    li.innerHTML = `
      <div class="task-content">
        <div class="task-checkbox"></div>
        <span class="task-text">${taskText}</span>
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
          todoData[day][index] = input.value.trim();
          saveToLocalStorage();
          renderTasks(day);
        }
      });

      input.addEventListener("blur", () => {
        if (input.value.trim() !== "") {
          todoData[day][index] = input.value.trim();
          saveToLocalStorage();
        }
        renderTasks(day);
      });
    });

  });
}

// Add task on Enter
allInputs.forEach(input => {
  const day = input.closest('.day-section').dataset.day;

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim() !== "") {
      todoData[day].push(input.value.trim());
      renderTasks(day);
      saveToLocalStorage();
      input.value = "";
    }
  });
});


loadFromLocalStorage();


// Toggle day sections
document.querySelectorAll('.day-header').forEach(header => {
  header.addEventListener('click', () => {
    const section = header.closest('.day-section');
    section.classList.toggle('open');
  });
});




document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskDate = document.getElementById('task-date');
    const taskList = document.getElementById('task-list');

    let tasks = loadTasksFromCookies();

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const taskText = taskInput.value.trim();
        const date = taskDate.value;
        const priority = document.querySelector('input[name="priority"]:checked').value;

        if (taskText === '') return;

        const task = { text: taskText, date, priority };
        tasks.push(task);
        saveTasksToCookies();

        renderTasks();

        taskInput.value = '';
        taskDate.value = '';
    });

    function renderTasks() {
        taskList.innerHTML = '';

        tasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');

            taskItem.innerHTML = `
                ${task.text} ${task.date ? `(${task.date})` : ''} - Priority: ${task.priority}
                <button class="delete-task" data-index="${index}">Delete</button>
            `;
            taskList.appendChild(taskItem);
        });

        attachDeleteHandlers();
    }

    function attachDeleteHandlers() {
        const deleteButtons = document.querySelectorAll('.delete-task');

        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const index = button.getAttribute('data-index');
                tasks.splice(index, 1);
                saveTasksToCookies();
                renderTasks();
            });
        });
    }

    function saveTasksToCookies() {
        const daysToExpire = 365;  
        const date = new Date();
        date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000)); 
        const expires = `expires=${date.toUTCString()}`;
        const encodedTasks = encodeURIComponent(JSON.stringify(tasks));  
        document.cookie = `tasks=${encodedTasks}; ${expires}; path=/`;  
    }

    function loadTasksFromCookies() {
        const match = document.cookie.match(/tasks=([^;]+)/);
        if (match) {
            try {
                return JSON.parse(decodeURIComponent(match[1]));
            } catch (e) {
                console.error("Error:", e);
                return [];
            }
        } else {
            return [];
        }
    }

    // Initialize flatpickr for datetime input
    flatpickr("#task-date", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        altInput: true,
        disableMobile: true,
        placeholder: "Select DateTime",
    });

    renderTasks();
});

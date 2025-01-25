document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav button');
    const sections = document.querySelectorAll('.section');

    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskDate = document.getElementById('task-date');
    const taskNote = document.getElementById('task-note');
    const taskList = document.getElementById('task-list');
    const calendarTasks = document.getElementById('calendar-tasks');
    const notesList = document.getElementById('notes-list');

    let tasks = loadTasksFromCookies();

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.getAttribute('data-section');

            sections.forEach(section => section.classList.remove('active'));
            const activeSection = document.getElementById(sectionId);
            activeSection.classList.add('active');
        });
    });

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const taskText = taskInput.value.trim();
        const date = taskDate.value;
        const note = taskNote.value.trim();

        if (taskText === '') return;

        const task = { text: taskText, date, note };
        tasks.push(task);
        saveTasksToCookies();

        renderTasks();

        taskInput.value = '';
        taskDate.value = '';
        taskNote.value = '';
    });

    function renderTasks() {
        taskList.innerHTML = '';
        calendarTasks.innerHTML = '';
        notesList.innerHTML = '';

        tasks.forEach((task, index) => {

            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');

            taskItem.innerHTML = `
                ${task.text}
                <button class="delete-task" data-index="${index}">Delete</button>
            `;
            taskList.appendChild(taskItem);

            if (task.date) {
                const calendarItem = document.createElement('li');
                calendarItem.textContent = `${task.date}: ${task.text}`;
                calendarTasks.appendChild(calendarItem);
            }


            if (task.note) {
                const noteItem = document.createElement('li');
                noteItem.textContent = `${task.text} - ${task.note}`;
                notesList.appendChild(noteItem);
            }
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
        const daysToExpire = 30; 
        const date = new Date();
        date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000)); 
        const expires = `expires=${date.toUTCString()}`;
        const encodedTasks = encodeURIComponent(JSON.stringify(tasks));
        document.cookie = `tasks=${JSON.stringify(tasks)}; ${expires}; path=/`;
    }

    function loadTasksFromCookies() {
        const match = document.cookie.match(/tasks=([^;]+)/);
        if (match) {
            try {
                // Decode the cookie value and parse the JSON
                return JSON.parse(decodeURIComponent(match[1]));
            } catch (e) {
                console.error("Error parsing tasks from cookies:", e);
                return [];
            }
        } else {
            return [];
        }
    }
    

    renderTasks();
});

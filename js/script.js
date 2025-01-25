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

    // Навигация по секциям
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.getAttribute('data-section');

            sections.forEach(section => section.classList.remove('active'));
            const activeSection = document.getElementById(sectionId);
            activeSection.classList.add('active');
        });
    });

    // Добавление задачи
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

    // Отображение задач
    function renderTasks() {
        taskList.innerHTML = '';
        calendarTasks.innerHTML = '';
        notesList.innerHTML = '';

        tasks.forEach((task, index) => {
            // Отображение задачи в списке задач
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');

            taskItem.innerHTML = `
                ${task.text}
                <button class="delete-task" data-index="${index}">Delete</button>
            `;
            taskList.appendChild(taskItem);

            // Отображение задачи в календаре
            if (task.date) {
                const calendarItem = document.createElement('li');
                calendarItem.textContent = `${task.date}: ${task.text}`;
                calendarTasks.appendChild(calendarItem);
            }

            // Отображение заметки (если есть)
            if (task.note) {
                const noteItem = document.createElement('li');
                noteItem.textContent = `${task.text} - ${task.note}`;
                notesList.appendChild(noteItem);
            }
        });

        // Привязка событий удаления
        attachDeleteHandlers();
    }

    // Удаление задач
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

    // Работа с cookies
    function saveTasksToCookies() {
        document.cookie = `tasks=${JSON.stringify(tasks)}; path=/`;
    }

    function loadTasksFromCookies() {
        const match = document.cookie.match(/tasks=([^;]+)/);
        return match ? JSON.parse(match[1]) : [];
    }

    renderTasks();
});

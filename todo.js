document.addEventListener('DOMContentLoaded', loadTasks); // Load tasks when the page is loaded
document.getElementById('addTaskButton').addEventListener('click', addTask);
document.getElementById('showAllButton').addEventListener('click', showAllTasks);
document.getElementById('showIncompleteButton').addEventListener('click', showIncompleteTasks);
document.getElementById('showCompleteButton').addEventListener('click', showCompleteTasks);

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskDate = document.getElementById('taskDate').value;
    const taskTime = document.getElementById('taskTime').value;
    const taskText = taskInput.value;

    if (taskText === '' || taskDate === '' || taskTime === '') {
        alert('Please enter a task, select a date, and a time.');
        return;
    }

    const taskItem = {
        date: taskDate,
        time: taskTime,
        text: taskText,
        status: 'incomplete'
    };

    saveTask(taskItem);
    renderTask(taskItem);
    taskInput.value = '';
    document.getElementById('taskTime').value = '';
}

function saveTask(taskItem) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(taskItem);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => renderTask(task));
}

function renderTask(taskItem) {
    const taskList = document.getElementById('taskList');
    const taskElement = document.createElement('li');
    taskElement.className = 'p-2 bg-gray-200 rounded-lg flex justify-between items-center sm:text-lg';
    taskElement.dataset.status = taskItem.status;
    taskElement.dataset.date = taskItem.date;
    taskElement.dataset.time = taskItem.time;

    const taskContent = document.createElement('span');
    taskContent.textContent = `${taskItem.date} ${taskItem.time} - ${taskItem.text}`;

    const completeButton = document.createElement('button');
    completeButton.textContent = taskItem.status === 'complete' ? 'Undo' : 'Complete';
    completeButton.className = 'ml-2 px-2 py-1 bg-green-400 text-white rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-blue-500';
    completeButton.addEventListener('click', () => toggleTaskStatus(taskElement, taskItem));

    if (taskItem.status === 'complete') {
        taskElement.classList.replace('bg-gray-200', 'bg-green-200');
    }

    taskElement.appendChild(taskContent);
    taskElement.appendChild(completeButton);
    taskList.appendChild(taskElement);
}

function toggleTaskStatus(taskElement, taskItem) {
    taskItem.status = taskItem.status === 'incomplete' ? 'complete' : 'incomplete';

    if (taskItem.status === 'complete') {
        taskElement.classList.replace('bg-gray-200', 'bg-green-200');
        taskElement.querySelector('button').textContent = 'Undo';
    } else {
        taskElement.classList.replace('bg-green-200', 'bg-gray-200');
        taskElement.querySelector('button').textContent = 'Complete';
    }

    updateTaskInStorage(taskItem);
}

function updateTaskInStorage(updatedTask) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => 
        task.date === updatedTask.date && task.time === updatedTask.time && task.text === updatedTask.text
            ? updatedTask
            : task
    );
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function showAllTasks() {
    const tasks = document.querySelectorAll('#taskList li');
    tasks.forEach(task => task.style.display = 'flex');
}

function showIncompleteTasks() {
    const tasks = document.querySelectorAll('#taskList li');
    tasks.forEach(task => {
        task.style.display = task.dataset.status === 'incomplete' ? 'flex' : 'none';
    });
}

function showCompleteTasks() {
    const tasks = document.querySelectorAll('#taskList li');
    tasks.forEach(task => {
        task.style.display = task.dataset.status === 'complete' ? 'flex' : 'none';
    });
}

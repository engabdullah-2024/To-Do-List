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
    checkAllTasksCompleted();
}

function saveTask(taskItem) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(taskItem);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => renderTask(task));
    checkAllTasksCompleted();
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

    const statusIcon = document.createElement('span');
    statusIcon.className = 'ml-2';
    statusIcon.innerHTML = taskItem.status === 'complete' ? '✅' : '❌';

    const completeButton = document.createElement('button');
    completeButton.textContent = taskItem.status === 'complete' ? 'Undo' : 'Complete';
    completeButton.className = 'ml-2 px-2 py-1 bg-green-400 text-white rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-blue-500';
    completeButton.addEventListener('click', () => toggleTaskStatus(taskElement, taskItem, statusIcon));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'ml-2 px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500';
    deleteButton.addEventListener('click', () => deleteTask(taskElement, taskItem));

    taskElement.appendChild(taskContent);
    taskElement.appendChild(statusIcon);
    taskElement.appendChild(completeButton);
    taskElement.appendChild(deleteButton);
    taskList.appendChild(taskElement);
}

function toggleTaskStatus(taskElement, taskItem, statusIcon) {
    taskItem.status = taskItem.status === 'incomplete' ? 'complete' : 'incomplete';

    if (taskItem.status === 'complete') {
        taskElement.classList.replace('bg-gray-200', 'bg-green-200');
        statusIcon.innerHTML = '✅';
        taskElement.querySelector('button').textContent = 'Undo';
    } else {
        taskElement.classList.replace('bg-green-200', 'bg-gray-200');
        statusIcon.innerHTML = '❌';
        taskElement.querySelector('button').textContent = 'Complete';
    }

    updateTaskInStorage(taskItem);
    checkAllTasksCompleted();
}

function deleteTask(taskElement, taskItem) {
    taskElement.remove();
    removeTaskFromStorage(taskItem);
    alert('Deleted Task');
    checkAllTasksCompleted();
}

function removeTaskFromStorage(taskItem) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => 
        task.date !== taskItem.date || task.time !== taskItem.time || task.text !== taskItem.text
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

function checkAllTasksCompleted() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const allCompleted = tasks.length > 0 && tasks.every(task => task.status === 'complete');

    if (allCompleted) {
        alert('Successful All! All tasks are completed.');
    }
}

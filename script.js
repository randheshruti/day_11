const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const message = document.getElementById("message");

// ⚠️ Replace with the actual SkillPilot API base URL
const API_URL = "YOUR_API_URL/tasks";

// GET: Load all tasks
async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to load tasks");

        const tasks = await response.json();
        taskList.innerHTML = "";

        tasks.forEach(task => {
            const li = document.createElement("li");
            li.textContent = task.title || task.name;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.onclick = () => deleteTask(task.id);

            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });

        if (tasks.length === 0) {
            taskList.textContent = "No tasks available.";
        }

        message.textContent = "";
    } catch (error) {
        console.error(error);
        message.textContent = "Unable to load tasks. Check API connection.";
    }
}

// POST: Add a new task
async function addTask() {
    const title = taskInput.value.trim();
    if (!title) {
        message.textContent = "Please enter a task!";
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: title })
        });

        if (!response.ok) throw new Error("Failed to add task");

        taskInput.value = "";
        message.textContent = "";
        await loadTasks();
    } catch (error) {
        console.error(error);
        message.textContent = "Unable to add task.";
    }
}

// DELETE: Remove a task
async function deleteTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Failed to delete task");

        await loadTasks();
    } catch (error) {
        console.error(error);
        message.textContent = "Unable to delete task.";
    }
}

addTaskBtn.addEventListener("click", addTask);
loadTasks();
const API_URL = "http://localhost:5000/api/tasks";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        const tasks = await response.json();

        taskList.innerHTML = "";

        tasks.forEach(task => {
            displayTask(task);
        });
    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}

function displayTask(task) {
    const li = document.createElement("li");

    const taskContent = document.createElement("div");
    taskContent.className = "task-content";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    const title = document.createElement("span");
    title.textContent = task.title;

    if (task.completed) {
        title.classList.add("completed");
    }

    checkbox.addEventListener("change", async () => {
        await toggleTask(task.id);
    });

    taskContent.appendChild(checkbox);
    taskContent.appendChild(title);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-button";

    deleteButton.addEventListener("click", async () => {
        await deleteTask(task.id);
    });

    li.appendChild(taskContent);
    li.appendChild(deleteButton);

    taskList.appendChild(li);
}

taskForm.addEventListener("submit", async event => {
    event.preventDefault();

    const title = taskInput.value.trim();

    if (!title) {
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title })
        });

        if (!response.ok) {
            throw new Error("Failed to create task");
        }

        taskInput.value = "";

        await loadTasks();
    } catch (error) {
        console.error("Error creating task:", error);
    }
});

async function toggleTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT"
        });

        if (!response.ok) {
            throw new Error("Failed to update task");
        }

        await loadTasks();
    } catch (error) {
        console.error("Error updating task:", error);
    }
}

async function deleteTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete task");
        }

        await loadTasks();
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}

loadTasks();
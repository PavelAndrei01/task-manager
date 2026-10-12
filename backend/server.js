const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create or open the database file
const dbPath = path.join(__dirname, "tasks.db");
const db = new Database(dbPath);

// Create the tasks table if it does not exist
db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0
    )
`);

// Insert example tasks only when the table is empty
const taskCount = db.prepare(
    "SELECT COUNT(*) AS count FROM tasks"
).get();

if (taskCount.count === 0) {
    const insertTask = db.prepare(
        "INSERT INTO tasks (title, completed) VALUES (?, ?)"
    );

    insertTask.run("Learn JavaScript", 0);
    insertTask.run("Build a full-stack project", 1);
}

// Get all tasks
app.get("/api/tasks", (req, res) => {
    const tasks = db.prepare(
        "SELECT id, title, completed FROM tasks ORDER BY id"
    ).all();

    res.json(
        tasks.map(task => ({
            ...task,
            completed: Boolean(task.completed)
        }))
    );
});

// Add a new task
app.post("/api/tasks", (req, res) => {
    const { title } = req.body;

    if (typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({
            message: "Task title is required"
        });
    }

    const result = db.prepare(
        "INSERT INTO tasks (title, completed) VALUES (?, 0)"
    ).run(title.trim());

    const newTask = db.prepare(
        "SELECT id, title, completed FROM tasks WHERE id = ?"
    ).get(result.lastInsertRowid);

    res.status(201).json({
        ...newTask,
        completed: Boolean(newTask.completed)
    });
});

// Toggle a task's completed status
app.put("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid task ID"
        });
    }

    const task = db.prepare(
        "SELECT id, completed FROM tasks WHERE id = ?"
    ).get(id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    const newCompleted = task.completed ? 0 : 1;

    db.prepare(
        "UPDATE tasks SET completed = ? WHERE id = ?"
    ).run(newCompleted, id);

    const updatedTask = db.prepare(
        "SELECT id, title, completed FROM tasks WHERE id = ?"
    ).get(id);

    res.json({
        ...updatedTask,
        completed: Boolean(updatedTask.completed)
    });
});

// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid task ID"
        });
    }

    const result = db.prepare(
        "DELETE FROM tasks WHERE id = ?"
    ).run(id);

    if (result.changes === 0) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    res.json({
        message: "Task deleted successfully"
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Close the database when the process exits
process.on("SIGINT", () => {
    db.close();
    process.exit(0);
});

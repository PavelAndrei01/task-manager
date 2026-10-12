
# Task Manager

A simple full-stack task management application built with JavaScript.

## Features

- View all tasks
- Add new tasks
- Mark tasks as completed
- Delete tasks
- Store tasks persistently using SQLite
- REST API built with Node.js and Express

## Technologies

- HTML
- CSS
- JavaScript
- Node.js
- Express
- SQLite
- better-sqlite3

## Project Structure

```text
task-manager/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .gitignore
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone this repository.
2. Open a terminal in the backend directory.
3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the backend server:

   ```bash
   node server.js
   ```

5. Open `frontend/index.html` in your browser.

The backend runs at `http://localhost:5000`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Toggle task completion |
| DELETE | `/api/tasks/:id` | Delete a task |

## Database

The application uses SQLite. The database file is created automatically when the backend starts.

## Future Improvements

- Edit existing tasks
- Add task filters
- Improve error messages
- Add automated tests

## Author Pavel Andrei

Created as a full-stack development portfolio project.

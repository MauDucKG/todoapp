import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// React component for the Task Card
const TaskCard = ({ category, dueDate, estimate, importance }) => {
    const importanceColor = {
        High: 'red',
        Medium: 'orange',
        Low: 'green'
    };

    return (
        <div className="task-card">
            <div className="importance-indicator" style={{ backgroundColor: importanceColor[importance] }}></div>
            <div className="task-details">
                <div className="category">{category}</div>
                <div className="due-date">{dueDate}</div>
                <div className="estimate">{estimate}</div>
            </div>
        </div>
    );
};

// React component for the Column
const TaskColumn = ({ title, tasks }) => {
    return (
        <div className="task-column">
            <h2>{title}</h2>
            {tasks.map(task => (
                <TaskCard key={task.id} {...task} />
            ))}
        </div>
    );
};

// Main React component for the App
const App = () => {
    // Sample data for tasks
    const tasks = {
        todo: [{ id: 1, category: 'Design', dueDate: '2023-04-30', estimate: '2h', importance: 'High' }],
        doing: [{ id: 2, category: 'Development', dueDate: '2023-05-05', estimate: '4h', importance: 'Medium' }],
        done: [{ id: 3, category: 'Testing', dueDate: '2023-05-10', estimate: '1h', importance: 'Low' }]
    };

    return (
        <div className="task-management-app">
            <nav className="navbar">Task Management</nav>
            <div className="task-columns">
                <TaskColumn title="To Do" tasks={tasks.todo} />
                <TaskColumn title="Doing" tasks={tasks.doing} />
                <TaskColumn title="Done" tasks={tasks.done} />
            </div>
        </div>
    );
};


export default App

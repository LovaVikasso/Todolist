import React, {useState} from 'react';
import './App.css';
import {Todolist} from "./Todolist";

function App() {
    type filterType = "all" | "completed" | "active"
    let [tasks, setTasks] = useState([
        {id: 1, title: "HTML", isDone: true},
        {id: 2, title: "CSS", isDone: true},
        {id: 3, title: "React", isDone: false}
    ])

    let [filter, setFilter] = useState<filterType>("all")


    const removeTask = (id: number) => {
        setTasks(tasks.filter((t) => t.id !== id))
    }
    return (
        <div className="App">
            <Todolist title={"What to learn"} tasks={tasks} removeTask={removeTask}/>
        </div>
    );
}

export default App;

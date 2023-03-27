import React, {useState} from 'react';
import './App.css';
import {Todolist} from "./Todolist";
export type TaskType = {
    id: number
    title: string
    isDone: boolean
}
export type FilterValueType = "all" | "completed" | "active"

function App() {

    let [tasks, setTasks] = useState<TaskType[]>([
        {id: 1, title: "HTML", isDone: true},
        {id: 2, title: "CSS", isDone: true},
        {id: 3, title: "React", isDone: false}
    ])

    let [filter, setFilter] = useState<FilterValueType>("all")

    let tasksForTodolist = tasks
    if (filter=="completed") {
        tasksForTodolist=tasks.filter((t)=>t.isDone)
    }
    if (filter=="active") {
        tasksForTodolist=tasks.filter((t)=>!t.isDone)
    }
    const changeFilter = (value:FilterValueType)=>{
        setFilter(value)
    }
    const removeTask = (id: number) => {
        setTasks(tasks.filter((t) => t.id !== id))
    }
    return (
        <div className="App">
            <Todolist title={"What to learn"} tasks={tasksForTodolist} removeTask={removeTask} changeFilter={changeFilter}/>
        </div>
    );
}

export default App;

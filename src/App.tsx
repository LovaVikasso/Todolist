import React, {useState} from 'react';
import './App.css';
import {Todolist} from "./Todolist";
import {v1} from "uuid";

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}
export type FilterValueType = "all" | "completed" | "active"

function App() {

    let [tasks, setTasks] = useState<TaskType[]>([
        {id: v1(), title: "HTML", isDone: true},
        {id: v1(), title: "CSS", isDone: true},
        {id: v1(), title: "React", isDone: false}
    ])

    let [filter, setFilter] = useState<FilterValueType>("all")

    let tasksForTodolist = tasks
    if (filter == "completed") {
        tasksForTodolist = tasks.filter((t) => t.isDone)
    }
    if (filter == "active") {
        tasksForTodolist = tasks.filter((t) => !t.isDone)
    }
    const changeFilter = (value: FilterValueType) => {
        setFilter(value)
    }
    const removeTask = (id: string) => {
        setTasks(tasks.filter((t) => t.id !== id))
    }
    const addTask = (title:string) => {
        let newTask = {id:v1(), title:title, isDone:false}
        setTasks([newTask,...tasks])
    }
    return (
        <div className="App">
            <Todolist title={"What to learn"} tasks={tasksForTodolist}
                      addTask={addTask}
                      removeTask={removeTask}
                      changeFilter={changeFilter}/>
        </div>
    );
}

export default App;

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
export type TodolistType = {
    id: string
    title: string
    filter: FilterValueType
}

function App() {
    let todolistId1 = v1()
    let todolistId2 = v1()
    let [todolists, setTodolists] = useState<TodolistType[]>([
        {id: todolistId1, title: "What to learn", filter: 'all'},
        {id: todolistId2, title: "What to buy", filter: 'all'},
    ])
    let [tasks, setTasks] = useState({
        [todolistId1]: [
            {id: v1(), title: "HTML", isDone: true},
            {id: v1(), title: "CSS", isDone: true},
            {id: v1(), title: "React", isDone: false}
        ], [todolistId2]: [
            {id: v1(), title: "iPad", isDone: true},
            {id: v1(), title: "Canon", isDone: true},
            {id: v1(), title: "iPhone", isDone: false}
        ]
    })


    const changeFilter = (todolistId: string, value: FilterValueType) => {
        let todolist = todolists.find((tl) => tl.id == todolistId)
        if (todolist) {
            todolist.filter = value
            setTodolists([...todolists])
        }

    }
    const removeTask = (todolistId: string, taskId: string) => {
        let todolistTasks = tasks[todolistId]
        tasks[todolistId] = todolistTasks.filter((t) => t.id !== taskId)
        setTasks({...tasks})
    }
    const addTask = (todolistId: string, title: string) => {
        let newTask = {id: v1(), title: title, isDone: false}
        let todolistTasks = tasks[todolistId]
        tasks[todolistId] = [newTask, ...todolistTasks]
        setTasks({...tasks})
    }
    const changeStatus = (todolistId: string, TaskId: string, isDone: boolean) => {
        let todolistTasks = tasks[todolistId]
        let task = todolistTasks.find((t) => t.id == TaskId);
        if (task) {
            task.isDone = isDone
        }

        setTasks({...tasks})
    }
    const removeTodolist = (todolistId:string) =>{
        todolists = todolists.filter((tl)=>tl.id!==todolistId)
        delete tasks[todolistId]
        setTodolists([...todolists])
        }
    return (
        <div className="App">
            {todolists.map((tl) => {
                let tasksForTodolist = tasks[tl.id]
                if (tl.filter == "completed") {
                    tasksForTodolist = tasksForTodolist.filter((t) => t.isDone)
                }
                if (tl.filter == "active") {
                    tasksForTodolist = tasksForTodolist.filter((t) => !t.isDone)
                }
                return <Todolist key={tl.id} id={tl.id} title={tl.title} tasks={tasksForTodolist}
                                 removeTodolist={removeTodolist}
                                 addTask={addTask}
                                 removeTask={removeTask}
                                 changeStatus={changeStatus}
                                 changeFilter={changeFilter}
                                 filter={tl.filter}/>
            })}

        </div>
    );
}

export default App;

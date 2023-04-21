import React, {useState} from 'react';
import './App.css';
import {Todolist} from "./Todolist";
import {v1} from "uuid";
import {AddItemForm} from "./Components/AddItemForm";
import {AppBar, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import Button from "@material-ui/core/Button";

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
export type TasksStateType = {
    [key: string]: Array<TaskType>
}

function App() {
    let todolistId1 = v1()
    let todolistId2 = v1()
    let [todolists, setTodolists] = useState<TodolistType[]>([
        {id: todolistId1, title: "What to learn", filter: 'all'},
        {id: todolistId2, title: "What to buy", filter: 'all'},
    ])
    let [tasks, setTasks] = useState<TasksStateType>({
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
        let todolist = todolists.find((tl) => tl.id === todolistId)
        if (todolist) {
            todolist.filter = value
            setTodolists([...todolists])
        }
    }
    const changeTodolistTitle = (todolistId: string, newTitle: string) => {
        let todolist = todolists.find((tl) => tl.id === todolistId)
        if (todolist) {
            todolist.title = newTitle
            setTodolists([...todolists])
        }
    }
    const addTodolist = (title: string) => {
        let newId = v1()
        let newTodolist: TodolistType = {id: newId, title: title, filter: 'all'}
        setTodolists([newTodolist, ...todolists])
        setTasks({...tasks, [newId]: []})
    }
    const removeTodolist = (todolistId: string) => {
        todolists = todolists.filter((tl) => tl.id !== todolistId)
        delete tasks[todolistId]
        setTodolists([...todolists])
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
    const changeTaskTitle = (todolistId: string, taskId: string, newTitle: string) => {
        let todolistTasks = tasks[todolistId] //достаем нужный массив по id тудулиста
        let task = todolistTasks.find((t) => t.id === taskId); //изменим таску если она нашлась
        if (task) {
            task.title = newTitle
        }
        setTasks({...tasks})// изменяем стейт
    }
    const changeStatus = (todolistId: string, taskId: string, isDone: boolean) => {
        let todolistTasks = tasks[todolistId]
        let task = todolistTasks.find((t) => t.id === taskId);
        if (task) {
            task.isDone = isDone
        }
        setTasks({...tasks})
    }

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        Home
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{margin:"20px"}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {todolists.map((tl) => {
                        let tasksForTodolist = tasks[tl.id]
                        if (tl.filter === "completed") {
                            tasksForTodolist = tasksForTodolist.filter((t) => t.isDone)
                        }
                        if (tl.filter === "active") {
                            tasksForTodolist = tasksForTodolist.filter((t) => !t.isDone)
                        }
                        return <Grid item>
                            <Paper elevation={3} style={{padding:"20px"}}>
                                <Todolist key={tl.id} id={tl.id} title={tl.title} tasks={tasksForTodolist}
                                          removeTodolist={removeTodolist}
                                          changeTodolistTitle={changeTodolistTitle}
                                          addTask={addTask}
                                          changeTaskTitle={changeTaskTitle}
                                          removeTask={removeTask}
                                          changeStatus={changeStatus}
                                          changeFilter={changeFilter}
                                          filter={tl.filter}/>
                            </Paper>
                        </Grid>
                    })}
                </Grid>
            </Container>

        </div>
    );
}

export default App;

import React from 'react';
import './App.css';
import {Todolist} from "./Todolist";
import {v1} from "uuid";
import {AddItemForm} from "./Components/AddItemForm";
import {AppBar, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import {
    addTodolistAC,
    changeFilterAC,
    changeTitleAC,
    removeTodolistAC
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootType} from "./state/store";

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

export function AppWithRedux() {
    const dispatch = useDispatch()
    const todolists = useSelector<AppRootType, Array<TodolistType>>(state => state.todolists)
    const tasks = useSelector<AppRootType, TasksStateType>(state => state.tasks)

    const changeFilter = (todolistId: string, value: FilterValueType) => {
        dispatch(changeFilterAC(todolistId, value))
    }
    const changeTodolistTitle = (todolistId: string, newTitle: string) => {
        dispatch(changeTitleAC(todolistId, newTitle))
    }
    const addTodolist = (title: string) => {
        const action = addTodolistAC(v1(), title) //здесь выносим в переменную, потому что будет 1 id
        dispatch(action)
    }
    const removeTodolist = (todolistId: string) => {
        dispatch(removeTodolistAC(todolistId))

    }
    const removeTask = (todolistId: string, taskId: string) => {
        dispatch(removeTaskAC(todolistId, taskId))
    }
    const addTask = (todolistId: string, title: string) => {
        dispatch(addTaskAC(todolistId, title))
    }
    const changeTaskTitle = (todolistId: string, taskId: string, newTitle: string) => {
        dispatch(changeTaskTitleAC(todolistId, taskId, newTitle))
    }
    const changeStatus = (todolistId: string, taskId: string, isDone: boolean) => {
        dispatch(changeTaskStatusAC(todolistId, taskId, isDone))
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
                <Grid container style={{margin: "20px"}}>
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
                            <Paper elevation={3} style={{padding: "20px"}}>
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



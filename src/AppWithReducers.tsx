import React, {useReducer} from 'react';
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
    removeTodolistAC,
    todolistsReducer
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./state/tasks-reducer";
import {FilterValueType} from "./AppWithRedux";

export function AppWithReducers() {
    let todolistId1 = v1()
    let todolistId2 = v1()
    let [todolists, dispatchTodolists] = useReducer(todolistsReducer, [
        {id: todolistId1, title: "What to learn", filter: 'all'},
        {id: todolistId2, title: "What to buy", filter: 'all'},
    ])
    let [tasks, dispatchTasks] = useReducer(tasksReducer, {
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
        dispatchTodolists(changeFilterAC(todolistId, value))
    }
    const changeTodolistTitle = (todolistId: string, newTitle: string) => {
        // const action = changeTitleAC(todolistId, newTitle)
        // dispatchTodolists(action) старое
        dispatchTodolists(changeTitleAC(todolistId, newTitle))
    }
    const addTodolist = (title: string) => {
        const action = addTodolistAC(v1(), title) //здесь выносим в переменную, потому что будет 1 id
        dispatchTodolists(action)
        dispatchTasks(action)
    }
    const removeTodolist = (todolistId: string) => {
        dispatchTasks(removeTodolistAC(todolistId))
        dispatchTodolists(removeTodolistAC(todolistId))
    }
    const removeTask = (todolistId: string, taskId: string) => {
        dispatchTasks(removeTaskAC(todolistId, taskId))
    }
    const addTask = (todolistId: string, title: string) => {
        dispatchTasks(addTaskAC(todolistId, title))
    }
    const changeTaskTitle = (todolistId: string, taskId: string, newTitle: string) => {
        dispatchTasks(changeTaskTitleAC(todolistId, taskId, newTitle))
    }
    const changeStatus = (todolistId: string, taskId: string, isDone: boolean) => {
        dispatchTasks(changeTaskStatusAC(todolistId, taskId, isDone))
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



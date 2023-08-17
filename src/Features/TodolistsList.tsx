import {
    FilterValuesType,
    todolistsActions, todolistsThunks,
} from "state/todolists-reducer";
import React, {useCallback, useEffect} from "react";
import {Grid, Paper} from "@material-ui/core";
import {Todolist} from "./Todolist";
import {useAppDispatch} from "state/store";
import {AddItemForm} from "Components/AddItemForm/AddItemForm";
import {tasksThunks, UpdateDomainTaskModelType} from "state/tasks-reducer";
import {Navigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectTodolists} from "state/todolists.selector";
import {selectIsLoggedIn} from "state/auth.selector";
import {selectTasks} from "state/tasks.selector";

export const TodolistsList = () => {
    const dispatch = useAppDispatch();
    const todolists =  useSelector(selectTodolists);
    const tasks = useSelector(selectTasks);
    const isLoggedIn = useSelector(selectIsLoggedIn);

    useEffect(() => {
        if (!isLoggedIn) {
            return;
        }
        dispatch(todolistsThunks.fetchTodolists());
    }, [dispatch]);
    const addTodolist = useCallback(
        (title: string) => {
            const action = todolistsThunks.addTodolist(title);
            dispatch(action);
        },
        [dispatch],
    );
    const removeTodolist = useCallback(
        (todolistId: string) => {
            dispatch(todolistsThunks.removeTodolist(todolistId));
        },
        [dispatch],
    );
    const changeTodolistTitle = useCallback(
        (id: string, title: string) => {
            dispatch(todolistsThunks.changeTodolistTitle({id, title}));
        },
        [dispatch],
    );
    const changeFilter = useCallback(
        (todolistId: string, filter: FilterValuesType) => {
            dispatch(todolistsActions.changeTodolistFilter({id: todolistId, filter}));
        },
        [dispatch],
    );
    const addTask = useCallback(
        (todolistId: string, title: string) => {
            dispatch(tasksThunks.addTask({todolistId, title}));
        },
        [dispatch],
    );
    const updateTask = useCallback(
        (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) => {
            dispatch(tasksThunks.updateTask({todolistId, taskId, domainModel}));
        },
        [dispatch],
    );
    const removeTask = useCallback(
        (todolistId: string, taskId: string) => {
            dispatch(tasksThunks.removeTask({todolistId, taskId}));
        },
        [dispatch],
    );

    if (!isLoggedIn) {
        return <Navigate to={"/login"}/>;
    }
    return (
        <>
            <Grid container style={{padding: "20px"}}>
                <AddItemForm addItem={addTodolist}/>

            </Grid>
            <Grid container spacing={3}>
                {todolists.map((tl) => {
                    return (
                        <Grid item key={tl.id}>
                            <Paper elevation={3} style={{padding: "20px"}}>
                                <Todolist
                                    key={tl.id}
                                    todolist={tl}
                                    tasks={tasks[tl.id]}
                                    removeTodolist={removeTodolist}
                                    changeTodolistTitle={changeTodolistTitle}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    updateTask={updateTask}
                                    removeTask={removeTask}
                                />
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </>
    );
};

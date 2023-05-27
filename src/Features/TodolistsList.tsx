import {
    addTodolistTC, changeFilterAC,
    changeTodolistTitleTC, fetchTodolistsTC,
    FilterValueType,
    removeTodolistTC,
} from "../state/todolists-reducer";
import React, { useCallback, useEffect} from "react";
import {Grid, Paper} from "@material-ui/core";
import {Todolist} from "./Todolist";
import {useAppDispatch, useAppSelector} from "../state/store";
import {AddItemForm} from "../Components/AddItemForm/AddItemForm";
import {addTaskTC, removeTaskTC, UpdateDomainTaskModelType, updateTaskTC} from "../state/tasks-reducer";

export const TodolistsList = () => {
    const dispatch = useAppDispatch()
    const todolists = useAppSelector(state => state.todolists)
    const tasks = useAppSelector(state => state.tasks)

    useEffect(() => {
        dispatch(fetchTodolistsTC())
    },[dispatch] )
    const addTodolist = useCallback((title: string) => {
        const action = addTodolistTC(title)
        dispatch(action)
    }, [dispatch])
    const removeTodolist = useCallback((todolistId: string) => {
        dispatch(removeTodolistTC(todolistId))

    }, [dispatch])
    const changeTodolistTitle = useCallback((todolistId: string, newTitle: string) => {
        dispatch(changeTodolistTitleTC(todolistId, newTitle))
    }, [dispatch])
    const changeFilter = useCallback((todolistId: string, value: FilterValueType) => {
        dispatch(changeFilterAC(todolistId, value))
    }, [dispatch])
    const addTask = useCallback((todolistId:string,title: string) => {
        dispatch(addTaskTC(todolistId, title))
    },[dispatch])
    const updateTask = useCallback((todolistId:string,taskId:string, model:UpdateDomainTaskModelType) => {
        dispatch(updateTaskTC(todolistId, taskId, model))
    },[dispatch])
    const removeTask = useCallback((todolistId:string, taskId:string) => {
        dispatch(removeTaskTC(todolistId, taskId))},[dispatch])

    return <>
            <Grid container style={{padding: "20px"}}>
                <AddItemForm addItem={addTodolist}/>
            </Grid>
            <Grid container spacing={3}>
                {todolists.map((tl) => {

                    return <Grid item key={tl.id}>
                        <Paper elevation={3} style={{padding: "20px"}}>
                            <Todolist key={tl.id} id={tl.id} title={tl.title}
                                      tasks={tasks[tl.id]}
                                      removeTodolist={removeTodolist}
                                      changeTodolistTitle={changeTodolistTitle}
                                      changeFilter={changeFilter}
                                      addTask={addTask}
                                      updateTask={updateTask}
                                      removeTask={removeTask}
                                      filter={tl.filter}/>
                        </Paper>
                    </Grid>
                })
                }
            </Grid>
    </>
}


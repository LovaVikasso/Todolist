import React, {useCallback} from 'react';
import {AddItemForm} from "./Components/AddItemForm";
import {EditableSpan} from "./Components/EditableSpan";
import {IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import {FilterValueType, TaskType} from "./App";
import {addTaskAC} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootType} from "./state/store";
import {Task} from "./Task";


type PropsType = {
    id: string
    title: string
    removeTodolist: (todolistId: string) => void
    changeTodolistTitle: (todolistId: string, title: string) => void
    changeFilter: (todolistId: string, value: FilterValueType) => void
    filter: FilterValueType

}
export const Todolist = React.memo((props: PropsType) => {
    console.log('Todolist rendered')
    let todolistId = props.id
    const dispatch = useDispatch()
    const tasks = useSelector<AppRootType, Array<TaskType>>(state => state.tasks[todolistId])

    const onAllClickHandler = useCallback(() => {
        props.changeFilter(todolistId, "all")
    },[props.changeFilter,props.id])
    const onActiveClickHandler = useCallback(() => {
        props.changeFilter(todolistId, "active")
    },[props.changeFilter,props.id])
    const onCompletedClickHandler = useCallback(() => {
        props.changeFilter(todolistId, "completed")
    },[props.changeFilter,props.id])

    const addTask = useCallback((title: string) => {
        dispatch(addTaskAC(todolistId, title))
    },[dispatch])
    const onChangeTodolistTitleHandler = useCallback((newTitle: string) => {
        props.changeTodolistTitle(todolistId, newTitle)
    },[props.changeTodolistTitle, todolistId])
    const removeTodolist = () => {
        props.removeTodolist(todolistId)
    }
    let tasksForTodolist = tasks
    if (props.filter === "completed") {
        tasksForTodolist = tasksForTodolist.filter((t) => t.isDone)
    }
    if (props.filter === "active") {
        tasksForTodolist = tasksForTodolist.filter((t) => !t.isDone)
    }
// берем айди этого тудулиста, он пришлел в пропсах,
// и используем второй аргумент (название таски) из addItemForm,
// а там используем уже функцию с 1 параметром
    return (
        <div>
            <h3>
                <EditableSpan title={props.title} onChange={onChangeTodolistTitleHandler}/>
                <IconButton onClick={removeTodolist} aria-label="delete">
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm
                addItem={addTask}/>
            <div>
                {
                    tasksForTodolist.map(t => <Task todolistId={todolistId} task={t} key={t.id}/>)}
            </div>
            <div>
                <Button variant={props.filter === "all" ? "contained" : "text"}
                        onClick={onAllClickHandler}>All
                </Button>
                <Button variant={props.filter === "active" ? "contained" : "text"}
                        color={'primary'} onClick={onActiveClickHandler}>Active
                </Button>
                <Button variant={props.filter === "completed" ? "contained" : "text"}
                        color={'secondary'} onClick={onCompletedClickHandler}>Completed
                </Button>
            </div>
        </div>
    );
});


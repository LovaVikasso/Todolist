import React, {ChangeEvent} from 'react';
import {AddItemForm} from "./Components/AddItemForm";
import {EditableSpan} from "./Components/EditableSpan";
import {Checkbox, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import {FilterValueType, TaskType} from "./AppWithRedux";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootType} from "./state/store";


type PropsType = {
    id: string
    title: string
    removeTodolist: (todolistId: string) => void
    changeTodolistTitle: (todolistId: string, title: string) => void
    changeFilter: (todolistId: string, value: FilterValueType) => void
    filter: FilterValueType

}
export const Todolist = (props: PropsType) => {
    let todolistId = props.id
    const dispatch = useDispatch()
    const tasks = useSelector<AppRootType, Array<TaskType>>(state => state.tasks[todolistId])


    const onAllClickHandler = () => {
        props.changeFilter(todolistId, "all")
    }
    const onActiveClickHandler = () => {
        props.changeFilter(todolistId, "active")
    }
    const onCompletedClickHandler = () => {
        props.changeFilter(todolistId, "completed")
    }

    const addTask = (title: string) => {
        dispatch(addTaskAC(todolistId, title))
    }
    const onChangeTodolistTitleHandler = (newTitle: string) => {
        props.changeTodolistTitle(todolistId, newTitle)
    }
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
                    tasksForTodolist.map(t => {
                        const checkboxHandler = (e: ChangeEvent<HTMLInputElement>) => {
                            dispatch(changeTaskStatusAC(todolistId, t.id, e.currentTarget.checked))
                        }
                        const onClickHandler = () => {
                            dispatch(removeTaskAC(todolistId, t.id))
                        }
                        const onChangeTitleHandler = (newTitle: string) => {
                            dispatch(changeTaskTitleAC(todolistId, t.id, newTitle))
                        }

                        return <div className={t.isDone ? "is-done" : "task"} key={t.id}><Checkbox
                            checked={t.isDone}
                            onChange={checkboxHandler}/>
                            <EditableSpan title={t.title} onChange={onChangeTitleHandler}/>
                            <IconButton onClick={onClickHandler} aria-label="delete">
                                <Delete/>
                            </IconButton>
                        </div>
                    })}
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
};

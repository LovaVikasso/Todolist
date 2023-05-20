import React, {ChangeEvent, useCallback} from "react";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "./Components/EditableSpan";
import {Delete} from "@material-ui/icons";
import {useDispatch} from "react-redux";
import {TaskStatuses, TaskType} from "./api/todolists-api";


type TaskPropsType = {
    todolistId: string
    task: TaskType
}
export const Task = React.memo((props: TaskPropsType) => {
    const dispatch = useDispatch()
    const checkboxHandler = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(changeTaskStatusAC(props.todolistId, props.task.id, e.currentTarget.checked ? TaskStatuses.Completed :TaskStatuses.New))
    }
    const onClickHandler = () => {
        dispatch(removeTaskAC(props.todolistId, props.task.id))
    }
    const onChangeTitleHandler = useCallback((newTitle: string) => {
        dispatch(changeTaskTitleAC(props.todolistId, props.task.id, newTitle))
    },[dispatch, props.todolistId, props.task.id])

    return <div className={props.task.status===TaskStatuses.Completed ? "is-done" : "task"} key={props.task.id}><Checkbox
        checked={props.task.status===TaskStatuses.Completed}
        onChange={checkboxHandler}/>
        <EditableSpan title={props.task.title} onChange={onChangeTitleHandler}/>
        <IconButton onClick={onClickHandler} aria-label="delete">
            <Delete/>
        </IconButton>
    </div>
})
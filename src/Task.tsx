import React, {ChangeEvent, useCallback} from "react";
import {removeTaskTC, updateTaskTC,} from "./state/tasks-reducer";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "./Components/EditableSpan";
import {Delete} from "@material-ui/icons";
import {TaskStatuses, TaskType} from "./api/todolists-api";
import {useAppDispatch} from "./state/store";


type TaskPropsType = {
    todolistId: string
    task: TaskType
}
export const Task = React.memo((props: TaskPropsType) => {
    const dispatch = useAppDispatch()

    const checkboxHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch(updateTaskTC(props.todolistId, props.task.id, {status: (e.currentTarget.checked ? TaskStatuses.Completed :TaskStatuses.New)}))
    },[])
    const onClickHandler = useCallback(() => {
        dispatch(removeTaskTC(props.todolistId, props.task.id))},[])

    const onChangeTitleHandler = useCallback((newTitle: string) => {
        dispatch(updateTaskTC(props.todolistId, props.task.id, {title:newTitle}))
    },[])

    return <div className={props.task.status===TaskStatuses.Completed ? "is-done" : "task"} key={props.task.id}><Checkbox
        checked={props.task.status===TaskStatuses.Completed}
        onChange={checkboxHandler}/>
        <EditableSpan title={props.task.title} onChange={onChangeTitleHandler}/>
        <IconButton onClick={onClickHandler} aria-label="delete">
            <Delete/>
        </IconButton>
    </div>
})
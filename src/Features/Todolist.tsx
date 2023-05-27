import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from "../Components/AddItemForm/AddItemForm";
import {EditableSpan} from "../Components/EditableSpan";
import {IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import {fetchTasksTC, UpdateDomainTaskModelType} from "../state/tasks-reducer";
import {useAppDispatch} from "../state/store";
import {FilterValueType} from "../state/todolists-reducer";
import {TaskStatuses, TaskType} from "../API/todolists-api";
import {Task} from "./Task";


type PropsType = {
    id: string
    title: string
    tasks: TaskType[]
    removeTodolist: (todolistId: string) => void
    changeTodolistTitle: (todolistId: string, title: string) => void
    changeFilter: (todolistId: string, value: FilterValueType) => void
    filter: FilterValueType
    addTask: (todolistId: string, title: string) => void
    updateTask: (todolistId: string, taskId: string, model: UpdateDomainTaskModelType) => void
    removeTask: (todolistId: string, taskId: string) => void
}
export const Todolist: React.FC<PropsType> = React.memo((props: PropsType) => {
    const {
        id,
        title,
        tasks,
        removeTodolist,
        changeTodolistTitle,
        changeFilter,
        filter,
        addTask,
        updateTask,
        removeTask
    } = props
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(fetchTasksTC(id))
    }, [dispatch, id])

    const onAllClickHandler = useCallback(() => {
        changeFilter(id, "all")
    }, [changeFilter, id])
    const onActiveClickHandler = useCallback(() => {
        changeFilter(id, "active")
    }, [changeFilter, id])
    const onCompletedClickHandler = useCallback(() => {
        changeFilter(id, "completed")
    }, [changeFilter, id])

    const addTaskHandler = useCallback((title: string) => {
        addTask(id, title)
    }, [addTask, id])
    const updateTaskHandler = useCallback((taskId: string, model: UpdateDomainTaskModelType) => {
        updateTask(id, taskId, model)
    }, [updateTask, id])
    const removeTaskHandler = useCallback((taskId: string) => {
        removeTask(id, taskId)
    }, [removeTask, id])
    const onChangeTodolistTitleHandler = useCallback((newTitle: string) => {
        changeTodolistTitle(id, newTitle)
    }, [changeTodolistTitle, id])
    const removeTodolistHandler = () => {
        removeTodolist(id)
    }
    let tasksForTodolist = tasks
    if (filter === "completed") {
        tasksForTodolist = tasksForTodolist.filter((t) => t.status === TaskStatuses.Completed)
    }
    if (filter === "active") {
        tasksForTodolist = tasksForTodolist.filter((t) => t.status === TaskStatuses.New)
    }

    return (
        <div>
            <h3>
                <EditableSpan title={title} onChange={onChangeTodolistTitleHandler}/>
                <IconButton onClick={removeTodolistHandler} aria-label="delete">
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm
                addItem={addTaskHandler}/>
            <div>
                {
                    tasksForTodolist.map(t => <Task
                        task={t}
                        key={t.id}
                        updateTask={updateTaskHandler}
                        removeTask={removeTaskHandler}/>)}
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


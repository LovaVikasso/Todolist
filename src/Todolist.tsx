import React, {ChangeEvent} from 'react';
import {FilterValueType, TaskType} from "./App";
import {AddItemForm} from "./Components/AddItemForm";
import {EditableSpan} from "./Components/EditableSpan";
import {Checkbox, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import Button from "@material-ui/core/Button";


type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTodolist: (todolistId: string) => void
    changeTodolistTitle: (todolistId: string, title: string) => void
    addTask: (todolistId: string, title: string) => void
    changeTaskTitle: (todolistId: string, taskId: string, title: string) => void
    removeTask: (todolistId: string, id: string) => void
    changeStatus: (todolistId: string, id: string, isDone: boolean) => void
    changeFilter: (todolistId: string, value: FilterValueType) => void
    filter: FilterValueType

}
export const Todolist = (props: PropsType) => {
    let todolistId = props.id
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
        props.addTask(todolistId, title)
    }
    const onChangeTodolistTitleHandler = (newTitle: string) => {
        props.changeTodolistTitle(todolistId, newTitle)
    }
    const removeTodolist = () => {
        props.removeTodolist(todolistId)
    }

// берем айди этого тудулиста, он пришлел в пропсах,
// и используем второй аргумент (название таски) из addItemForm,
// а там используем уже функцию с 1 параметром
    return (
        <div>
            <h3>
                <EditableSpan title={props.title} onChange={onChangeTodolistTitleHandler}/>
                {/*{props.title}*/}
                <IconButton onClick={removeTodolist} aria-label="delete" >
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm
                addItem={addTask}/>
            <div>
                {
                    props.tasks.map(t => {
                        const checkboxHandler = (e: ChangeEvent<HTMLInputElement>) => {
                            props.changeStatus(todolistId, t.id, e.currentTarget.checked)
                        }
                        const onClickHandler = () => {
                            props.removeTask(todolistId, t.id)
                        }
                        const onChangeTitleHandler = (newValue: string) => {
                            props.changeTaskTitle(todolistId, t.id, newValue)
                        }

                        return <div className={t.isDone ? "is-done" : "task"} key={t.id}><Checkbox
                                                                                               checked={t.isDone}
                                                                                               onChange={checkboxHandler}/>
                            <EditableSpan title={t.title} onChange={onChangeTitleHandler}/>
                            <IconButton onClick={onClickHandler} aria-label="delete" >
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

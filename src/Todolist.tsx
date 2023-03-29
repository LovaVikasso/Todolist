import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {FilterValueType, TaskType} from "./App";


type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTodolist: (todolistId: string) => void
    addTask: (todolistId: string, title: string) => void
    removeTask: (todolistId: string, id: string) => void
    changeStatus: (todolistId: string, id: string, isDone: boolean) => void
    changeFilter: (todolistId: string, value: FilterValueType) => void
    filter: FilterValueType

}
export const Todolist = (props: PropsType) => {
    let todolistId = props.id
    const [taskTitle, setTaskTitle] = useState('')
    const [error, setError] = useState('')

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTaskTitle(e.currentTarget.value);
        setError('')
    }
    const addTask = () => {
        if (taskTitle.trim() !== "") {
            props.addTask(props.id, taskTitle.trim())
            setTaskTitle("")
        } else {
            setError('Title is required')
        }
    }
    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            addTask();
        }
    }
    const onAllClickHandler = () => {
        props.changeFilter(todolistId, "all")
    }
    const onActiveClickHandler = () => {
        props.changeFilter(todolistId, "active")
    }
    const onCompletedClickHandler = () => {
        props.changeFilter(todolistId, "completed")
    }

    return (
        <div>
            <h3>{props.title}</h3>
                <button onClick={()=>{props.removeTodolist(todolistId)}}>X</button>
            <div>
                <input value={taskTitle}
                       onChange={onChangeHandler}
                       onKeyDown={onKeyDownHandler}
                       className={error && "error"}/>
                <button onClick={addTask}>+</button>
                {error && <p className="error-message">Title is required</p>}
            </div>
            <ul>
                {
                    props.tasks.map(t => {
                        const checkboxHandler = (e: ChangeEvent<HTMLInputElement>) => {
                            props.changeStatus(todolistId, t.id, e.currentTarget.checked)
                        }
                        const onClickHandler = () => {
                            props.removeTask(todolistId, t.id)
                        }
                        return <li className={t.isDone ? "is-done" : "task"} key={t.id}><input type="checkbox"
                                                                                               checked={t.isDone}
                                                                                               onChange={checkboxHandler}/>
                            <span>{t.title}</span>
                            <button onClick={onClickHandler}>X
                            </button>
                        </li>
                    })}
            </ul>
            <div>
                <button className={props.filter == "all" ? "active-filter" : "passive-filter"}
                        onClick={onAllClickHandler}>All
                </button>
                <button className={props.filter == "active" ? "active-filter" : "passive-filter"}
                        onClick={onActiveClickHandler}>Active
                </button>
                <button className={props.filter == "completed" ? "active-filter" : "passive-filter"}
                        onClick={onCompletedClickHandler}>Completed
                </button>
            </div>
        </div>
    );
};

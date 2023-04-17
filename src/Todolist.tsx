import React, {ChangeEvent} from 'react';
import {FilterValueType, TaskType} from "./App";
import {AddItemForm} from "./Components/AddItemForm";
import {EditableSpan} from "./Components/EditableSpan";


type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    removeTodolist: (todolistId: string) => void
    addTask: (todolistId: string, title: string) => void
    changeTaskTitle: (todolistId: string, taskId:string, title: string) => void
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
// берем айди этого тудулиста, он пришлел в пропсах,
// и используем второй аргумент (название таски) из addItemForm,
// а там используем уже функцию с 1 параметром
    return (
        <div>
            <h3>{props.title}
                <button onClick={() => {
                    props.removeTodolist(todolistId)
                }}>X
                </button>
            </h3>
            <AddItemForm
                addItem={addTask}/>

            <ul>
                {
                    props.tasks.map(t => {
                        const checkboxHandler = (e: ChangeEvent<HTMLInputElement>) => {
                            props.changeStatus(todolistId, t.id, e.currentTarget.checked)
                        }
                        const onClickHandler = () => {
                            props.removeTask(todolistId, t.id)
                        }
                        const onChangeTitleHandler = (newValue:string) => {
                            props.changeTaskTitle(todolistId, t.id, newValue)
                        }

                        return <li className={t.isDone ? "is-done" : "task"} key={t.id}><input type="checkbox"
                                                                                               checked={t.isDone}
                                                                                               onChange={checkboxHandler}/>
                            <EditableSpan title={t.title} onChange={onChangeTitleHandler}/>
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

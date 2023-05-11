
import {v1} from "uuid";
import {AddTodolistACType, RemoveTodolistACType} from "./todolists-reducer";
import {TasksStateType} from "../App";

export type AddTaskACType = { type: 'ADD-TASK', todolistId: string, title: string }
export type RemoveTaskACType = { type: 'REMOVE-TASK', todolistId: string, taskId: string }
export type ChangeTaskTitleACType = { type: 'CHANGE-TASK-TITLE', todolistId: string, taskId: string, newTitle: string }
export type ChangeTaskStatusACType = { type: 'CHANGE-TASK-STATUS', todolistId: string, taskId: string, newStatus: boolean }
export type TasksACType =
    AddTaskACType
    | RemoveTaskACType
    | ChangeTaskTitleACType
    | ChangeTaskStatusACType
    | AddTodolistACType | RemoveTodolistACType

const initialState:TasksStateType = {
}
export const tasksReducer = (state: TasksStateType = initialState, action: TasksACType): TasksStateType => {
    switch (action.type) {
        case 'ADD-TASK': {
            const newTask = {id: v1(), title: action.title, isDone: false} //создаем шаблон новой таски, тайтл берем из action
            const stateCopy = {...state} //создаем копию
            const tasks = stateCopy[action.todolistId] //берем нужный нам массив по ключу (тудулист Id) из стейта
            stateCopy[action.todolistId] = [newTask, ...tasks] //меняем в копии по тому же ключу, доавляем в начало массива новую таску
            return stateCopy //
        }
        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todolistId]
            stateCopy[action.todolistId] = tasks.filter(t => t.id !== action.taskId)
            return stateCopy
        }
        case 'CHANGE-TASK-TITLE': {
            const stateCopy = {...state}
            stateCopy[action.todolistId] = stateCopy[action.todolistId].map((t) => t.id === action.taskId ? {
                ...t,
                title: action.newTitle
            } : t)
            return stateCopy
        }
        case 'CHANGE-TASK-STATUS': {
            const stateCopy = {...state}
            stateCopy[action.todolistId] = stateCopy[action.todolistId].map((t) => t.id === action.taskId ? {
                ...t,
                isDone: !t.isDone
            } : t)
            return stateCopy
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todolistId]: []
            }
        }
        case 'REMOVE-TODOLIST' : {
            const stateCopy = {...state}
            delete stateCopy[action.todolistId]
            return stateCopy
        }
        default:
            return state
        //  throw new Error("I don't understand this action type")
    }
};
export const addTaskAC = (todolistId: string, title: string): AddTaskACType => {
    return {type: 'ADD-TASK', todolistId, title} as const
}
export const removeTaskAC = (todolistId: string, taskId: string): RemoveTaskACType => {
    return {type: 'REMOVE-TASK', todolistId, taskId} as const
}
export const changeTaskTitleAC = (todolistId: string, taskId: string, newTitle: string): ChangeTaskTitleACType => {
    return {type: 'CHANGE-TASK-TITLE', todolistId, taskId, newTitle} as const
}
export const changeTaskStatusAC = (todolistId: string, taskId: string, newStatus: boolean): ChangeTaskStatusACType => {
    return {type: 'CHANGE-TASK-STATUS', todolistId, taskId, newStatus} as const
}

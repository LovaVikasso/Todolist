
import {v1} from "uuid";
import {AddTodolistACType, RemoveTodolistACType, todolistId1, todolistId2} from "./todolists-reducer";
import {TasksStateType} from "../AppWithRedux";

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
    [todolistId1]: [
        {id: v1(), title: "HTML", isDone: true},
        {id: v1(), title: "CSS", isDone: true},
        {id: v1(), title: "React", isDone: false}
    ], [todolistId2]: [
        {id: v1(), title: "iPad", isDone: true},
        {id: v1(), title: "Canon", isDone: true},
        {id: v1(), title: "iPhone", isDone: false}
    ]
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
            // let tasks = stateCopy[action.todolistId]
            // let task = tasks.find(t=>t.id === action.taskId)
            // if (task) {
            //     task.title = action.newTitle
            // }
            // return stateCopy
            stateCopy[action.todolistId] = stateCopy[action.todolistId].map((t) => t.id == action.taskId ? {
                ...t,
                title: action.newTitle
            } : t)
            return stateCopy
        }
        case 'CHANGE-TASK-STATUS': {
            const stateCopy = {...state}
            stateCopy[action.todolistId] = stateCopy[action.todolistId].map((t) => t.id == action.taskId ? {
                ...t,
                isDone: !t.isDone
            } : t)
            return stateCopy
        }
        case 'ADD-TODOLIST': {
            const stateCopy = {...state}
            stateCopy[action.todolistId] = []
            return stateCopy
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

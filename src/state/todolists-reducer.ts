import {FilterValueType, TodolistType} from "../App";

export type AddTodolistACType = { type: 'ADD-TODOLIST', todolistId:string, title: string }
export type ChangeTitleACType = { type: 'CHANGE-TITLE', todolistId: string, title: string }
export type ChangeFilterACType = { type: 'CHANGE-FILTER', todolistId: string, value: FilterValueType }
export type RemoveTodolistACType = { type: 'REMOVE-TODOLIST', todolistId: string }
export type TodolistACType = AddTodolistACType | ChangeTitleACType | ChangeFilterACType | RemoveTodolistACType

export const todolistsReducer = (state: Array<TodolistType>, action: TodolistACType): Array<TodolistType> => {
    switch (action.type) {
        case 'ADD-TODOLIST': {
            return [{id: action.todolistId, title: action.title, filter: 'all'}, ...state]
        }
        case 'CHANGE-TITLE': {
            let newTodo = state.find((t) => t.id === action.todolistId)
            if (newTodo) {
                newTodo.title = action.title
            }
            return [...state]
        }
        case 'CHANGE-FILTER': {
            let newTodo = state.find((t) => t.id === action.todolistId)
            if (newTodo) {
                newTodo.filter = action.value
            }
            return [...state]
        }
        case 'REMOVE-TODOLIST': {
            let newState = state.filter((t)=>t.id!== action.todolistId)
            return [...newState]
        }
        default:
            throw new Error("I don't understand this action type")
    }
};
export const addTodolistAC = (todolistId:string, title: string): AddTodolistACType =>{
    return {type: 'ADD-TODOLIST',todolistId, title} as const
}
export const changeTitleAC = (todolistId: string, title: string): ChangeTitleACType =>{
    return {type: 'CHANGE-TITLE', todolistId, title} as const
}
export const changeFilterAC = (todolistId: string, value: FilterValueType): ChangeFilterACType =>{
    return {type: 'CHANGE-FILTER', todolistId, value} as const
}
export const removeTodolistAC = (todolistId: string):RemoveTodolistACType =>{
    return {type: "REMOVE-TODOLIST", todolistId} as const
}

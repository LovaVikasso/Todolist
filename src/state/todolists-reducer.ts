import {FilterValueType, TodolistType} from "../App";
import {v1} from "uuid";

export type AddTodolistACType = { type: 'ADD-TODOLIST', title: string }
export type ChangeTitleACType = { type: 'CHANGE-TITLE', todolistId: string, title: string }
export type ChangeFilterACType = { type: 'CHANGE-FILTER', todolistId: string, value: FilterValueType }
export type RemoveTodolistACType = { type: 'REMOVE-TODOLIST', todolistId: string }
export type TodolistACType = AddTodolistACType | ChangeTitleACType | ChangeFilterACType | RemoveTodolistACType

export const todolistsReducer = (state: Array<TodolistType>, action: TodolistACType) => {
    switch (action.type) {
        case 'ADD-TODOLIST': {
            let newTodolist = {id: v1(), title: action.title, filter: 'all'}
            return [newTodolist, ...state]
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
export const addTodolistAC = (title: string): AddTodolistACType =>{
    return {type: 'ADD-TODOLIST', title}
}
export const changeTitleAC = (todolistId: string, title: string): ChangeTitleACType =>{
    return {type: 'CHANGE-TITLE', todolistId, title}
}
export const changeFilterAC = (todolistId: string, value: FilterValueType): ChangeFilterACType =>{
    return {type: 'CHANGE-FILTER', todolistId, value}
}
export const removeTodolistAC = (todolistId: string):RemoveTodolistACType =>{
    return {type: "REMOVE-TODOLIST", todolistId}
}

import {FilterValueType, TodolistType} from "../App";
import {v1} from "uuid";

export type AddTodolistAC = { type: 'ADD-TODOLIST', title: string }
export type ChangeTitleAC = { type: 'CHANGE-TITLE', todolistId: string, title: string }
export type ChangeFilterAC = { type: 'CHANGE-FILTER', todolistId: string, value: FilterValueType }
export type RemoveTodolistAC = { type: 'REMOVE-TODOLIST', todolistId: string }
export type TodolistACType = AddTodolistAC | ChangeTitleAC | ChangeFilterAC | RemoveTodolistAC

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

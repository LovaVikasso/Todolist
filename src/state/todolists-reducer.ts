import {todolistsAPI, TodolistType} from '../api/todolists-api'
import {AppThunk} from "./store";
export type AddTodolistACType = { type: 'ADD-TODOLIST', todolist: TodolistType }
export type ChangeTitleACType = { type: 'CHANGE-TITLE', todolistId: string, title: string }
export type ChangeFilterACType = { type: 'CHANGE-FILTER', todolistId: string, value: FilterValueType }
export type RemoveTodolistACType = { type: 'REMOVE-TODOLIST', todolistId: string }
export type SetTodolistACType = { type: 'SET-TODOLISTS', todolists: Array<TodolistType> }

export type TodolistACType =
    AddTodolistACType
    | ChangeTitleACType
    | ChangeFilterACType
    | RemoveTodolistACType
    | SetTodolistACType

export type FilterValueType = "all" | "completed" | "active"
export type TodolistDomainType = TodolistType & {
    filter: FilterValueType
}
const initialState: Array<TodolistDomainType> = []
export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistACType): Array<TodolistDomainType> => {
    switch (action.type) {
        case "SET-TODOLISTS": {
            return action.todolists.map(tl => ({...tl, filter: 'all'}))
        }
        case 'ADD-TODOLIST': {
            return [{...action.todolist, filter: 'all'}, ...state]
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
            let newState = state.filter((t) => t.id !== action.todolistId)
            return [...newState]
        }
        default:
            return state
        //  throw new Error("I don't understand this action type")
    }
};
export const addTodolistAC = (todolist: TodolistType): AddTodolistACType => {
    return {type: 'ADD-TODOLIST', todolist} as const
}
export const changeTitleAC = (todolistId: string, title: string): ChangeTitleACType => {
    return {type: 'CHANGE-TITLE', todolistId, title} as const
}
export const changeFilterAC = (todolistId: string, value: FilterValueType): ChangeFilterACType => {
    return {type: 'CHANGE-FILTER', todolistId, value} as const
}
export const removeTodolistAC = (todolistId: string): RemoveTodolistACType => {
    return {type: "REMOVE-TODOLIST", todolistId} as const
}
export const setTodolistsAC = (todolists: Array<TodolistType>): SetTodolistACType => {
    return {type: "SET-TODOLISTS", todolists} as const
}
export const fetchTodolistsTC = (): AppThunk => async dispatch => {
    try {
        const res = await todolistsAPI.getTodolists()
        dispatch(setTodolistsAC(res.data))
    } catch (error: any) {
        throw new Error(error)
    }
}
export const removeTodolistTC = (todolistId: string): AppThunk => async dispatch => {
    todolistsAPI.deleteTodolist(todolistId)
        .then(() => {
            dispatch(removeTodolistAC(todolistId))
        })
}
export const addTodolistTC = (title: string): AppThunk => async dispatch => {
    const res = await todolistsAPI.createTodolist(title)
    dispatch(addTodolistAC(res.data.data.item))
}
export const changeTodolistTitleTC = (todolistId: string, title: string): AppThunk => async dispatch => {
    await todolistsAPI.updateTodolist(todolistId, title)
    dispatch(changeTitleAC(todolistId, title))
}
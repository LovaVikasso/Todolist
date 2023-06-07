import {todolistsAPI, TodolistType} from '../API/todolists-api'
import {AppThunk} from "./store";
import {RequestStatusType, SetErrorACType, setAppStatusAC, SetStatusACType} from "./app-reducer";
//types
export type AddTodolistACType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>
export type SetTodolistACType = ReturnType<typeof setTodolistsAC>
export type ChangeTodolistEntityStatusACType = ReturnType<typeof changeTodolistEntityStatusAC>
export type TodolistACType =
    | ReturnType<typeof changeTitleAC>
    | ReturnType<typeof changeFilterAC>
    | AddTodolistACType
    | RemoveTodolistACType
    | SetTodolistACType
    | SetStatusACType
    | SetErrorACType
    | ChangeTodolistEntityStatusACType
export type FilterValueType = "all" | "completed" | "active"
export type TodolistDomainType = TodolistType & {
    filter: FilterValueType
    entityStatus: RequestStatusType
}

const initialState: Array<TodolistDomainType> = []
export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistACType): Array<TodolistDomainType> => {
    switch (action.type) {
        case "SET-TODOLISTS":
            return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        case "CHANGE-TODOLISTS-ENTITY-STATUS":
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.status} : tl)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
        case 'CHANGE-TITLE':
            return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'CHANGE-FILTER':
            return state.map(tl => tl.id === action.id ? {...tl, filter: action.value} : tl)
        case 'REMOVE-TODOLIST':
            return state.filter((t) => t.id !== action.id)
        default:
            return state
    }
};
//actions
export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTitleAC = (id: string, title: string) => ({type: 'CHANGE-TITLE', id, title} as const)
export const changeFilterAC = (id: string, value: FilterValueType) => ({type: 'CHANGE-FILTER', id, value} as const)
export const removeTodolistAC = (id: string) => ({type: "REMOVE-TODOLIST", id} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: "SET-TODOLISTS", todolists} as const)
export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) => ({
    type: "CHANGE-TODOLISTS-ENTITY-STATUS",
    id,
    status
} as const)
//thunks
export const fetchTodolistsTC = (): AppThunk => async dispatch => {
    try {
        dispatch(setAppStatusAC('loading'))
        const res = await todolistsAPI.getTodolists()
        dispatch(setTodolistsAC(res.data))
        dispatch(setAppStatusAC('succeeded'))
    } catch (error: any) {
        throw new Error(error)
    }
}
export const removeTodolistTC = (todolistId: string): AppThunk => async dispatch => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodolistEntityStatusAC(todolistId,'loading'))
    todolistsAPI.deleteTodolist(todolistId)
        .then(() => {
            dispatch(removeTodolistAC(todolistId))
            dispatch(setAppStatusAC('succeeded'))
        })
}
export const addTodolistTC = (title: string): AppThunk => async dispatch => {
    dispatch(setAppStatusAC('loading'))
    const res = await todolistsAPI.createTodolist(title)
    dispatch(addTodolistAC(res.data.data.item))
    dispatch(setAppStatusAC('succeeded'))
}
export const changeTodolistTitleTC = (todolistId: string, title: string): AppThunk => async dispatch => {
    dispatch(setAppStatusAC('loading'))
    await todolistsAPI.updateTodolist(todolistId, title)
    dispatch(changeTitleAC(todolistId, title))
    dispatch(setAppStatusAC('succeeded'))
}
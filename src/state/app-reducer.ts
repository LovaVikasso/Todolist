import {authAPI} from "../API/todolists-api";
import {Dispatch} from "redux";
import {handleServerAppError, handleServerNetworkError} from "../Utils/error-utils";
import {SetIsLoggedInAC, SetIsLoggedInType} from "./auth-reducer";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}
export type SetErrorACType = ReturnType<typeof SetAppErrorAC>
export type SetStatusACType = ReturnType<typeof setAppStatusAC>
export type SetIsInitializedACType = ReturnType<typeof SetIsInitializedAC>

export type ActionsType =
    | SetStatusACType
    | SetErrorACType
    | SetIsInitializedACType
    | SetIsLoggedInType

const initialState: InitialType = {
    status: 'idle', // происходит ли взаимодействие с сервером
    error: null, //если будет какая-либо ошибка, то запишем ее сюда
    isInitialized: false //true когда приложение проинициализировалось (проверили юзера, получили настройки и тд)
}

export const appReducer = (state: InitialType = initialState, action: ActionsType): InitialType => {
    switch (action.type) {
        case 'APP/SET-STATUS': {
            return {...state, status: action.status}
        }
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case "APP/SET-IS-INITIALIZED":
            return {...state, isInitialized: action.isInitialized}
        default:
            return state
    }
}

export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const SetAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
export const SetIsInitializedAC = (isInitialized: boolean) =>
    ({type: 'APP/SET-IS-INITIALIZED', isInitialized} as const)

export const initializeAppTC = () => async (dispatch: Dispatch<ActionsType>) => {
    try {
        const response = await authAPI.me()
        if (response.data.resultCode === 0) {
            dispatch(SetIsLoggedInAC(true))
        }
        else {
            handleServerAppError(response.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError((e as any).message, dispatch)
    }
    finally {dispatch(SetIsInitializedAC(true))}
}
import {Dispatch} from 'redux'
import {setAppStatusAC, SetErrorACType, SetStatusACType} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../Utils/error-utils";
import {authAPI, LoginType} from "../API/todolists-api";

const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
// actions
export const SetIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// thunks
export const loginTC = (data: LoginType) => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const response = await authAPI.login(data)
        if (response.data.resultCode === 0) {
            dispatch(SetIsLoggedInAC(true))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(response.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError((e as any).message, dispatch)
    }
}
export const logoutTC = () => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    console.log(initialState.isLoggedIn)
    try {
        const response = await authAPI.logout()
        if (response.data.resultCode === 0) {
            dispatch(SetIsLoggedInAC(false))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            handleServerAppError(response.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError((e as any).message, dispatch)
    }
}


// types
export type SetIsLoggedInType = ReturnType<typeof SetIsLoggedInAC>


type ActionsType =
    | SetIsLoggedInType
    | SetStatusACType
    | SetErrorACType


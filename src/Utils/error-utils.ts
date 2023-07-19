import {
    SetAppErrorAC,
    SetErrorACType,
    setAppStatusAC,
    SetStatusACType
} from '../state/app-reducer'
import { Dispatch } from 'redux'
import {ResponseType} from "../API/todolists-api";

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
    if (data.messages.length) {
        dispatch(SetAppErrorAC(data.messages[0]))
    } else {
        dispatch(SetAppErrorAC('Some error occurred'))
    }
    dispatch(setAppStatusAC('failed'))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: ErrorUtilsDispatchType) => {
    dispatch(SetAppErrorAC(error.message))
    dispatch(setAppStatusAC('failed'))
}

type ErrorUtilsDispatchType = Dispatch<SetErrorACType | SetStatusACType>
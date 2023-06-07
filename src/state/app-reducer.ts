
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialType = {
    status: RequestStatusType
    error: string | null
}
export type SetErrorACType = ReturnType<typeof setAppErrorAC>
export type SetStatusACType = ReturnType<typeof setAppStatusAC>
export type ActionsType =
    | SetStatusACType
    | SetErrorACType

const initialState: InitialType = {
    status: 'idle',
    error: null
}
export const setAppStatusAC = (status:RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)

export const appReducer = (state: InitialType = initialState, action: ActionsType): InitialType => {
    switch (action.type) {
        case 'APP/SET-STATUS': {
            return {...state, status: action.status}
        }
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        default:
            return state
    }
}
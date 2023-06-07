
export type statusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialType = {
    status: statusType
    error: string | null
}
export type SetErrorACType = ReturnType<typeof setErrorAC>
export type SetStatusACType = ReturnType<typeof setStatusAC>
export type ActionsType =
    | SetStatusACType
    | SetErrorACType

const initialState: InitialType = {
    status: 'idle',
    error: null
}
export const setStatusAC = (status:statusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)

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
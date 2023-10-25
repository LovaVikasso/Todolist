import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
export type InitialType = {
    status: RequestStatusType;
    error: string | null;
    isInitialized: boolean;
}

const slice = createSlice({
    name: 'app',
    initialState: {
        status: "idle" as RequestStatusType,
        error: null as null | string,
        isInitialized: false
    },
    reducers: {
        setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        },
        setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setIsInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
            state.isInitialized = action.payload.isInitialized
        },
    }
})

export const appReducer = slice.reducer;
// export const {setIsLoggedIn} = slice.actions
export const appActions = slice.actions


// export type SetErrorACType = ReturnType<typeof SetAppErrorAC>;
// export type SetStatusACType = ReturnType<typeof setAppStatusAC>;
// export type SetIsInitializedACType = ReturnType<typeof SetIsInitializedAC>;
//
// export type ActionsType = SetStatusACType | SetErrorACType | SetIsInitializedACType | SetIsLoggedInType;
//
// const initialState: InitialType = {
//   status: "idle", // происходит ли взаимодействие с сервером
//   error: null, //если будет какая-либо ошибка, то запишем ее сюда
//   isInitialized: false, //true когда приложение проинициализировалось (проверили юзера, получили настройки и тд)
// };
//
// export const appReducer = (State: InitialType = initialState, action: ActionsType): InitialType => {
//   switch (action.type) {
//     case "APP/SET-STATUS": {
//       return { ...State, status: action.status };
//     }
//     case "APP/SET-ERROR":
//       return { ...State, error: action.error };
//     case "APP/SET-IS-INITIALIZED":
//       return { ...State, isInitialized: action.isInitialized };
//     default:
//       return State;
//   }
// };
//
// export const setAppStatusAC = (status: RequestStatusType) => ({ type: "APP/SET-STATUS", status }) as const;
// export const SetAppErrorAC = (error: string | null) => ({ type: "APP/SET-ERROR", error }) as const;
// export const SetIsInitializedAC = (isInitialized: boolean) =>
//   ({ type: "APP/SET-IS-INITIALIZED", isInitialized }) as const;
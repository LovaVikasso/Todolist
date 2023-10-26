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
export const appActions = slice.actions

import {createSlice} from '@reduxjs/toolkit';
import {authAPI} from "API/auth-api";
import {LoginType} from "API/types";
import {createAppAsyncThunk, handleServerNetworkError} from "Utils";
import {appActions} from "State/app-reducer";
import {todolistsActions} from "State/todolists-reducer";
import {handleServerAppError} from "Utils";
import {ResultCode} from "enums/common.enums";


const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginType> (
    'auth/login',
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(appActions.setAppStatus({status: "loading"}));
            const response = await authAPI.login(arg);
            if (response.data.resultCode === ResultCode.Success) {
                dispatch(appActions.setAppStatus({status: "succeeded"}));
                return { isLoggedIn: true }
            } else {
                handleServerAppError(response.data, dispatch);
                return rejectWithValue(null)
            }
        }
        catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    }
)

const logout = createAppAsyncThunk<undefined, undefined> (
    'auth/logout',
    async (_, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: "loading"}));
        const res = await authAPI.logout();
        if (res.data.resultCode === 0) {
            dispatch(todolistsActions.clearTodolistsData())
            dispatch(appActions.setAppStatus({status: "succeeded"}));
            return undefined
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null)
    }
})

const initializeApp = createAppAsyncThunk<{isLoggedIn:boolean}, undefined> (
    'auth/initializeApp',
    async(_, thunkAPI) =>{
        const {dispatch, rejectWithValue} = thunkAPI
        try{
            const res = await authAPI.me()
            if (res.data.resultCode === ResultCode.Success) {
                return {isLoggedIn: true}
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null)
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null)
        } finally {
            dispatch(appActions.setIsInitialized({isInitialized:true}))
        }
    }
)
const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        // setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
        //     state.isLoggedIn = action.payload.isLoggedIn
        // }
    }, extraReducers: (builder) => {
        builder
        .addCase(authThunks.login.fulfilled, (state, action) =>{
            state.isLoggedIn = action.payload.isLoggedIn
        })
        .addCase(authThunks.logout.fulfilled, (state) =>{
            state.isLoggedIn = false
        })
        .addCase(authThunks.initializeApp.fulfilled, (state, action) =>{
            state.isLoggedIn = action.payload.isLoggedIn
        })
    }
})

export const authReducer = slice.reducer;
export const authThunks = {login, logout, initializeApp}

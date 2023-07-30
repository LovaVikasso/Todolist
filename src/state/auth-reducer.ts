import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {authAPI, LoginType} from "API/todolists-api";
import {handleServerNetworkError} from "Utils";
import {AppThunk} from "state/store";
import {appActions} from "state/app-reducer";
import {todolistsActions} from "state/todolists-reducer";
import {handleServerAppError} from "Utils";

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    }
})
// thunks
export const loginTC = (data: LoginType): AppThunk => async (dispatch) => {
    dispatch(appActions.setAppStatus({status: "loading"}));
    try {
        const response = await authAPI.login(data);
        if (response.data.resultCode === 0) {
            dispatch(authActions.setIsLoggedIn({isLoggedIn: true}));
            dispatch(appActions.setAppStatus({status: "succeeded"}));
        } else {
            handleServerAppError(response.data, dispatch);
        }
    } catch (e) {
        handleServerNetworkError((e as any).message, dispatch);
    }
};
export const logoutTC = (): AppThunk => async (dispatch) => {
    dispatch(appActions.setAppStatus({status: "loading"}));
    try {
        const response = await authAPI.logout();
        if (response.data.resultCode === 0) {
            dispatch(authActions.setIsLoggedIn({isLoggedIn: false}));
            dispatch(todolistsActions.clearTodolistsData())
            dispatch(appActions.setAppStatus({status: "succeeded"}));
        } else {
            handleServerAppError(response.data, dispatch);
        }
    } catch (e) {
        handleServerNetworkError((e as any).message, dispatch);
    }
};

export const authReducer = slice.reducer;
// export const {setIsLoggedIn} = slice.actions
export const authActions = slice.actions

// import { Dispatch } from "redux";
// import { setAppStatusAC, SetErrorACType, SetStatusACType } from "./app-reducer";
// import { handleServerAppError, handleServerNetworkError } from "Utils/error-utils";
// import { authAPI, LoginType } from "API/todolists-api";
//
// const initialState = {
//   isLoggedIn: false,
// };
// type InitialStateType = typeof initialState;
//
// export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//   switch (action.type) {
//     case "login/SET-IS-LOGGED-IN":
//       return { ...state, isLoggedIn: action.value };
//     default:
//       return state;
//   }
// };
// // actions
// export const SetIsLoggedInAC = (value: boolean) => ({ type: "login/SET-IS-LOGGED-IN", value }) as const;
//

// // types
// export type SetIsLoggedInType = ReturnType<typeof SetIsLoggedInAC>;
//
// type ActionsType = SetIsLoggedInType | SetStatusACType | SetErrorACType;

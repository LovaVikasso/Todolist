import {todolistsAPI} from "API/todolists-api"
import {TodolistType, UpdateTodolistTitleArgType} from "API/types"
import {appActions, RequestStatusType} from "State/app-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerNetworkError} from "Utils/handleServerNetworkError";
import {createAppAsyncThunk, handleServerAppError} from "Utils";
import {ResultCode} from "enums/common.enums";


export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
const initialState: Array<TodolistDomainType> = []
const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }, void>(
    'todolists/fetchTodolists',
    async (_, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(appActions.setAppStatus({status: "loading"}))
            const res = await todolistsAPI.getTodolists()
            dispatch(appActions.setAppStatus({status: "succeeded"}))
            return {todolists: res.data}
        } catch (error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
        }
    })
const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(
    'todolists/addTodolist',
    async (title: string, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(appActions.setAppStatus({status: "loading"}))
            const res = await todolistsAPI.createTodolist(title)
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(appActions.setAppStatus({ status: "succeeded" }));
                return { todolist: res.data.data.item };
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null);
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    }
)
const removeTodolist = createAppAsyncThunk<{ id: string }, string>(
    'todolists/removeTodolist',
    async (id: string, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(appActions.setAppStatus({status: "loading"}))
            dispatch(todolistsActions.changeTodolistEntityStatus({id, entityStatus: "loading"}))
            const res = await todolistsAPI.deleteTodolist(id)
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(appActions.setAppStatus({ status: "succeeded" }));
                return { id };
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null);
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    }
)
//  const changeTodolistTitle = (id: string, title: string): AppThunk => {
//     return (dispatch) => {
//         todolistsAPI.updateTodolist(id, title).then(() => {
//             dispatch(todolistsActions.changeTodolistTitle({id, title}))
//         })
//     }
// }
const changeTodolistTitle = createAppAsyncThunk<UpdateTodolistTitleArgType, UpdateTodolistTitleArgType>(
    "todo/changeTodolistTitle",
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI;
        try {
            dispatch(appActions.setAppStatus({ status: "loading" }));
            const res = await todolistsAPI.updateTodolist(arg);
            if (res.data.resultCode === ResultCode.Success) {
                dispatch(appActions.setAppStatus({ status: "succeeded" }));
                return arg;
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null);
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null);
        }
    },
);
// export const removeTodolistTC = (todolistId: string): AppThunk => {
//     return (dispatch) => {
//         //изменим глобальный статус приложения, чтобы вверху полоса побежала
//         dispatch(appActions.setAppStatus({status: "loading"}))
//         //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
//         dispatch(todolistsActions.changeTodolistEntityStatus({id: todolistId, entityStatus: "loading"}))
//         todolistsAPI.deleteTodolist(todolistId).then(() => {
//             dispatch(todolistsActions.removeTodolist({id: todolistId}))
//             //скажем глобально приложению, что асинхронная операция завершена
//             dispatch(appActions.setAppStatus({status: "succeeded"}))
//         })
//     }
// }


const slice = createSlice({
    name: "todolists",
    initialState: initialState,
    reducers: {

        changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
            const todo = state.find((todo) => todo.id === action.payload.id)
            if (todo) {
                todo.filter = action.payload.filter
            }
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>) => {
            const todo = state.find((todo) => todo.id === action.payload.id)
            if (todo) {
                todo.entityStatus = action.payload.entityStatus
            }
        },

        clearTodolistsData: () => {
            return []
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
                return action.payload.todolists.map((tl) => ({...tl, filter: "all", entityStatus: "idle"}))
            })
            .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
                state.unshift({...action.payload.todolist, filter: "all", entityStatus: "idle"})
            })
            .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) =>{
                const index = state.findIndex((todo) => todo.id === action.payload.id)
                if (index !== -1) state.splice(index, 1)
            })
            .addCase(todolistsThunks.changeTodolistTitle.fulfilled,(state, action) => {
                const todo = state.find((todo) => todo.id === action.payload.id)
                if (todo) {
                    todo.title = action.payload.title
                }
            })
    }
})


// thunks
// export const fetchTodolistsTC = (): AppThunk => {
//     return (dispatch) => {
//         dispatch(appActions.setAppStatus({ status: "loading" }))
//         todolistsAPI
//             .getTodolists()
//             .then((res) => {
//                 dispatch(todolistsActions.setTodolists({ todolists: res.data }))
//                 dispatch(appActions.setAppStatus({ status: "succeeded" }))
//                 return res.data
//             })
//             .then((todos)=> {
//                 todos.forEach((tl)=>{
//                     dispatch(fetchTasks(tl.id))
//                 })
//             })
//             .catch((error) => {
//                 handleServerNetworkError(error, dispatch)
//             })
//     }
// }



export const todolistsReducer = slice.reducer
// export const { removeTodolist, addTodolist, changeTodolistTitle, changeTodolistFilter, changeTodolistEntityStatus, setTodolists } = slice.actions;
export const todolistsActions = slice.actions
export const todolistsThunks = {fetchTodolists, addTodolist, removeTodolist, changeTodolistTitle}

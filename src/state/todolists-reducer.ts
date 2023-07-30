import {todolistsAPI, TodolistType} from "API/todolists-api"
import {appActions, RequestStatusType} from "state/app-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "state/store";
import {handleServerNetworkError} from "Utils/handleServerNetworkError";
import {fetchTasks} from "state/tasks-reducer";


export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
const initialState: Array<TodolistDomainType> = []
const slice = createSlice({
    name: "todolists",
    initialState: initialState,
    reducers: {
        removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
            const index = state.findIndex((todo) => todo.id === action.payload.id)
            if (index !== -1) state.splice(index, 1)
        },
        addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
            state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
        },
        changeTodolistTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
            const todo = state.find((todo) => todo.id === action.payload.id)
            if (todo) {
                todo.title = action.payload.title
            }
        },
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
        setTodolists: (state, action: PayloadAction<{ todolists: Array<TodolistType> }>) => {
            return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }))
        },
        clearTodolistsData: () => {
            return []
        }
    },
})
export const todolistsReducer = slice.reducer
// export const { removeTodolist, addTodolist, changeTodolistTitle, changeTodolistFilter, changeTodolistEntityStatus, setTodolists } = slice.actions;
export const todolistsActions = slice.actions

// thunks
export const fetchTodolistsTC = (): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({ status: "loading" }))
        todolistsAPI
            .getTodolists()
            .then((res) => {
                dispatch(todolistsActions.setTodolists({ todolists: res.data }))
                dispatch(appActions.setAppStatus({ status: "succeeded" }))
                return res.data
            })
            .then((todos)=> {
                todos.forEach((tl)=>{
                    dispatch(fetchTasks(tl.id))
                })
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })

    }
}
export const removeTodolistTC = (todolistId: string): AppThunk => {
    return (dispatch) => {
        //изменим глобальный статус приложения, чтобы вверху полоса побежала
        dispatch(appActions.setAppStatus({ status: "loading" }))
        //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
        dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: "loading" }))
        todolistsAPI.deleteTodolist(todolistId).then(() => {
            dispatch(todolistsActions.removeTodolist({ id: todolistId }))
            //скажем глобально приложению, что асинхронная операция завершена
            dispatch(appActions.setAppStatus({ status: "succeeded" }))
        })
    }
}
export const addTodolistTC = (title: string): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({ status: "loading" }))
        todolistsAPI.createTodolist(title).then((res) => {
            dispatch(todolistsActions.addTodolist({ todolist: res.data.data.item }))
            dispatch(appActions.setAppStatus({ status: "succeeded" }))
        })
    }
}
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
    return (dispatch) => {
        todolistsAPI.updateTodolist(id, title).then(() => {
            dispatch(todolistsActions.changeTodolistTitle({ id, title }))
        })
    }
}


// import { todolistsAPI, TodolistType } from "API/todolists-api";
// import { AppThunk } from "./store";
// import { RequestStatusType, SetErrorACType, setAppStatusAC, SetStatusACType } from "./app-reducer";
// import { handleServerNetworkError } from "Utils/error-utils";
// //types
// export type AddTodolistACType = ReturnType<typeof addTodolistAC>;
// export type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>;
// export type SetTodolistACType = ReturnType<typeof setTodolistsAC>;
// export type ChangeTodolistEntityStatusACType = ReturnType<typeof changeTodolistEntityStatusAC>;
// export type TodolistACType =
//   | ReturnType<typeof changeTitleAC>
//   | ReturnType<typeof changeFilterAC>
//   | AddTodolistACType
//   | RemoveTodolistACType
//   | SetTodolistACType
//   | SetStatusACType
//   | SetErrorACType
//   | ChangeTodolistEntityStatusACType;
// export type FilterValueType = "all" | "completed" | "active";
// export type TodolistDomainType = TodolistType & {
//   filter: FilterValueType;
//   entityStatus: RequestStatusType;
// };
//
// const initialState: Array<TodolistDomainType> = [];
// export const todolistsReducer = (
//   state: Array<TodolistDomainType> = initialState,
//   action: TodolistACType,
// ): Array<TodolistDomainType> => {
//   switch (action.type) {
//     case "SET-TODOLISTS":
//       return action.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
//     case "CHANGE-TODOLISTS-ENTITY-STATUS":
//       return state.map((tl) => (tl.id === action.id ? { ...tl, entityStatus: action.status } : tl));
//     case "ADD-TODOLIST":
//       return [{ ...action.todolist, filter: "all", entityStatus: "idle" }, ...state];
//     case "CHANGE-TITLE":
//       return state.map((tl) => (tl.id === action.id ? { ...tl, title: action.title } : tl));
//     case "CHANGE-FILTER":
//       return state.map((tl) => (tl.id === action.id ? { ...tl, filter: action.value } : tl));
//     case "REMOVE-TODOLIST":
//       return state.filter((t) => t.id !== action.id);
//     default:
//       return state;
//   }
// };
// //actions
// export const addTodolistAC = (todolist: TodolistType) => ({ type: "ADD-TODOLIST", todolist }) as const;
// export const changeTitleAC = (id: string, title: string) => ({ type: "CHANGE-TITLE", id, title }) as const;
// export const changeFilterAC = (id: string, value: FilterValueType) => ({ type: "CHANGE-FILTER", id, value }) as const;
// export const removeTodolistAC = (id: string) => ({ type: "REMOVE-TODOLIST", id }) as const;
// export const setTodolistsAC = (todolists: Array<TodolistType>) => ({ type: "SET-TODOLISTS", todolists }) as const;
// export const changeTodolistEntityStatusAC = (id: string, status: RequestStatusType) =>
//   ({
//     type: "CHANGE-TODOLISTS-ENTITY-STATUS",
//     id,
//     status,
//   }) as const;
// //thunks
// export const fetchTodolistsTC = (): AppThunk => async (dispatch) => {
//   try {
//     dispatch(setAppStatusAC("loading"));
//     const res = await todolistsAPI.getTodolists();
//     dispatch(setTodolistsAC(res.data));
//     dispatch(setAppStatusAC("succeeded"));
//   } catch (error: any) {
//     handleServerNetworkError(error, dispatch);
//   }
// };
// export const removeTodolistTC =
//   (todolistId: string): AppThunk =>
//   async (dispatch) => {
//     try {
//       dispatch(setAppStatusAC("loading"));
//       dispatch(changeTodolistEntityStatusAC(todolistId, "loading"));
//       todolistsAPI.deleteTodolist(todolistId).then(() => {
//         dispatch(removeTodolistAC(todolistId));
//         dispatch(setAppStatusAC("succeeded"));
//       });
//     } catch (error: any) {
//       handleServerNetworkError(error, dispatch);
//     }
//   };
// export const addTodolistTC =
//   (title: string): AppThunk =>
//   async (dispatch) => {
//     try {
//       dispatch(setAppStatusAC("loading"));
//       const res = await todolistsAPI.createTodolist(title);
//       dispatch(addTodolistAC(res.data.data.item));
//       dispatch(setAppStatusAC("succeeded"));
//     } catch (error: any) {
//       handleServerNetworkError(error, dispatch);
//     }
//   };
// export const changeTodolistTitleTC =
//   (todolistId: string, title: string): AppThunk =>
//   async (dispatch) => {
//     try {
//       dispatch(setAppStatusAC("loading"));
//       await todolistsAPI.updateTodolist(todolistId, title);
//       dispatch(changeTitleAC(todolistId, title));
//       dispatch(setAppStatusAC("succeeded"));
//     } catch (error: any) {
//       handleServerNetworkError(error, dispatch);
//     }
//   };

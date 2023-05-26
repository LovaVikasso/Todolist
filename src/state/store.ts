import {applyMiddleware, combineReducers, legacy_createStore} from "redux";
import {TodolistACType, todolistsReducer} from "./todolists-reducer";
import {TasksACType, tasksReducer} from "./tasks-reducer";
import thunkMiddleware, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer
})
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatchType>()
type AppDispatchType = ThunkDispatch<AppRootType, unknown, AppActionsType>

export type AppRootType = ReturnType<typeof rootReducer>
export const store = legacy_createStore(rootReducer, applyMiddleware(thunkMiddleware))
export type RootState = ReturnType<typeof store.getState>

export type AppActionsType = TodolistACType | TasksACType
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootType, unknown, AppActionsType>
// для того чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;


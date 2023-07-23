import {AnyAction, combineReducers} from "redux";
import { todolistsReducer } from "./todolists-reducer";
import { tasksReducer } from "./tasks-reducer";
import thunkMiddleware, { ThunkAction, ThunkDispatch } from "redux-thunk";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { appReducer } from "./app-reducer";
import { authReducer } from "./auth-reducer";
import {configureStore} from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  todolists: todolistsReducer,
  tasks: tasksReducer,
  app: appReducer,
  auth: authReducer,
});
export const useAppSelector: TypedUseSelectorHook<AppRootType> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatchType>();
type AppDispatchType = ThunkDispatch<AppRootType, unknown, AnyAction>;

export type AppRootType = ReturnType<typeof store.getState>;
// export const store = legacy_createStore(rootReducer, applyMiddleware(thunkMiddleware));
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunkMiddleware),
})

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootType, unknown, AnyAction>;

// для того чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;

import {combineReducers, legacy_createStore} from "redux";
import {todolistsReducer} from "./todolists-reducer";
import {tasksReducer} from "./tasks-reducer";

const rootReducer = combineReducers({
    todolists: todolistsReducer,
    tasks: tasksReducer
})

export type AppRootType = ReturnType<typeof rootReducer>
export const store = legacy_createStore(rootReducer)
// для того чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
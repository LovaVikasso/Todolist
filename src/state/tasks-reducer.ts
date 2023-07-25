import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "API/todolists-api"
import {AppRootType, AppThunk} from "state/store";
import {appActions} from "state/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "Utils/error-utils";
import {todolistsActions} from "state/todolists-reducer";


export type TasksStateType = {
    [key: string]: Array<TaskType>
}

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
const initialState: TasksStateType = {}
const slice = createSlice({
    name: "tasks",
    initialState: initialState,
    reducers: {
        removeTask: (state, action: PayloadAction<{ todolistId: string; taskId: string }>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex((t) => t.id === action.payload.taskId)
            if (index !== -1) tasks.splice(index, 1)
        },
        addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        updateTask: (
            state,
            action: PayloadAction<{ todolistId: string; taskId: string; model: UpdateDomainTaskModelType }>,
        ) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex((t) => t.id === action.payload.taskId)
            if (index !== -1) {
                tasks[index] = { ...tasks[index], ...action.payload.model }
            }
        },
        setTasks: (state, action: PayloadAction<{ todolistId: string; tasks: TaskType[] }>) => {
            state[action.payload.todolistId] = action.payload.tasks
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(todolistsActions.addTodolist, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(todolistsActions.removeTodolist, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(todolistsActions.setTodolists, (state, action) => {
                action.payload.todolists.forEach((tl) => (state[tl.id] = []))
            })
            .addCase(todolistsActions.clearTodolistsData, () => {
               return {}
            })

    },
})
export const tasksReducer = slice.reducer
// export const {  } = slice.actions;
export const tasksActions = slice.actions

// thunks
export const fetchTasksTC =
    (todolistId: string): AppThunk =>
        (dispatch) => {
            dispatch(appActions.setAppStatus({ status: "loading" }))
            todolistsAPI.getTasks(todolistId).then((res) => {
                const tasks = res.data.items
                dispatch(tasksActions.setTasks({ todolistId, tasks }))
                dispatch(appActions.setAppStatus({ status: "succeeded" }))
            })
        }
export const removeTaskTC =
    (todolistId: string, taskId: string ): AppThunk =>
        (dispatch) => {
            todolistsAPI.deleteTask(todolistId, taskId).then(() => {
                dispatch(tasksActions.removeTask({ todolistId, taskId }))
            })
        }
export const addTaskTC =
    ( todolistId: string,title: string): AppThunk =>
        (dispatch) => {
            dispatch(appActions.setAppStatus({ status: "loading" }))
            todolistsAPI
                .createTask(todolistId, title)
                .then((res) => {
                    if (res.data.resultCode === 0) {
                        const task = res.data.data.item
                        const action = tasksActions.addTask({ task })
                        dispatch(action)
                        dispatch(appActions.setAppStatus({ status: "succeeded" }))
                    } else {
                        handleServerAppError(res.data, dispatch)
                    }
                })
                .catch((error:any) => {
                    handleServerNetworkError(error, dispatch)
                })
        }
export const updateTaskTC =
    (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType): AppThunk =>
        (dispatch, getState: () => AppRootType) => {
            const state = getState()
            const task = state.tasks[todolistId].find((t) => t.id === taskId)
            if (!task) {
                //throw new Error("task not found in the state");
                console.warn("task not found in the state")
                return
            }

            const apiModel: UpdateTaskModelType = {
                deadline: task.deadline,
                description: task.description,
                priority: task.priority,
                startDate: task.startDate,
                title: task.title,
                status: task.status,
                ...domainModel,
            }

            todolistsAPI
                .updateTask(todolistId, taskId, apiModel)
                .then((res) => {
                    if (res.data.resultCode === 0) {
                        const action = tasksActions.updateTask({ todolistId, taskId, model: domainModel })
                        dispatch(action)
                    } else {
                        handleServerAppError(res.data, dispatch)
                    }
                })
                .catch((error: any) => {
                    handleServerNetworkError(error, dispatch)
                })
        }

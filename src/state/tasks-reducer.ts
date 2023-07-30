import {createSlice} from "@reduxjs/toolkit"
import {
    AddTaskArgType, RemoveTaskArgType,
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistsAPI, UpdateTaskArgType,
    UpdateTaskModelType
} from "API/todolists-api"
import {appActions} from "state/app-reducer";
import {handleServerNetworkError} from "Utils";
import {todolistsActions} from "state/todolists-reducer";
import {createAppAsyncThunk} from "Utils";
import {handleServerAppError} from "Utils";


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
export const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[], todolistId: string }, string>(
    'tasks/fetchTasks',
    async (todolistId: string, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(appActions.setAppStatus({status: "loading"}))
            const res = await todolistsAPI.getTasks(todolistId)
            const tasks = res.data.items
            dispatch(appActions.setAppStatus({status: "succeeded"}))
            return {todolistId, tasks}
        } catch (error: any) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
        }
    })

export const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgType>(
    'tasks/addTask',
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(appActions.setAppStatus({status: "loading"}))
            const res = await todolistsAPI.createTask(arg.todolistId, arg.title)
            const task = res.data.data.item
            dispatch(appActions.setAppStatus({status: "succeeded"}))
            return {task}
        } catch (error: any) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
        }
    })


export const removeTask = createAppAsyncThunk< RemoveTaskArgType, RemoveTaskArgType>(
    'tasks/removeTask',
    async (arg, thunkAPI) => {
        const {dispatch, rejectWithValue} = thunkAPI
        try {
            dispatch(appActions.setAppStatus({status: "loading"}))
            const res = await todolistsAPI.deleteTask(arg.todolistId, arg.taskId)
            if (res.data.resultCode === 0) {
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
                return arg
            } else {
                handleServerAppError(res.data, dispatch);
                return rejectWithValue(null)
            }
        } catch (e) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }

    })

export const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>
('tasks/updateTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue, getState} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        const state = getState()
        const task = state.tasks[arg.todolistId].find(t => t.id === arg.taskId)
        if (!task) {
            dispatch(appActions.setAppError({error: 'Task not found'}))
            return rejectWithValue(null)
        }
        const apiModel: UpdateTaskModelType = {
            title: task.title,
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            status: task.status,
            ...arg.domainModel
        }

        const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel)
        if (res.data.resultCode === 0) {
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return arg
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

const slice = createSlice({
    name: "tasks",
    initialState: initialState,
    reducers: {
        // updateTask: (
        //     state,
        //     action: PayloadAction<{ todolistId: string; taskId: string; model: UpdateDomainTaskModelType }>,
        // ) => {
        //     const tasks = state[action.payload.todolistId]
        //     const index = tasks.findIndex((t) => t.id === action.payload.taskId)
        //     if (index !== -1) {
        //         tasks[index] = {...tasks[index], ...action.payload.model}
        //     }
        // },
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
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            // .addCase(fetchTasks.rejected, (state, action) => {
            //
            // })
            .addCase(addTask.fulfilled, (state, action) => {
                state[action.payload.task.todoListId].unshift(action.payload.task)
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex((t) => t.id === action.payload.taskId)
                if (index !== -1) tasks.splice(index, 1)
            })
            .addCase(updateTask.fulfilled,(state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex((t) => t.id === action.payload.taskId)
                if (index !== -1) {
                    tasks[index] = {...tasks[index], ...action.payload.domainModel}
                }
            })

    },
})
export const tasksReducer = slice.reducer
// export const {  } = slice.actions;
// export const tasksActions = slice.actions
export const tasksThunks = {fetchTasks, addTask, removeTask, updateTask}

// thunks


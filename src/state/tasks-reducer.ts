import {AddTodolistACType, RemoveTodolistACType, SetTodolistACType} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "../API/todolists-api";
import {AppRootType, AppThunk} from "./store";
//types
export type TasksACType =
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodolistACType
    | RemoveTodolistACType
    | SetTodolistACType
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}
const initialState: TasksStateType = {}
export const tasksReducer = (state: TasksStateType = initialState, action: TasksACType): TasksStateType => {
    switch (action.type) {
        case 'ADD-TASK':
            return {...state,[action.task.todoListId] : [action.task, ...state[action.task.todoListId]]}
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case 'UPDATE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)}
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
        case 'SET-TODOLISTS':
            let stateCopy = {...state}
            action.todolists.forEach(tl => {stateCopy[tl.id] = []})
            return stateCopy
        case 'SET-TASKS':
            return {...state,[action.todolistId]:action.tasks}
        case 'REMOVE-TODOLIST' : {
            const stateCopy = {...state}
            delete stateCopy[action.id]
            return stateCopy
        }
        default:
            return state
    }
};

//actions
export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task} as const)
export const removeTaskAC = (todolistId: string, taskId: string) => ({type: 'REMOVE-TASK', todolistId, taskId} as const)
export const updateTaskAC = (todolistId: string, taskId: string, model: UpdateDomainTaskModelType) =>
    ({type: 'UPDATE-TASK', todolistId, taskId, model} as const)
export const setTasksAC = (todolistId: string, tasks: Array<TaskType>) => ({type: 'SET-TASKS', todolistId, tasks} as const)

//thunks
export const fetchTasksTC = (todolistId: string): AppThunk => async dispatch => {
    const res = await todolistsAPI.getTasks(todolistId)
    dispatch(setTasksAC(todolistId, res.data.items))
}
export const addTaskTC = (todolistId: string, title: string): AppThunk => async dispatch => {
    try {
        const res = await todolistsAPI.createTask(todolistId, title)
        dispatch(addTaskAC(res.data.data.item))
    } catch (error: any) {
        throw new Error(error)
    }
}
export const removeTaskTC = (todolistId: string, taskId: string): AppThunk => (dispatch) => {
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(() => {
            const action = removeTaskAC(todolistId, taskId)
            dispatch(action)
        })
}
export const updateTaskTC = (todolistId: string,
                             taskId: string,
                             model: UpdateDomainTaskModelType): AppThunk => (dispatch, getState: () => AppRootType) => {
    const task = getState().tasks[todolistId].find(t => t.id === taskId)
    if (!task) {
        console.warn('task not found in the state')
        return
    }
    const apiModel: UpdateTaskModelType = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        ...model
    }
    todolistsAPI.updateTask(todolistId, taskId, apiModel)
        .then(() => {
            dispatch(updateTaskAC(todolistId, taskId, model))
        })
}


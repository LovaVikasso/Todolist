import {AddTodolistACType, RemoveTodolistACType, SetTodolistACType} from "./todolists-reducer";
import {TasksStateType} from "../App";
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from "../api/todolists-api";
import {AppRootType, AppThunk} from "./store";

export type AddTaskACType = { type: 'ADD-TASK', task: TaskType }
export type RemoveTaskACType = { type: 'REMOVE-TASK', todolistId: string, taskId: string }
export type UpdateTaskACType = { type: 'UPDATE-TASK', todolistId: string, taskId: string, model: UpdateDomainTaskModelType }
export type SetTaskACType = { type: 'SET-TASKS', todolistId: string, tasks: Array<TaskType> }
export type TasksACType =
    AddTaskACType
    | RemoveTaskACType
    | AddTodolistACType
    | RemoveTodolistACType
    | SetTodolistACType
    | SetTaskACType
    | UpdateTaskACType

const initialState: TasksStateType = {}
export const tasksReducer = (state: TasksStateType = initialState, action: TasksACType): TasksStateType => {
    switch (action.type) {
        case 'ADD-TASK': {
            const newTask: TaskType = action.task
            const stateCopy = {...state} //создаем копию
            const tasks = stateCopy[newTask.todoListId] //берем нужный нам массив по ключу (тудулист Id) из стейта
            stateCopy[newTask.todoListId] = [newTask, ...tasks] //меняем в копии по тому же ключу, доавляем в начало массива новую таску
            return stateCopy //
        }
        case 'REMOVE-TASK': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)
            }
        }
        case 'UPDATE-TASK': {
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        }
        case 'ADD-TODOLIST': {
            console.log('added todolist')
            return {
                ...state,
                [action.todolist.id]: []
            }
        }
        case 'SET-TODOLISTS': {
            let stateCopy = {...state}
            action.todolists.forEach(tl => {
                stateCopy[tl.id] = []
            })
            return stateCopy
        }
        case 'SET-TASKS': {
            const stateCopy = {...state}
            stateCopy[action.todolistId] = action.tasks
            return stateCopy
        }
        case 'REMOVE-TODOLIST' : {
            const stateCopy = {...state}
            delete stateCopy[action.todolistId]
            return stateCopy
        }
        default:
            return state
        //  throw new Error("I don't understand this action type")
    }
};
export const addTaskAC = (task: TaskType): AddTaskACType => {
    return {type: 'ADD-TASK', task} as const
}
export const removeTaskAC = (todolistId: string, taskId: string): RemoveTaskACType => {
    return {type: 'REMOVE-TASK', todolistId, taskId} as const
}
export const updateTaskAC = (todolistId: string, taskId: string, model: UpdateDomainTaskModelType): UpdateTaskACType => {
    return {type: 'UPDATE-TASK', todolistId, taskId, model} as const
}
export const setTasksAC = (todolistId: string, tasks: Array<TaskType>): SetTaskACType => {
    return {type: 'SET-TASKS', todolistId, tasks}
}
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
        .then((res) => {
            dispatch(updateTaskAC(todolistId, taskId, model))
        })
}

type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
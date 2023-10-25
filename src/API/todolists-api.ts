import  {AxiosResponse} from "axios";
import {
    CreateTask,
    GetTasksResponse,
    TaskType,
    TodolistType,
    UpdateTaskModelType,
    UpdateTodolistTitleArgType,
    ResponseType
} from "./types";
import {instance} from "API/instance";

export const todolistsAPI = {
    getTodolists() {
        return instance.get<TodolistType[]>("todo-lists");
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>,
            AxiosResponse<ResponseType<{ item: TodolistType }>>,
            { title: string }>("todo-lists", {title});
    },
    deleteTodolist(id: string) {
        return instance.delete<ResponseType>(`todo-lists/${id}`);
    },
    updateTodolist(arg: UpdateTodolistTitleArgType) {
        return instance.put<ResponseType, AxiosResponse<ResponseType>, { title: string }>(`todo-lists/${arg.id}`, {title: arg.title});
    },
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`);
    },
    createTask(arg: CreateTask) {
        return instance.post<ResponseType<{ item: TaskType }>,
            AxiosResponse<ResponseType<{ item: TaskType }>>,
            { title: string }>(`todo-lists/${arg.todolistId}/tasks`, {title: arg.title});
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<ResponseType<{ item: TaskType }>,
            AxiosResponse<ResponseType<{ item: TaskType }>>,
            UpdateTaskModelType>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
    },
};


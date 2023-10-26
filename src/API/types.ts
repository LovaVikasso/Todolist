export type CreateTask = {
    todolistId: string
    title: string
}
export type  FieldErrorType = {
    error: string
    field: string
}
export type BaseResponseType<D = {}> = {
    resultCode: number;
    messages: Array<string>;
    fieldsErrors: FieldErrorType
    data: D;
}
export type TodolistType = {
    id: string;
    title: string;
    addedDate: string;
    order: number;
};
// export type ResponseType<D = {}> = {
//     resultCode: number;
//     messages: Array<string>;
//     fieldsErrors: Array<string>;
//     data: D;
// };

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3,
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    High = 2,
    Urgently = 3,
    Later = 4,
}

export type TaskType = {
    description: string;
    title: string;
    status: TaskStatuses;
    priority: TaskPriorities;
    startDate: string;
    deadline: string;
    id: string;
    todoListId: string;
    order: number;
    addedDate: string;
};
export type UpdateTaskModelType = {
    title: string;
    description: string;
    status: TaskStatuses;
    priority: TaskPriorities;
    startDate: string;
    deadline: string;
};
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type GetTasksResponse = {
    error: string | null;
    totalCount: number;
    items: TaskType[];
};
export type LoginType = {
    email: string;
    password: string;
    rememberMe: boolean;
};

export type UserType = {
    id: number;
    email: string;
    login: string;
};

export type AddTaskArgType = {
    title: string
    todolistId: string
}

export type UpdateTaskArgType = {
    taskId: string,
    domainModel: UpdateDomainTaskModelType,
    todolistId: string
}

export type RemoveTaskArgType = {
    todolistId: string
    taskId: string
}

export type UpdateTodolistTitleArgType = {
    id: string
    title: string
}
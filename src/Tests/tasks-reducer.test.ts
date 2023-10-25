import {TaskPriorities, TaskStatuses} from "API/todolists-api";
import {tasksReducer, TasksStateType, tasksThunks} from "State/tasks-reducer";
import {todolistsThunks} from "State/todolists-reducer";


const startState: TasksStateType = {
    todolistId1: [
        {
            description: "",
            title: "Hello",
            status: TaskStatuses.New,
            priority: TaskPriorities.Low,
            startDate: "",
            deadline: "",
            id: "1",
            todoListId: "todolistId1",
            order: 1,
            addedDate: "",
        },
        {
            description: "",
            title: "Hi",
            status: TaskStatuses.New,
            priority: TaskPriorities.Low,
            startDate: "",
            deadline: "",
            id: "2",
            todoListId: "todolistId1",
            order: 2,
            addedDate: "",
        },
    ],
    todolistId2: [
        {
            description: "",
            title: "Hello",
            status: TaskStatuses.New,
            priority: TaskPriorities.Low,
            startDate: "",
            deadline: "",
            id: "3",
            todoListId: "todolistId2",
            order: 1,
            addedDate: "",
        },
        {
            description: "",
            title: "Hello",
            status: TaskStatuses.New,
            priority: TaskPriorities.Low,
            startDate: "",
            deadline: "",
            id: "4",
            todoListId: "todolistId2",
            order: 1,
            addedDate: "",
        },
    ],
};
test("correct task should be deleted from correct array", () => {
    const action = tasksThunks.removeTask.fulfilled({
        todolistId: "todolistId2",
        taskId: "4"
    }, "requestId", {todolistId: "todolistId2", taskId: "4"});

    const endState = tasksReducer(startState, action);

    expect(endState).toEqual({
        todolistId1: [
            {
                description: "",
                title: "Hello",
                status: TaskStatuses.New,
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                id: "1",
                todoListId: "todolistId1",
                order: 1,
                addedDate: "",
            },
            {
                description: "",
                title: "Hi",
                status: TaskStatuses.New,
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                id: "2",
                todoListId: "todolistId1",
                order: 2,
                addedDate: "",
            },
        ],
        todolistId2: [
            {
                description: "",
                title: "Hello",
                status: TaskStatuses.New,
                priority: TaskPriorities.Low,
                startDate: "",
                deadline: "",
                id: "3",
                todoListId: "todolistId2",
                order: 1,
                addedDate: "",
            },
        ],
    });
});
test("correct task should be added to correct array", () => {
    const action = tasksThunks.addTask.fulfilled({
        task: {
            description: "",
            title: "juice",
            status: TaskStatuses.New,
            priority: TaskPriorities.Low,
            startDate: "",
            deadline: "",
            id: "5",
            todoListId: "todolistId2",
            order: 1,
            addedDate: "",
        }
    }, "requestId", {todolistId: "todolistId2", title: "juice"});

    const endState = tasksReducer(startState, action);

    expect(endState["todolistId1"].length).toBe(2);
    expect(endState["todolistId2"].length).toBe(3);
    expect(endState["todolistId2"][0].id).toBeDefined();
    expect(endState["todolistId2"][0].title).toBe("juice");
    expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
});
test("status of specified task should be changed", () => {
    const action = tasksThunks.updateTask.fulfilled({
        todolistId: "todolistId2",
        taskId: "4",
        domainModel: {status: TaskStatuses.Completed}
    }, "requestId", {todolistId: "todolistId2",
        taskId: "4",
        domainModel: {status: TaskStatuses.Completed}});

    const endState = tasksReducer(startState, action);

    expect(endState["todolistId2"][1].status).toBe(TaskStatuses.Completed);
});
test("title of specified task should be changed", () => {
    const action = tasksThunks.updateTask.fulfilled({todolistId: "todolistId1", taskId: "2", domainModel: {title: "Changed"}}, "requestId", {todolistId: "todolistId1", taskId: "2", domainModel: {title: "Changed"}});

    const endState = tasksReducer(startState, action);

    expect(endState["todolistId1"][1].title).toBe("Changed");
    expect(endState["todolistId2"][1].title).toBe("Hello");
    expect(endState["todolistId2"].length).toBe(2);
});
test("new array should be added when new todolist is added", () => {
    const action = todolistsThunks.addTodolist.fulfilled({todolist: {id: "5", title: "New one", addedDate: "", order: 4}},  "requestId", "New one");

    const endState = tasksReducer(startState, action);

    const keys = Object.keys(endState);
    const newKey = keys.find((k) => k != "todolistId1" && k != "todolistId2");
    if (!newKey) {
        throw Error("new key should be added");
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});
test("property with todolistId should be deleted", () => {
    const action = todolistsThunks.removeTodolist.fulfilled({id: "todolistId2"}, "requestId", "todolistId2");
// type RemoveTodolistType = {
//     type: string
//     payload: {
//         id: string
//     }
// } для правильного создания action типпизируем
// const _action: RemoveTodolistType = {
//     type: todolistsThunks.removeTodolist.fulfilled.type,
//     payload: {
//         id: "todolistId2"
//     }
// } второй подход без requestId
    const endState = tasksReducer(startState, action);

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).not.toBeDefined();
});

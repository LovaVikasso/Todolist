import {TodolistDomainType, todolistsReducer, todolistsThunks} from "State/todolists-reducer";
import {tasksReducer, TasksStateType} from "State/tasks-reducer";

test("ids should be equals", () => {
    const startTasksState: TasksStateType = {};
    const startTodolistsState: Array<TodolistDomainType> = [];

    const action = todolistsThunks.addTodolist.fulfilled({
        todolist: {
            id: "3",
            title: "new todolist",
            addedDate: "",
            order: 4
        }
    }, 'requestId', "new todolist");

    const endTasksState = tasksReducer(startTasksState, action);
    const endTodolistsState = todolistsReducer(startTodolistsState, action);

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.payload.todolist.id);
    expect(idFromTodolists).toBe(action.payload.todolist.id);
});

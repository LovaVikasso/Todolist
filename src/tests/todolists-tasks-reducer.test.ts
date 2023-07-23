import {TodolistDomainType, todolistsActions, todolistsReducer} from "state/todolists-reducer";
import { tasksReducer, TasksStateType } from "state/tasks-reducer";

test("ids should be equals", () => {
  const startTasksState: TasksStateType = {};
  const startTodolistsState: Array<TodolistDomainType> = [];

  const action = todolistsActions.addTodolist({todolist: { id: "3", title: "new todolist", addedDate: "", order: 4 }});

  const endTasksState = tasksReducer(startTasksState, action);
  const endTodolistsState = todolistsReducer(startTodolistsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.payload.todolist.id);
  expect(idFromTodolists).toBe(action.payload.todolist.id);
});

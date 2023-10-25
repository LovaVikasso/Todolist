import {
  TodolistDomainType, todolistsActions,
  todolistsReducer, todolistsThunks,
} from "State/todolists-reducer";
import { v1 } from "uuid";

const startState: TodolistDomainType[] = [
  { id: "1", title: "What to learn", addedDate: "", order: 1, filter: "all", entityStatus: "idle" },
  { id: "2", title: "What to buy", addedDate: "", order: 2, filter: "completed", entityStatus: "idle" },
];

test("todolists reducer should add new todolist", () => {
  const action = todolistsThunks.addTodolist.fulfilled({todolist:{
    id: v1(),
    title: "Hello there",
    addedDate: "",
    order: 3,
  }}, 'requestId', "Hello there");
  const endState = todolistsReducer(startState, action);

  expect(endState[0].title).toBe("Hello there");
  expect(endState[0].filter).toBe("all");
});
test("todolists reducer should change todolist title", () => {
  const newTitle = "bla-bla";

  const action = todolistsThunks.changeTodolistTitle.fulfilled({id: "1", title: newTitle}, 'requestId', {id: "1", title: newTitle});
  const endState = todolistsReducer(startState, action);

  expect(endState[0].title).toBe(newTitle);
  expect(endState[1].title).toBe("What to buy");
});
test("todolists reducer should change todolist filter", () => {
  const action = todolistsActions.changeTodolistFilter({id: "1", filter:"active"});
  const endState = todolistsReducer(startState, action);

  expect(endState[0].filter).toBe("active");
  expect(endState[1].filter).toBe("completed");
});
test("todolists reducer should remove todolist", () => {
  const action = todolistsThunks.removeTodolist.fulfilled({id: "2"}, 'requestId', "2");
  const endState = todolistsReducer(startState, action);

  expect(endState[0].title).toBe("What to learn");
  expect(endState[2]).toBe(undefined);
});
test("todolists reducer should change todolist entity status", () => {
  const action = todolistsActions.changeTodolistEntityStatus({id: "1", entityStatus:"loading"});
  const endState = todolistsReducer(startState, action);

  expect(endState[0].entityStatus).toBe("loading");
  expect(endState[1].entityStatus).toBe("idle");
});

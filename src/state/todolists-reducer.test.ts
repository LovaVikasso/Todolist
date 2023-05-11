import {addTodolistAC, changeFilterAC, changeTitleAC, removeTodolistAC, todolistsReducer} from './todolists-reducer'
import {v1} from "uuid";
import {TodolistType} from "../App";


test('todolists reducer should add new todolist', () => {
    const startState: TodolistType[] = [
        {id: v1(), title: "What to learn", filter: 'all'},
        {id: v1(), title: "What to buy", filter: 'completed'},
    ]
    const newTitle = "New words"
    const action = addTodolistAC('3',newTitle)
    const endState = todolistsReducer(startState, action)

    expect(endState[0].title).toBe(newTitle);
    expect(endState[0].filter).toBe('all');
    expect(endState[2].filter).toBe('completed');
});
test('todolists reducer should change todolist title', () => {
    const startState: TodolistType[] = [
        {id: "abc", title: "What to learn", filter: 'all'},
        {id: v1(), title: "What to buy", filter: 'completed'},
    ]
    const newTitle = "bla-bla"

    const action = changeTitleAC('abc', newTitle)
    const endState = todolistsReducer(startState, action)

    expect(endState[0].title).toBe(newTitle);
    expect(endState[1].title).toBe("What to buy");
});
test('todolists reducer should change todolist filter', () => {
    const startState: TodolistType[] = [
        {id: "abc", title: "What to learn", filter: 'all'},
        {id: v1(), title: "What to buy", filter: 'completed'},
    ]
    const action = changeFilterAC('abc', "active")
    const endState = todolistsReducer(startState, action)

    expect(endState[0].filter).toBe('active');
    expect(endState[1].filter).toBe('completed');
});
test('todolists reducer should remove todolist', () => {
    const startState: TodolistType[] = [
        {id: v1(), title: "What to learn", filter: 'all'},
        {id: v1(), title: "What to buy", filter: 'completed'},
        {id: "newId", title: "bla-bla", filter: 'all'},
    ]
    const action = removeTodolistAC('newId')
    const endState = todolistsReducer(startState, action)

    expect(endState[0].title).toBe("What to learn");
    expect(endState[2]).toBe(undefined);
});

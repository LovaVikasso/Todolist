import {todolistsReducer} from './todolists-reducer'
import {v1} from "uuid";


test('todolists reducer should add new todolist', () => {
    const startState: TodolistType[] = [
        {id: v1(), title: "What to learn", filter: 'all'},
        {id: v1(), title: "What to buy", filter: 'completed'},
    ]
    const newTitle = "New words"
    const endState = todolistsReducer(startState, {type: 'ADD-TODOLIST', title: newTitle})

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


    const endState = todolistsReducer(startState, {
        type: 'CHANGE-TITLE',
        todolistId: "abc",
        title: newTitle
    })

    expect(endState[0].title).toBe(newTitle);
    expect(endState[1].title).toBe("What to buy");
});
test('todolists reducer should change todolist filter', () => {
    const startState: TodolistType[] = [
        {id: "abc", title: "What to learn", filter: 'all'},
        {id: v1(), title: "What to buy", filter: 'completed'},
    ]

    const endState = todolistsReducer(startState, {
        type: 'CHANGE-FILTER',
        todolistId: 'abc',
        value: 'active'
    })

    expect(endState[0].filter).toBe('active');
    expect(endState[1].filter).toBe('completed');
});
test('todolists reducer should remove todolist', () => {
    const startState: TodolistType[] = [
        {id: v1(), title: "What to learn", filter: 'all'},
        {id: v1(), title: "What to buy", filter: 'completed'},
        {id: "newId", title: "bla-bla", filter: 'all'},
    ]
    const endState = todolistsReducer(startState, {type: 'REMOVE-TODOLIST', todolistId: "newId"})

    expect(endState[0].title).toBe("What to learn");
    expect(endState[2]).toBe(undefined);
});

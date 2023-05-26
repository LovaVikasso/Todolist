import {
    addTodolistAC,
    changeFilterAC,
    changeTitleAC,
    removeTodolistAC, TodolistDomainType,
    todolistsReducer
} from '../state/todolists-reducer'
import {v1} from "uuid";


const startState: TodolistDomainType[] = [
    {id: '1', title: "What to learn", addedDate: '', order: 1, filter: 'all'},
    {id: '2', title: "What to buy", addedDate: '', order: 2, filter: 'completed'},
]

test('todolists reducer should add new todolist', () => {

    const action = addTodolistAC({
        id: v1(),
        title: "Hello there",
        addedDate: '',
        order: 3
    })
    const endState = todolistsReducer(startState, action)

    expect(endState[0].title).toBe('Hello there');
    expect(endState[0].filter).toBe('all');
});
test('todolists reducer should change todolist title', () => {

    const newTitle = "bla-bla"

    const action = changeTitleAC('1', newTitle)
    const endState = todolistsReducer(startState, action)

    expect(endState[0].title).toBe(newTitle);
    expect(endState[1].title).toBe("What to buy");
});
test('todolists reducer should change todolist filter', () => {

    const action = changeFilterAC('1', "active")
    const endState = todolistsReducer(startState, action)

    expect(endState[0].filter).toBe('active');
    expect(endState[1].filter).toBe('completed');
});
test('todolists reducer should remove todolist', () => {

    const action = removeTodolistAC('2')
    const endState = todolistsReducer(startState, action)

    expect(endState[0].title).toBe("What to learn");
    expect(endState[2]).toBe(undefined);
});

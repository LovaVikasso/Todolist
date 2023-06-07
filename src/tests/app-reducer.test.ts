import {appReducer, InitialType, setErrorAC, setStatusAC} from "../state/app-reducer";

let startState: InitialType
beforeEach(() => {
    startState = {
        status: 'idle',
        error: null
    }
})

test('correct error message should be set', () => {

    const action = setErrorAC('some error')
    const endState = appReducer(startState, action)

    expect(endState.error).toBe('some error');

});
test('correct status should be set', () => {

    const action = setStatusAC('loading')
    const endState = appReducer(startState, action)

    expect(endState.status).toBe('loading');

});



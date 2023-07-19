import {appReducer, InitialType, SetAppErrorAC, setAppStatusAC} from "../state/app-reducer";

let startState: InitialType
beforeEach(() => {
    startState = {
        status: 'idle',
        error: null,
        isInitialized:false
    }
})

test('correct error message should be set', () => {

    const action = SetAppErrorAC('some error')
    const endState = appReducer(startState, action)

    expect(endState.error).toBe('some error');

});
test('correct status should be set', () => {

    const action = setAppStatusAC('loading')
    const endState = appReducer(startState, action)

    expect(endState.status).toBe('loading');

});



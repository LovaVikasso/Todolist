import {appActions, appReducer, InitialType} from "state/app-reducer";

let startState: InitialType;
beforeEach(() => {
  startState = {
    status: "idle",
    error: null,
    isInitialized: false,
  };
});

test("correct error message should be set", () => {
  const action = appActions.setAppError({error:"some error"});
  const endState = appReducer(startState, action);

  expect(endState.error).toBe("some error");
});
test("correct status should be set", () => {
  const action = appActions.setAppStatus({status:"loading"});
  const endState = appReducer(startState, action);

  expect(endState.status).toBe("loading");
});

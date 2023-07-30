import {ResponseType} from "API/todolists-api";
import {Dispatch} from "redux";
import {appActions} from "state/app-reducer";

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(appActions.setAppError({error: data.messages[0]}));
    } else {
        dispatch(appActions.setAppError({error: "Some error occurred"}));
    }
    dispatch(appActions.setAppStatus({status: "failed"}));
};
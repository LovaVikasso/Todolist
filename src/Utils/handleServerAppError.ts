import {BaseResponseType} from "API/types";
import {Dispatch} from "redux";
import {appActions} from "State/app-reducer";

export const handleServerAppError = <T>(data: BaseResponseType<T>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(appActions.setAppError({error: data.messages[0]}));
    } else {
        dispatch(appActions.setAppError({error: "Some error occurred"}));
    }
    dispatch(appActions.setAppStatus({status: "failed"}));
};

import { Dispatch } from "redux";
import { ResponseType } from "API/todolists-api";
import {appActions} from "state/app-reducer";

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch:Dispatch) => {
  if (data.messages.length) {
    dispatch(appActions.setAppError({error: data.messages[0]}));
  } else {
    dispatch(appActions.setAppError({error:"Some error occurred"}));
  }
  dispatch(appActions.setAppStatus({status:"failed"}));
};

export const handleServerNetworkError = (error: { message: string |null}, dispatch:Dispatch) => {
  dispatch(appActions.setAppError({ error: error.message ? error.message : "Some error occurred" }));
  dispatch(appActions.setAppStatus({status:"failed"}));
};


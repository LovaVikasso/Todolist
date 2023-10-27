import {BaseResponseType} from "API/types";
import {Dispatch} from "redux";
import {appActions} from "State/app-reducer";

/**
 * обработка ошибок, полученных от сервера
 * @param data ответ от сервера, содержащий онфо об ошибках и другие данные (типизированный)
 * @param dispatch функция для отправки действие в Redux
 * @param showError флаг, отображающий нужно ли отображать сооющение об ошибке для пользователя, true по умолчанию
 * @returns void ничего не возвращает
 */
export const handleServerAppError = <T>(data: BaseResponseType<T>, dispatch: Dispatch, showError: boolean = true) => {
    if (showError) {
        dispatch(appActions.setAppError({error: data.messages.length ? data.messages[0] : "Some error occurred" }))
    }
    dispatch(appActions.setAppStatus({status: "failed"}));
};
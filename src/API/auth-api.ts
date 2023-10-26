import { AxiosResponse } from "axios";
import { instance } from "API/instance";
import {LoginType, UserType, BaseResponseType} from "API/types";

export const authAPI = {
    login(data: LoginType) {
        return instance.post<BaseResponseType<{ id?: number }>, AxiosResponse<BaseResponseType<{ id: number }>>, LoginType>(
            "auth/login",
            data,
        );
    },
    logout() {
        return instance.delete<BaseResponseType<{ id?: number }>>("auth/login");
    },
    me() {
        return instance.get<BaseResponseType<UserType>>("auth/me");
    },
};
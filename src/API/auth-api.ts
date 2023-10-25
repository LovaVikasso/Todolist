import { AxiosResponse } from "axios";
import { instance } from "API/instance";
import {LoginType, UserType, ResponseType} from "API/types";

export const authAPI = {
    login(data: LoginType) {
        return instance.post<ResponseType<{ id?: number }>, AxiosResponse<ResponseType<{ id: number }>>, LoginType>(
            "auth/login",
            data,
        );
    },
    logout() {
        return instance.delete<ResponseType<{ id?: number }>>("auth/login");
    },
    me() {
        return instance.get<ResponseType<UserType>>("auth/me");
    },
};
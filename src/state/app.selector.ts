import {AppRootType} from "state/store";

export const selectAppStatus = (state: AppRootType) => state.app.status
export const selectAppError = (state: AppRootType) => state.app.error
export const selectIiInitialized = (state: AppRootType) => state.app.isInitialized
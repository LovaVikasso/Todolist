import {AppRootType} from "State/store";

export const selectIsLoggedIn = (state: AppRootType) => state.auth.isLoggedIn
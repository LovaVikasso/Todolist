import {AppRootType} from "state/store";

export const selectIsLoggedIn = (state: AppRootType) => state.auth.isLoggedIn
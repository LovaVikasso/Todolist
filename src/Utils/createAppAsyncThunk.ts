
import { createAsyncThunk } from '@reduxjs/toolkit';
import {AppDispatchType, AppRootType} from "state/store";
import {ResponseType} from "API/todolists-api";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: AppRootType
    dispatch: AppDispatchType
    rejectValue: null | ResponseType
}>()


import { createAsyncThunk } from '@reduxjs/toolkit';
import {AppDispatchType, AppRootType} from "State/store";
import {BaseResponseType} from "API/types";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: AppRootType
    dispatch: AppDispatchType
    rejectValue: null | BaseResponseType
}>()

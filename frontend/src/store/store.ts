import {configureStore} from "@reduxjs/toolkit";
import {authApi} from "@/store/endpoints/authApi";
import authReducer from '@/store/slice/authSlice'


export const store = configureStore({
    reducer:{
        auth: authReducer,

    [authApi.reducerPath]:authApi.reducer,

    },
    middleware:(getDefaultMiddleware)=>
        getDefaultMiddleware()
            .concat(authApi.middleware)

})

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
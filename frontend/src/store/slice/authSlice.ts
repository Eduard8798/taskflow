
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type {
    AuthState,
    UserProfilesResponse,
} from '@/features/types/types';

const initialState: AuthState = {
    isAuth: false,
    isAuthChecking: true,
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,

    reducers: {
        loginSuccess(state) {
            state.isAuth = true;
            state.isAuthChecking = false;
        },

        setUser(
            state,
            action: PayloadAction<UserProfilesResponse>,
        ) {
            state.user = action.payload;
        },

        authCheckFinished(state) {
            state.isAuthChecking = false;
        },

        logout(state) {
            state.isAuth = false;
            state.isAuthChecking = false;
            state.user = null;
        },
    },
});

export const {
    loginSuccess,
    setUser,
    authCheckFinished,
    logout,
} = authSlice.actions;

export default authSlice.reducer;

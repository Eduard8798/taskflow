
import {
    createApi,
    fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

import type {
    LoginRequest,
    LoginResponse,
    UserProfilesResponse,
} from '@/features/types/types';

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,

    prepareHeaders: (headers) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
        }

        return headers;
    },
});

export const authApi = createApi({
    reducerPath: 'authApi',

    baseQuery,

    tagTypes: ['Tasks'],

    endpoints: (build) => ({
        login: build.mutation<LoginResponse, LoginRequest>({
            query: (data) => ({
                url: '/auth/login',
                method: 'POST',
                body: data,
            }),
        }),

        register: build.mutation<LoginResponse, LoginRequest>({
            query: (data) => ({
                url: '/auth/register',
                method: 'POST',
                body: data,
            }),
        }),

        getMe: build.query<UserProfilesResponse, void>({
            query: () => ({
                url: '/auth/me',
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetMeQuery,
    useLazyGetMeQuery,
} = authApi;

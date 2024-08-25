import { createApi } from '@reduxjs/toolkit/query/react';
import { protectedBaseQuery } from '../endpoints';
import { IAuth, IAuthResponse } from '../../interfaces';

export const authService = createApi({
    reducerPath: 'authService',
    baseQuery: protectedBaseQuery,
    endpoints: (builder) => ({
        login: builder.mutation<IAuthResponse, IAuth>({
            query: (payload) => ({
                url: "auth/login",
                method: "POST",
                body: payload,
            })
        }),

        profile: builder.query<IAuthResponse, undefined>({
            query: (search) => ({
                url: "user/login",
                method: "GET",
                params: search,
            })
        })
    }),
});

export const { useLoginMutation } = authService;
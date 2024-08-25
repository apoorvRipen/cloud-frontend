import { createApi } from '@reduxjs/toolkit/query/react';
import { protectedBaseQuery, USER } from '../endpoints';
import { IAuthResponse } from '../../interfaces';

export const userService = createApi({
    reducerPath: 'userService',
    baseQuery: protectedBaseQuery,
    endpoints: (builder) => ({
        profile: builder.query<IAuthResponse, object>({
            query: () => ({
                url:  USER + "/profile",
                method: "GET",
            })
        })
    }),
});

export const { useLazyProfileQuery } = userService;
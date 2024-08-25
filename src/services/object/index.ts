import { createApi } from '@reduxjs/toolkit/query/react';
import { protectedBaseQuery, OBJECT } from '../endpoints';
import { IExportResponse, IExportResponses, IObjectResponse, IObjectsResponse } from '../../interfaces';

export const objectService = createApi({
    reducerPath: 'objobjectSctService',
    tagTypes: ["addFile"],
    baseQuery: protectedBaseQuery,
    endpoints: (builder) => ({
        addFolder: builder.mutation<IObjectResponse, object>({
            query: (payload) => ({
                url: OBJECT + "/folder",
                method: "POST",
                body: payload
            }),
            invalidatesTags: ["addFile"]
        }),

        addObject: builder.mutation<IObjectResponse, object>({
            query: (payload) => ({
                url: OBJECT,
                method: "POST",
                body: payload
            }),
            invalidatesTags: ["addFile"]
        }),

        removeObject: builder.mutation<IObjectResponse, object>({
            query: (payload) => ({
                url: OBJECT,
                method: "DELETE",
                body: payload
            }),
            invalidatesTags: ["addFile"]
        }),

        object: builder.query<IObjectResponse, object>({
            query: (search) => ({
                url: OBJECT,
                method: "GET",
                params: search
            })
        }),

        export: builder.mutation<IExportResponse, object>({
            query: (payload) => ({
                url: OBJECT + "/export",
                method: "POST",
                body: payload
            })
        }),

        exportProgress: builder.query<IExportResponses, object>({
            query: (search) => ({
                url: OBJECT + "/export-progress",
                method: "GET",
                params: search
            })
        }),

        exportZip: builder.query<IExportResponse, object>({
            query: (search) => ({
                url: OBJECT + "/export-zip",
                method: "GET",
                params: search
            })
        }),

        objects: builder.query<IObjectsResponse, object>({
            query: (search) => ({
                url: OBJECT + "/list",
                method: "GET",
                params: search
            }),
            providesTags: ["addFile"]
        })
    }),
});

export const {
    useLazyObjectQuery,
    useObjectsQuery,
    useLazyExportProgressQuery,
    useLazyExportZipQuery,
    useAddObjectMutation,
    useAddFolderMutation,
    useRemoveObjectMutation,
    useExportMutation
} = objectService;
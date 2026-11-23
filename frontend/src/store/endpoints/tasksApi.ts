
import { authApi } from './authApi';

import type {
    ITask,
    ICreateTask,
    IUpdateTask,
} from '../../features/types/types';

export const tasksApi = authApi.injectEndpoints({
    endpoints: (build) => ({
        getTasks: build.query<ITask[], void>({
            query: () => ({
                url: '/tasks',
                method: 'GET',
            }),
            providesTags: ['Tasks'],
        }),

        createTask: build.mutation<ITask, ICreateTask>({
            query: (body) => ({
                url: '/tasks',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Tasks'],
        }),

        updateTask: build.mutation<ITask, IUpdateTask>({
            query: ({ id, body }) => ({
                url: `/tasks/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Tasks'],
        }),

        deleteTask: build.mutation<void, string>({
            query: (id) => ({
                url: `/tasks/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Tasks'],
        }),
    }),
});

export const {
    useGetTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
} = tasksApi;

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { GenericPaginatedResponse } from "../types/GenericResponse.type";
import { Users, UpdateUserResponse, UpdateUserPayload, DeleteUserResponse, CreateUserResponse, CreateUserPayload } from "../types/user.type";

export const usersApi = createApi({
    reducerPath: "usersApi",
    baseQuery: baseQueryWithReauth("/"),
    tagTypes: ["Users"],
    endpoints: (builder) => ({
        getAllUsers: builder.query<
            GenericPaginatedResponse<Users>,
            { params: { page: number; per_page: number } }
        >({
            query: ({ params }) => ({
                url: "get/user",
                method: "POST",
                params,
                body: {
                    query: {
                        filter: [
                            {
                                field: "status",
                                function: "match",
                                value: "Active",
                                operator: "AND",
                            },
                        ],
                        sort: [
                            {
                                field: "updatedOn",
                                order: "desc",
                            },
                        ],
                    },
                },
            }),
            providesTags: ["Users"],
        }),
        createUser: builder.mutation<CreateUserResponse, CreateUserPayload>({
            query: (data) => {
                const requestData = {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    assignedRole: data.assignedRole,
                    password: data.password
                };
                
                return {
                    url: "/auth/signup",
                    method: "POST",
                    body: requestData
                };
            },
            invalidatesTags:["Users"]
        }),
        updateUser: builder.mutation<
        UpdateUserResponse,
        {id: string, data: UpdateUserPayload}
        >({
            query: ({ data, id }) => ({
                url: `/users/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Users"],
        }),
        deleteUser: builder.mutation<DeleteUserResponse, string>({
            query: (id) => ({
                url: `/users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Users"],
        }),
    }),
});

export const { 
    useLazyGetAllUsersQuery, 
    useCreateUserMutation, 
    useUpdateUserMutation, 
    useDeleteUserMutation 
} = usersApi;

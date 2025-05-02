import { createApi } from '@reduxjs/toolkit/query/react';
// import { MODULES } from '../lib/enums/modules';
// import { generateModulePermissions } from '../lib/permissions';
import { baseQueryWithReauth } from './baseQuery';
import { CreateRoleType, GetEditRoleResponse, Roles, RolesDeleteResponse, SelfRolesAPIResult } from '../types/roles.type';
import { GenericPaginatedResponse } from '../types/GenericResponse.type';
export const rolesAPI = createApi({
  reducerPath: 'rolesAPI',
  baseQuery: baseQueryWithReauth('/'),
  tagTypes: ['Role'],
  endpoints: (builder) => ({
    selfRoles: builder.query<SelfRolesAPIResult, void>({
      query: () => ({
        url: "/users-permissions",
        method: "GET"
      }),
      providesTags: ['Role'],
    }),
    getAllRoles: builder.query<
      GenericPaginatedResponse<Roles>,
      { params: { page: number; per_page: number, sort: string, order: string } }
    >({
      query: ({ params }) => ({
        url: "get/roles",
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
      providesTags: ["Role"]
    }),
    deleteRoles: builder.mutation<
      RolesDeleteResponse,
      string
    >({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Role"]
    }),
    createRole: builder.mutation<unknown, CreateRoleType>({
      query: (body) => ({
        url: 'roles', // Changed '/api/role' to 'role'
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Role'],
    }), 
    editRole: builder.mutation<unknown,{ id?: string } & CreateRoleType>({
    query: ({ id, ...body }) => ({
      url: `roles/${id}`, 
      method: 'PUT',
      body,
    }),
    invalidatesTags: ['Role'],
  }),
  getRoleByID:builder.mutation<GetEditRoleResponse,string>({
    query:(id)=>({
      url:`get/roles/${id}`,
      method:'GET',
    }),
  }),
  }),
});

export const {
  useSelfRolesQuery,
  useLazyGetAllRolesQuery,
  useDeleteRolesMutation,
  useCreateRoleMutation,
  useGetRoleByIDMutation,
  useEditRoleMutation,


} = rolesAPI;

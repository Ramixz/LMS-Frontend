import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { GenericPaginatedResponse } from "../types/GenericResponse.type";
import { createDashboardResponse, Dashboard, DashboardPayload, DeleteDashboardResponse, GetAllDashboardResponse, GetVisualizationsQuery, UpdateDashboardResponse } from "../types/Dashboard.type";

export const dashboardAPI = createApi({
  reducerPath: "dashboardAPI",
  baseQuery: baseQueryWithReauth(""),
  tagTypes: ["allDashboards" , 'DASHBOARDBYID'],
  endpoints: (builder) => ({
    getAllDashboards: builder.query<
      GenericPaginatedResponse<Dashboard>,
      { params: { page?: number; per_page?: number } }
    >({
      query: ({ params }) => ({
        url: `/get/dashboard`,
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

      keepUnusedDataFor: 5,
      providesTags: ["allDashboards"]
    }),

    deleteDashboard: builder.mutation<
      DeleteDashboardResponse,
      string
    >({
      query: (dashboardId) => ({
        url: `/dashboards/${dashboardId}`,
        method: "DELETE",

      }),

      invalidatesTags: ["allDashboards"]
    }),

    editDashboard: builder.mutation<
      UpdateDashboardResponse,
      { dashboardId: string; payload: DashboardPayload }
    >({
      query: ({ dashboardId, payload }) => ({
        url: `/dashboards/${dashboardId}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["allDashboards"],
    }),

    createDashboard: builder.mutation<
      createDashboardResponse,
      DashboardPayload
    >({
      query: (payload) => ({
        url: `/dashboards`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["allDashboards"],
    }),

    getElasticQueryResponse: builder.query({
      query: (queryBody) => {
        return {
          url: `/elastic/search`,
          method: 'POST',
          body: queryBody,
        };
      },
    }),

    
    getVisualizationsFromDashboard: builder.query<
    GetAllDashboardResponse,
    GetVisualizationsQuery
  >({
    query: ({ id }) => ({
      url: `/get/dashboard/${id}`,
      method: 'GET',
    }),
    providesTags: ['DASHBOARDBYID'],
  }),
  }),
});


export const {
  useLazyGetAllDashboardsQuery,
  useDeleteDashboardMutation,
  useEditDashboardMutation,
  useCreateDashboardMutation,
  useLazyGetElasticQueryResponseQuery,
  useGetVisualizationsFromDashboardQuery,
  useLazyGetVisualizationsFromDashboardQuery,
} = dashboardAPI;
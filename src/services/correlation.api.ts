import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { GenericPaginatedResponse } from "../types/GenericResponse.type";
import { Correlation, CorrelationDeleteResponse } from "../types/Correlation.type";
import { ConnectorsType, CreateConnectorResponseType } from "../types/connector.type";

export const correlationAPI = createApi({
  reducerPath: "correlationAPI",
  baseQuery: baseQueryWithReauth(""),
  tagTypes: ["allCorrelations"],
  endpoints: (builder) => ({
    getAllCorrelation: builder.query<
      GenericPaginatedResponse<Correlation>,
      { params: { page: number; per_page: number } }
    >({
      query: ({ params }) => ({
        url: `/get/correlation`,
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
      providesTags: ["allCorrelations"]
    }),

    deleteCorrelation: builder.mutation<
      CorrelationDeleteResponse,
      string
    >({
      query: (correlationId) => ({
        url: `/delete-correlation/${correlationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ['allCorrelations']
    }),
    createCorrelation: builder.mutation<CreateConnectorResponseType, ConnectorsType>({
      query: (body) => ({
        url: '/create/correlation',
        method: 'POST',
        body,
      }),
    }),
    getCronjobCorrelation: builder.query({
      query: (id) => ({
        url: `/correlation/cron-job/${id}`,
        method: 'GET',
      }),
    }), 
    fetchDatasets: builder.query({
      query: () => ({
        url: '/fetch-datasets',
        method: 'GET',
      }),
    }),
    getCorrelationSchedulerTrigger: builder.mutation({
      query: (id) => ({
        url: `/correlation/scheduler-trigger/${id}`,
        method: 'GET',
      }),
    }),
  }),
});


export const {
  useLazyGetAllCorrelationQuery,
  useDeleteCorrelationMutation,
  useLazyFetchDatasetsQuery,
  useLazyGetCronjobCorrelationQuery,
  useCreateCorrelationMutation,
  useGetCorrelationSchedulerTriggerMutation
} = correlationAPI;
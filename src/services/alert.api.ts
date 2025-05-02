import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { GenericPaginatedResponse } from "../types/GenericResponse.type";
import { AlertPreviewResponse, AllAlert, cronStatusResponse, GetFieldFilterQuery, GetFieldFilterType, Job, ToggleCronStatusRequest } from "../types/alert.type";

export const jobsAPI = createApi({
  reducerPath: "jobsAPI",
  baseQuery: baseQueryWithReauth("/"),
  tagTypes: ["AllJobs"],
  endpoints: (builder) => ({
    getAllJobs: builder.query<
      GenericPaginatedResponse<Job>,
      { params: { page: number; per_page: number } }
    >({
      query: ({ params }) => ({
        url: `/get/job`,
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
      providesTags: ["AllJobs"],
    }),
    getFieldFilter: builder.query<GetFieldFilterType, GetFieldFilterQuery>({
      query: (pattern) => {
        return {
          url: `/elastic/getfield?pattern=${pattern}`,
          method: "GET"
        };
      },
    }),

    getAllAlerts: builder.query<
      GenericPaginatedResponse<AllAlert>,
      { params: { page: number; per_page: number } }
    >({
      query: ({ params }) => ({
        url: `/get/alertAudit`,
        method: "POST",
        params,
        body: {
          query: {
            filter: [
              {
                field: "alertStatus",
                function: "match",
                value: "OPEN",
                operator: "OR",
              },
              {
                field: "alertStatus",
                function: "match",
                value: "PAUSED",
                operator: "OR",
              },
              {
                field: "alertStatus",
                function: "match",
                value: "CLOSED",
                operator: "OR",
              },
            ],
            sort: [
              {
                field: "postedOn",
                order: "desc",
              },
            ],
          },
        },
      }),
    }),

    toggleCronStatus: builder.mutation<
      cronStatusResponse,
      ToggleCronStatusRequest
    >({
      query: ({ jobId, status }) => ({
        url: `/alert/cron/job/${jobId}?status=${status}`,
        method: "GET",
      }),
      invalidatesTags: ["AllJobs"],
    }),

    alertPreview: builder.query<
      AlertPreviewResponse,
      string
    >({
      query: (jobId) => ({
        url: `/job/preview/${jobId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLazyGetAllJobsQuery,
  useLazyGetAllAlertsQuery,useLazyGetFieldFilterQuery,
  useToggleCronStatusMutation,
  useLazyAlertPreviewQuery,
} = jobsAPI;

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { ReportPaginatedResponse, Report, CreateReportResponse, CreateReportRequest, cronStatusResponse, ToggleCronStatusRequest, DeleteReportResponse, ReportsInstantTriggerResponse } from "../types/report.type";

export const reportsAPI = createApi({
  reducerPath: "reportsAPI",
  baseQuery: baseQueryWithReauth("/"),
  tagTypes: ["allReports"],
  endpoints: (builder) => ({
    getAllReports: builder.query<
      ReportPaginatedResponse<Report>,
      { params: { page: number; per_page: number } }
    >({
      query: ({ params }) => ({
        url: `/reports`,
        method: "GET",
        params,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["allReports"],
    }),

    createReport: builder.mutation<
      CreateReportResponse,
      CreateReportRequest
    >({
      query: (reportData) => ({
        url: `/report`,
        method: "POST",
        body: reportData,
      }),
      invalidatesTags: ["allReports"],
    }),

    toggleCronStatus: builder.mutation<
      cronStatusResponse,
      ToggleCronStatusRequest
    >({
      query: ({ reportId, status }) => ({
        url: `/report/cron/job/${reportId}?status=${status}`,
        method: "GET",
      }),
      invalidatesTags: ["allReports"],
    }),

    deleteReport: builder.mutation<
      DeleteReportResponse,
      string
    >({
      query: (reportId) => ({
        url: `/reports/${reportId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["allReports"],
    }),

    reportsInstantTrigger: builder.mutation<
    ReportsInstantTriggerResponse,
    string
    >({
      query: (reportId) => ({
        url: `/report/instant/trigger/${reportId}`,
        method: "GET"
      })
    }),
    getReportByID:builder.mutation({
      query:(id)=>({
        url:`reports/${id}`,
        method:'GET',
      }),
    }),
       // update report 
       updateReport: builder.mutation({
        query: ({data,id}) => {
          return {
            url: `/reports/${id}`,
            method: "PUT",
            body: data,
          };
        },
      }),
      // cron status
      updateSchedulerReportStatus: builder.mutation({
        query: ({ id, status }) => ({
          url: `/report/cron/job/${id}`,
          method: 'GET',
          params: { status },
        }),
      }),
  }),
});

export const {
  useLazyGetAllReportsQuery,
  useCreateReportMutation,
  useToggleCronStatusMutation,
  useDeleteReportMutation,
  useReportsInstantTriggerMutation,
  useGetReportByIDMutation,
  useUpdateSchedulerReportStatusMutation,
  useUpdateReportMutation
} = reportsAPI;

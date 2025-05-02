// src/services/leads.api.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

// Generic response type
export interface GenericResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorMessage?: string | null;
  total_items:number;
}

export interface Lead {
  _id: string;
  aadhaar_no: string;
  pan_no: string;
  last_name: string;
  address?: string;
  email: string;
  contact: string;
  createdOn?: string;
}

export const leadsApi = createApi({
  reducerPath: "leadsApi",
  baseQuery: baseQueryWithReauth("/"),
  tagTypes: ["Leads"],
  endpoints: (builder) => ({
    getAllLeads: builder.query<GenericResponse<Lead[]>, {
      params: {
        page: number;
        per_page: number;
        sort?: string;
        order?: 'asc' | 'desc';
      }
    }>({
      query: ({ params }) => ({
        url: "leads",
        method: "GET",
        params: {
          skip: params.page * params.per_page,
          limit: params.per_page,
          sort: params.sort,
          order: params.order
        }
      }),
      providesTags: ["Leads"],
    }),
    createLead: builder.mutation<GenericResponse<Lead>, Omit<Lead, "_id" | "createdOn">>({
      query: (data) => ({
        url: "leads",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Leads"]
    }),
    updateLead: builder.mutation<GenericResponse<Lead>, { id: string; data: Partial<Lead> }>({
      query: ({ id, data }) => ({
        url: `leads/${id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["Leads"]
    }),
    deleteLead: builder.mutation<GenericResponse<null>, string>({
      query: (id) => ({
        url: `leads/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Leads"]
    }),
  }),
});

export const {
  useLazyGetAllLeadsQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation
} = leadsApi;

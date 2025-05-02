import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { GenericPaginatedResponse } from "../types/GenericResponse.type";
import { CreateChannelRequest, CreateChannelResponse, DeleteChannelResponse, EditChannelRequest, EmailModule, QueryBody } from "../types/channel.type";

export const channelsApi = createApi({
  reducerPath: "channelsApi",
  baseQuery: baseQueryWithReauth("/"),
  tagTypes: ["AllChannels"],
  endpoints: (builder) => ({
    getAllNotificationChannels: builder.query<
      GenericPaginatedResponse<EmailModule>,
      { params: { page?: number; per_page?: number , order? : number, sort? : string } ,module_type?:string}
    >({
      query: ({ params ,module_type}) => ({
        url: `get/notificationChannel`,
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
              {
                field: "module",
                function: "match",
                value: module_type,
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
      providesTags:["AllChannels"]
    }),
    getAllChannels: builder.query<
  GenericPaginatedResponse<EmailModule>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params: { page?: number; per_page?: number; order?: number; sort?: string }; body?: QueryBody }
>({
  query: ({ params, body }) => ({
    url: `get/notificationChannel`,
    method: "POST",
    params,
    body, // Pass the body dynamically from the module
  }),
  providesTags: ["AllChannels"],
}),
    createChannel:builder.mutation<
    CreateChannelResponse,
    CreateChannelRequest
    >({
      query:(newChannel)=>({
        url:"/notificationChannel",
        method:"POST",
        body:newChannel
      }),
      invalidatesTags:["AllChannels"]
    }),
    editChannel:builder.mutation<
    CreateChannelResponse,
    EditChannelRequest
    >({
      query: ({ id, data }) => ({
        url: `/notificationChannel/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags:["AllChannels"]
    }),
    deleteChannel: builder.mutation<DeleteChannelResponse, string>({
      query: (channelId) => ({
        url: `/delete/notificationChannel/${channelId}`,
        method: "DELETE",
      }),

      invalidatesTags:["AllChannels"]
    }),
    

  }),
});

export const {
    useLazyGetAllNotificationChannelsQuery,
    useLazyGetAllChannelsQuery,
    useCreateChannelMutation,
    useEditChannelMutation,
    useDeleteChannelMutation
}=channelsApi


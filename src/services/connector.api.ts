import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { ConnectorInfoByIdResponse, ConnectorTypeResponse, GetConnectorsParams, GetConnectorsResponse } from "../types/connector.type";

export const connectorAPI = createApi({
  reducerPath: "connectorAPI",
  baseQuery: baseQueryWithReauth(""), 
  tagTypes: ['AllConnectors'],
  endpoints: (builder) => ({
    getConnectorById: builder.query<ConnectorInfoByIdResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/connector/${id}`,
        method: "GET",
      }),
    }),
    getConnectors: builder.query<GetConnectorsResponse, GetConnectorsParams>({
      query: ({ page, rowPerPage = 300, sort, order, body }) => ({
        url: `/get/connector`,
        method: 'POST',
        params: {
          per_page: rowPerPage,
          page,
          sort,
          order,
        },
        body,
      }),
      providesTags: ['AllConnectors'],
    }),
    getRawtableData: builder.query({
      query: ({ page, rowPerPage, body }) => ({
        url: `data/search`,
        method: 'POST',
        params: {
          page: page,
          per_page: rowPerPage,
        },
        body,
      }),
    }),
    getFieldsOfConnectors: builder.query({
      query: (index) => ({
        url: `/elastic/getfield`,
        method: 'GET',
        params: { pattern: index },
      }),
    }),
    getConnectorList: builder.query<ConnectorTypeResponse, void>({
      query: () => ({
        url: `/get/connector-count`,
        method: 'GET',
      })
    })
  }),
  
});

export const { useGetConnectorByIdQuery , useLazyGetConnectorsQuery , useGetFieldsOfConnectorsQuery, useLazyGetConnectorListQuery} = connectorAPI;

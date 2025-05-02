import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { GenericPaginatedResponse } from "../types/GenericResponse.type";
import { Visualization, VisualizationDeleteResponse } from "../types/Visualization.type";

export const visualizationAPI = createApi({
  reducerPath: "visualizationAPI",
  baseQuery: baseQueryWithReauth(""),
  tagTypes: ['getAllVisualization','VISUALIZATIONS'],
  endpoints: (builder) => ({
    getAllVisualization: builder.query<
      GenericPaginatedResponse<Visualization>,
      { params: { page: number; per_page: number } }
    >({
      query: ({ params }) => ({
        url: `/get/visualization`,
        method: "POST",
        params,
        body: {
          "query": {
            "filter": [
              {
                "field": "status",
                "function": "match",
                "value": "Active",
                "operator": "AND"
              }
            ],
            "sort": [
              {
                "field": "updatedOn",
                "order": "desc"
              }
            ]
          }
        },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["getAllVisualization"]
    }),
    getSingleVisualizationData: builder.query({
      query: ({ id }) => ({
        url: `/get/visualization/${id}`,
        method: 'GET',
      }),
      providesTags: ['VISUALIZATIONS']
    }),

    deleteVisualization: builder.mutation<
      VisualizationDeleteResponse,
      { visualizationId: string, view: string }
    >({
      query: ({ visualizationId, view }) => ({
        url: `/visualizations/${visualizationId}`,
        method: "DELETE",
        params: {view}
      }),
      invalidatesTags: ["getAllVisualization"]
    })
  }),
});

export const { useLazyGetAllVisualizationQuery, useDeleteVisualizationMutation ,useGetSingleVisualizationDataQuery,  useLazyGetSingleVisualizationDataQuery} = visualizationAPI;

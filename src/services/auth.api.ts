import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const authAPI = createApi({
  reducerPath: "authAPI",
  baseQuery: baseQueryWithReauth("/auth"),
  endpoints: (builder) => ({
    login: builder.mutation<
      { access_token: string; refresh_token: string },
      { email: string; password: string }
    >({
      query: (body) => ({ url: `login`, method: "POST", body }),
    }),
  }),
});

export const { useLoginMutation } = authAPI;

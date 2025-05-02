import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  retry,
} from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import useAuthStorage from '../hooks/useAuthStorage';
const basePath = import.meta.env.VITE_BASE_URL;
const mutex = new Mutex();

const baseQueryWithRefreshToken = fetchBaseQuery({
  baseUrl: basePath,
  prepareHeaders(headers) {
    const token = useAuthStorage.getState().refresh_token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
      return headers;
    }
  },
});

export const baseQueryWithReauth = (prefix: string) => {
  const func: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
  > = async (args, api, extraOptions) => {
    const baseQuery = retry(
      fetchBaseQuery({
        baseUrl: `${basePath}${prefix}`,
        prepareHeaders: async (headers) => {
          const token = useAuthStorage?.getState()?.access_token;
          token && headers.set('authorization', `Bearer ${token}`);
          return headers;
        },
      }),
      {
        maxRetries: 1,
      },
    );
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      if (!mutex.isLocked()) {
        const release = await mutex.acquire();
        try {
          const refreshResult = await baseQueryWithRefreshToken(
            '/refresh',
            api,
            extraOptions,
          );
          if (refreshResult.data) {
            await useAuthStorage
              .getState()
              .addToken(
                (refreshResult?.data as { access_token: string })?.access_token,
              );
            const result = await baseQuery(args, api, extraOptions);
            return result;
          } else {
            useAuthStorage.getState().removeToken();
            const win: Window = window;
            if (win.location.pathname !== '/login')
              win.location = '/login' + win.location.search;
          }
        } finally {
          release();
        }
      } else {
        await mutex.waitForUnlock();
        result = await baseQuery(args, api, extraOptions);
      }
    }
    return result;
  };
  return func;
};
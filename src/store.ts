import { configureStore } from "@reduxjs/toolkit";
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from "@reduxjs/toolkit/query";
import { authAPI } from "./services/auth.api";
import { dashboardAPI } from "./services/dashboard.api";
import { visualizationAPI } from "./services/visualization.api";
import { jobsAPI } from "./services/alert.api";
import { rolesAPI } from "./services/roles.api";
import { connectorAPI } from "./services/connector.api";
import { usersApi } from "./services/users.api";
import { correlationAPI } from "./services/correlation.api";
import { reportsAPI } from "./services/report.api";
import { channelsApi } from "./services/channel.api";
import { contactsAPI } from "./services/contact.api";
import { leadsApi } from "./services/estest.api";
export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [authAPI.reducerPath]: authAPI.reducer,
    [dashboardAPI.reducerPath]: dashboardAPI.reducer,
    [visualizationAPI.reducerPath]: visualizationAPI.reducer,
    [jobsAPI.reducerPath]: jobsAPI.reducer,
    [rolesAPI.reducerPath]: rolesAPI.reducer,
    [connectorAPI.reducerPath]: connectorAPI.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [correlationAPI.reducerPath]: correlationAPI.reducer,
    [reportsAPI.reducerPath]: reportsAPI.reducer,
    [channelsApi.reducerPath]: channelsApi.reducer,

    [contactsAPI.reducerPath]: contactsAPI.reducer,
    [leadsApi.reducerPath]: leadsApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(dashboardAPI.middleware)
      .concat(visualizationAPI.middleware)
      .concat(authAPI.middleware)
      .concat(jobsAPI.middleware)
      .concat(rolesAPI.middleware)
      .concat(connectorAPI.middleware)
      .concat(usersApi.middleware)
      .concat(correlationAPI.middleware)
      .concat(reportsAPI.middleware)
      .concat(channelsApi.middleware)
      .concat(contactsAPI.middleware)
      .concat(leadsApi.middleware)
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
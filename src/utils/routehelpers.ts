import { RouteObject } from "react-router-dom";
import AllRoutes from "../router/allRoutes";
import { RouteName, RouteParamsForId } from "../types/route.types";

export function findRouteById(
  id: string,
  routes: readonly RouteObject[]
): RouteObject | undefined {
  for (const route of routes) {
    if (route.id === id) {
      return route; // Found the route with the matching ID
    }
    // If this route has children, recursively search in them
    if (route.children) {
      const foundRoute = findRouteById(id, route.children);
      if (foundRoute) {
        return foundRoute; // Found in the children
      }
    }
  }
  return undefined; // Not found
}
export function findRoutePathById(
  routes = AllRoutes,
  id: RouteName,
  params: Record<string, string> = {},
  queryParams: Record<string, string> = {}
): string {
  for (const route of routes) {
    if (route.id === id && route.path) {
      const pathWithParams = replacePathParams(route.path, params);
      return addQueryParams(pathWithParams, queryParams);
    }
    if (route.children) {
      const childPath = findRoutePathById(
        route.children,
        id,
        params,
        queryParams
      );
      if (childPath) {
        return childPath;
      }
    }
  }
  return "";
}

function replacePathParams(
  path: string,
  params: Record<string, string>
): string {
  return path.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
    return params[key] || `:${key}`; // Replace with param value or keep original
  });
}

function addQueryParams(
  path: string,
  queryParams: Record<string, string> = {}
): string {
  if (Object.keys(queryParams).length === 0) {
    return path; // Return path as is if no query params
  }

  const searchParams = new URLSearchParams(queryParams).toString();
  return `${path}?${searchParams}`;
}

export default function routeFn<Route extends RouteName>(
  id: Route,
  params: RouteParamsForId<Route>,
  queryParams?: Record<string, string>
) {
  return findRoutePathById(AllRoutes, id, params || {}, queryParams || {});
}

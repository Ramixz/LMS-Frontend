import { routeList } from "../router/routelist";

// Define a recursive type to extract all ids from RouteList
type ExtractRouteIds<T> = T extends { id: infer Id; children?: infer Children }
  ?
      | Id
      | (Children extends ReadonlyArray<infer Child>
          ? ExtractRouteIds<Child>
          : never)
  : never;
// Use the recursive type to infer all ids
export type RouteName = ExtractRouteIds<(typeof routeList)[number]>;

// Map each route id to its parameter keys
type RouteParams = {
  "dashboard.index": void;
  "dashboard.show": { dashboardId: string };
  "correlation.create":void;
  "correlation.index":void;
  "settings.contacts": void;
  "roles.create":void;
  "settings.roles":void;
  "roles.edit":{id:string};
  "ConfigureAlert.index":void;
  "ConfigureReport.index":void;
  "ConfigureReport.create":void;
  "ConfigureReport.edit":{id:string};
};

// Get the parameters based on route id
export type RouteParamsForId<T extends RouteName> = T extends keyof RouteParams
  ? RouteParams[T]
  : never;

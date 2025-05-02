import { NavigateOptions, useNavigate } from "react-router-dom";
import { RouteName, RouteParamsForId } from "../types/route.types";
import routeFn from "../utils/routehelpers";

const useNav = () => {
  const navigate = useNavigate();
  return <Route extends RouteName>(
    id: Route,
    params: RouteParamsForId<Route> = {} as never,
    query: Record<string, string> = {},
    options?: NavigateOptions
  ) => navigate(routeFn(id, params, query), options);
};

export default useNav;

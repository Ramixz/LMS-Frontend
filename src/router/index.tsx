import { createBrowserRouter, redirect, RouteObject } from "react-router-dom";
import AllRoutes from "./allRoutes";
import { RootState, store } from "../store";
import { SelfRolesAPIResult } from "../types/roles.type";

// Recursive loader function to check permissions
const checkPermissions = async (
    route: RouteObject & { permissions: string[] }
): Promise<null | ReturnType<typeof redirect>> => {
    if (!route.permissions) {
        return null;
    }

    const rolesData = (
        Object.entries((store.getState() as RootState).rolesAPI.queries).find(
            ([key]) => key.includes("selfRoles")
        )?.[1] as unknown as SelfRolesAPIResult
    );
    const permissions = rolesData?.permission;
    
    // Check if the route ID is included in the user's permissions
    if (
        route.id &&
        !route.permissions?.every((permission) => permissions?.includes(permission))
    ) {
        throw new Response(`Forbidden, ${permissions?.join()}`, { status: 403 });
    }

    // If the route has children, recursively check their permissions
    if (
        !route.index &&
        (route.children as Array<RouteObject & { permissions: string[] }>)
    ) {
        if (route.children)
            for (const child of route.children) {
                const result = await checkPermissions(
                    child as RouteObject & { permissions: string[] }
                ); // Recursively check child routes
                if (result) {
                    return result; // If child route isn't authorized, return the redirect
                }
            }
    }

    return null; // If the route and all its children pass permission checks, return null (allowed)
};

const mapRoutes = (
    routes: Array<RouteObject & { permissions: string[] }>
): RouteObject[] => {
    return routes.map((route) => {
        if (route.id === "root") {
            return route;
        }
        if ("index" in route && route.index) {
            return {
                ...route,
                loader: async () => await checkPermissions(route),
            };
        }
        return {
            ...route,
            loader: async () => await checkPermissions(route), // Check permissions for this route
            children: route.children
                ? mapRoutes(
                    route.children as Array<RouteObject & { permissions: string[] }>
                )
                : undefined, // Recursively apply the same check to children
        };
    });
};
const router = () =>
    createBrowserRouter(
        mapRoutes(
            AllRoutes as Array<
                RouteObject & { permissions: string[] }
            >
        )
    );

export default router;

import { matchPath, NavLink, redirect, RouteObject } from "react-router-dom";

import {
  ActionIcon,
  AppShell,
  Text,
  getGradient,
  Stack,
  Button,
  Badge,
  Divider,
  Tooltip,
  Flex,
  Box,
  Container,
  Avatar,
} from "@mantine/core";

import { IconLogout } from "@tabler/icons-react";
import AllRoutes from "../../router/allRoutes";
import { useCallback, useEffect, useState } from "react";
import useAuthStorage from "../../hooks/useAuthStorage";
import { findRouteById } from "../../utils/routehelpers";
import { RouteName } from "../../types/route.types";
import useTokenData from "../../hooks/useTokenData";
import { useSelfRolesQuery } from "../../services/roles.api";

function NavigationBar({
  hoveredRef,
  hovered,
  width,
}: {
  hoveredRef: React.RefObject<HTMLDivElement>;
  hovered: boolean;
  width: number;
}) {
  // const { AllRoutes } = useContext(AppContext);
  const getRouteForIds = (rN: RouteName) => findRouteById(rN, AllRoutes);
  const { data: userRole } = useSelfRolesQuery();
  const topList = (
    [
      "dashboard.index",

    ] as RouteName[]
  ).map(getRouteForIds) as Array<
    { displayName: string; path: string; icon: typeof IconLogout } & RouteObject
  >;
  const childrenForMenu: Partial<Record<RouteName, Array<Partial<RouteName>>>> =
    {};
  const bottomList = (["settings.index"] as RouteName[]).map(
    getRouteForIds
  ) as Array<
    { displayName: string; path: string; icon: typeof IconLogout } & RouteObject
  >;
  const tokendata = useTokenData();

  // TODO: use permissions in userRole to display nav items instead of roleName
  const { removeToken } = useAuthStorage();
  const [activeRoute, setActiveRoute] = useState<RouteName>("root");
  const [hoveredRoute, setHoveredRoute] = useState<RouteName>(activeRoute);
  const setMemoActiveRoute = useCallback((route: RouteName) => {
    setTimeout(() => {
      setActiveRoute(route);
    }, 500);
  }, []);
  useEffect(() => {
    if (!hovered) {
      setHoveredRoute(activeRoute);
    }
  }, [hovered]);
  return (
    <AppShell.Navbar
      ref={hoveredRef}
      style={(theme) => ({
        display: "flex",
        flexDirection: "column",
        borderInlineEndColor: "transparent",
        width,
        justifyContent: "space-between",
        transition: "all",
        transitionDuration: "200ms",
        background: getGradient(
          {
            deg: 240,
            from: theme.colors.primary[9],
            to: theme.colors.primary[9],
          },
          theme
        ),
      })}
    >
      <Stack justify="start" align="center" w={"100%"} pt={"xs"}>
        {/* <Box>
          <img src="/datav-new-logo.svg" alt="" style={{width:"40px"}} />
        </Box> */}
        <Box
          
          style={{
            display: "flex",
            justifyContent: hovered ? "start" : "center",
            paddingLeft: hovered ? "var(--mantine-spacing-xl)" : 0,
            width: "100%"
          }}
        >
          <Box
            component="img"
            src={hovered ? "" : ""}
            my="xs"
            w={hovered ? "83px" : "40px"}
            style={{
              borderRadius: 0,
              width: "100%",
              // paddingLeft: hovered ? "var(--mantine-spacing-md)" : 0,
            }}
          />
        </Box>


        {/* <Avatar src={"/datav-logo.svg"} my={"lg"} /> */}

        {topList.map((e) => (
          <NavLink
            key={e.id}
            to={e.path}
            style={{
              position: "relative",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              textDecoration: "none",
            }}
          >
            {({ isActive }) => {
              if (isActive && e.id != activeRoute)
                setMemoActiveRoute(e.id as RouteName);
              return (
                <>
                  <Flex style={{
                    width: "100%",
                    justifyContent: hovered ? "start" : "center",
                  }}
                    pl={hovered ? "md" : "0"}
                  >
                    <Tooltip label={e.displayName}>
                      {!hovered ?
                        <ActionIcon
                          variant="transparent"
                          onMouseOver={() => {
                            setHoveredRoute(e.id as RouteName);
                          }}
                          radius={"md"}
                          size={"xl"}
                          h={48}
                          w={48}

                          c={isActive ? "secondary.6" : "white"}
                        >
                          {e.icon && <e.icon color="currentColor" />}
                        </ActionIcon>
                        :
                        <Flex justify="flex-start" align="center">
                          <Button
                            variant="subtle"

                            onMouseOver={() => {
                              setHoveredRoute(e.id as RouteName);
                            }}
                            radius="md"
                            size="sm"
                            h={48}
                            c={isActive ? "secondary.6" : "white"}
                            leftSection={e.icon && <e.icon color="currentColor" />}
                          >
                            {e.displayName}
                          </Button>
                        </Flex>
                      }
                    </Tooltip>
                  </Flex>
                  {isActive && (
                    <Box
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 2,
                        borderTopLeftRadius: 15,
                        borderBottomLeftRadius: 15,
                        width: 5,
                        height: "100%",
                      }}
                      bg={isActive ? "secondary.6" : "white"}
                    ></Box>
                  )}
                </>
              );
            }}
          </NavLink>
        ))}
      </Stack>
      <Stack justify="start" align="center" w={"100%"}>
        {/* {userRole &&
            bottomList.map(
              (e) =>
                e?.path && (
                  <NavLink
                    key={e.id}
                    to={e.path}
                    style={{
                      position: "relative",
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {({ isActive }) => {
                      if (isActive) setMemoActiveRoute(e.id as RouteName);

                      return (
                        <>
                          <Tooltip label={`${e?.displayName}`}>
                            <ActionIcon
                              onMouseOver={() => {
                                setHoveredRoute(e.id as RouteName);
                              }}
                              radius={"md"}
                              size={"xl"}
                              w={48}
                              h={48}
                              c="secondary.6"
                            >
                              <e.icon color="currentColor" />
                            </ActionIcon>
                          </Tooltip>
                          {isActive && (
                            <div
                              style={{
                                position: "absolute",
                                top: 0,
                                right: 2,
                                borderTopLeftRadius: 15,
                                borderBottomLeftRadius: 15,
                                width: 5,
                                height: "100%",
                                background: "white",
                              }}
                            ></div>
                          )}
                        </>
                      );
                    }}
                  </NavLink>
                )
            )} */}
        <Divider w={"100%"} my={6} />

      </Stack>
    </AppShell.Navbar>
  );
}

export default NavigationBar;

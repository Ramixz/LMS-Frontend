import { AppShell, Box, Loader } from "@mantine/core";
import { useHover, useViewportSize } from "@mantine/hooks";
import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import React from "react";

const NavigationBar = React.lazy(() => import("./NavigationBar"));
function Layout() {
  const vps = useViewportSize();
  const { ref: hoveredRef, hovered } = useHover();
  const width = hovered ? 250 : 80;
  const navbarProps = {
    hoveredRef,
    hovered,
    width,
  };
  return (
    <AppShell
      navbar={{
        width,
        breakpoint: "xs",
        collapsed: { mobile: vps.width < 640 },
      }}
    >
      <NavigationBar {...navbarProps} />
      <AppShell.Main
        style={{ borderColor: "transparant", outlineColor: "transparent" }}
        bg={"white"}
      >
        <Suspense
          fallback={
            <Box
              style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Loader type="bars" />
            </Box>
          }
        >
          <Outlet />
        </Suspense>
      </AppShell.Main>
    </AppShell>
  );
}
export default Layout;
 
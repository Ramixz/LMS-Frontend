import {
  Center,
  Tooltip,
  UnstyledButton,
  Stack,
  rem,
  AppShell,
} from "@mantine/core";

import classes from "./SideNavigation.module.css";

import { NavLink } from "react-router-dom";
import {
  IconBrandMantine,
  IconLogout,
  IconSwitch,
  IconLayoutDashboard,
  IconChartPie,
  IconDatabase,
  IconSettings2,
  IconCirclesRelation,
  IconUrgent,
} from "@tabler/icons-react";
import { RouteName } from "../../../types/route.types";
import routeFn from "../../../utils/routehelpers";

interface NavbarLinkProps {
  icon: typeof IconBrandMantine;
  label: string;
  to: string;
}

function NavbarLink({ icon: Icon, label, to }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 200 }}>
      <NavLink to={to} style={{ all: "unset" }}>
        {({ isActive }) => (
          <UnstyledButton
            className={classes.link}
            data-active={isActive || undefined}
          >
            <Icon style={{ width: rem(22), height: rem(22) }} />
          </UnstyledButton>
        )}
      </NavLink>
    </Tooltip>
  );
}

const mockdata: {
  icon: typeof IconBrandMantine;
  label: string;
  routeId: RouteName;
}[] = [
  {
    icon: IconLayoutDashboard,
    label: "Dashboard",
    routeId: "dashboard.index",
  },
  {
    icon: IconChartPie,
    label: "Visualization",
    routeId: "visualization.index",
  },
  {
    icon: IconDatabase,
    label: "Connector",
    routeId: "connector.index",
  },
  {
    icon: IconUrgent,
    label: "Alert",
    routeId: "alert.index",
  },
  {
    icon: IconCirclesRelation,
    label: "Correlation",
    routeId: "correlation.index",
  },
  {
    icon: IconSettings2,
    label: "Settings",
    routeId: "settings.index",
  },
];

export default function SideNavigation() {
  const links = mockdata.map((link) => (
    <NavbarLink
      to={routeFn(link.routeId, undefined)}
      {...link}
      key={link.routeId}
    />
  ));

  return (
    <AppShell.Navbar p="md">
      <Center>
        <IconBrandMantine type="mark" size={30} color="black" />
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink icon={IconSwitch} label="Change account" to={""} />
        <NavbarLink icon={IconLogout} label="Logout" to={""} />
      </Stack>
    </AppShell.Navbar>
  );
}

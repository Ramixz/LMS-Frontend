import { IconChartPie, IconCirclesRelation, IconDatabase, IconLayoutDashboard, IconReport, IconSettings2, IconUrgent } from "@tabler/icons-react";
import ErrorBoundary from "../components/ErrorBoundry";
import Layout from "../components/Layout";
import {
  DashboardIndex,
  ConnectorIndex,
  LoginPage,
  VisualizationIndex,
  SettingsIndex,
  AlertIndex,
  CorrelationIndex,
  ReportIndex,
  ConfigurealertIndex,
  CongigureReportIndex,
  ContactIndex,
  UsersIndex,
  RolesIndex,
  ChannelIndex,
  DatavChartIndex,
} from "../pages";
import { PERMISSIONS } from "../lib/permissions";
import { ALL_MODULES } from "../lib/enums/modules";
import CorrelationCreation from "../pages/Correlationcreation";
import RoleCreationOrEdit from "../pages/Settings/roles/RolesCreation";
import Leads from "../pages/Reports/ystest";


export const routeList = [
  {
    id: "root",
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        id: "dashboard.index",
        path: "/dashboard",
        icon: IconLayoutDashboard,
        displayName: "Dashboard",
        permissions: [],
        children: [
          {
            index: true, // This renders DashboardIndex for /dashboard
            permissions: [],
            element: <Leads />,
          },
          {
            id: "dashboard.show",
            path: "/dashboard/:id",
            element: <DatavChartIndex />,
            permissions: [PERMISSIONS(ALL_MODULES.DASHBOARD).READ],
          },
        ],
      },
      {
        id: "visualization.index",
        path: "/visualization",
        element: <VisualizationIndex />,
        icon: IconChartPie,
        displayName: "Visualization",
        permissions: [PERMISSIONS(ALL_MODULES.VISUALIZATION).READ],
      },
      {
        id: "connector.index",
        path: "/connector",
        element: <ConnectorIndex />,
        icon: IconDatabase,
        displayName: "Connector",
        permissions: [PERMISSIONS(ALL_MODULES.CONNECTOR).READ],
      },
      {
        id: "ConfigureAlert.index",
        path: "/configurealert",
        element: <ConfigurealertIndex />,
        icon: IconDatabase,
        displayName: "ConfigureAlert",
      },

 
      {
        id: "alert.index",
        path: "/alert",
        element: <AlertIndex />,
        icon: IconUrgent,
        displayName: "Alert",
        permissions: [PERMISSIONS(ALL_MODULES.ALERT).READ],
      },
      {
        id: "report.index",
        path: "/report",
        icon: IconReport,
        displayName: "Report",
        permissions: [PERMISSIONS(ALL_MODULES.REPORTS).READ],
        children:[
          {
            index:true,
            element: <ReportIndex />,
          },
          {
            id:'ConfigureReport.create',
            path:"/report/create",
            element:<CongigureReportIndex/>
          },
          {
            id:'ConfigureReport.edit',
            path:"/report/edit/:id",
            element:<CongigureReportIndex/>
          }
        ]
      },
      {
        id: "correlation.index",
        path: "/correlation",
        icon: IconCirclesRelation,
        displayName: "Correlation",
        permissions: [PERMISSIONS(ALL_MODULES.CORRELATION).READ],
        children: [
          {
            index: true, 
            element: <Leads />,
          },
          {
            id: "correlation.create",
            path: "/correlation/create",
            element: <CorrelationCreation />,
          },
        ],
      },
      {
        id: "settings.index",
        path: "/settings",
        icon: IconSettings2,
        displayName: "Settings",
        children: [
          {
            index: true,
            element: <SettingsIndex />,
          },
          {
            id: "settings.users",
            path: "/settings/users",
            element: <UsersIndex />,
          },
          {
            id: "settings.roles",
            path: "/settings/roles",
            icon: IconSettings2,
            displayName: "Roles",
            children: [
              {
                index:true,
                element:<RolesIndex/>
              },
              {
                id: "roles.create",
                path: "/settings/roles/create",
                element: <RoleCreationOrEdit/>,
              },
              {
                id: "roles.edit",
                path: "/settings/roles/edit/:id",  
                element: <RoleCreationOrEdit />,
              },              
            ],
          },
          {
            id: "settings.contacts",
            path: "/settings/contacts",
            element: <ContactIndex />,
          },
          {
            id: "settings.channels",
            path: "/settings/channels",
            element: <ChannelIndex />,
          },
        ],
      },
    ],
  },
  {
    id: "auth.login",
    path: "/login",
    element: <LoginPage />,
  },
] as const;

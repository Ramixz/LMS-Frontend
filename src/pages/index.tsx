import React from "react";

export const DashboardIndex = React.lazy(() => import("./Dashboard"));
export const ConnectorIndex = React.lazy(() => import("./Connector"));
export const DatavChartIndex = React.lazy(() => import("./DataVChart"));
export const Correlationcreation = React.lazy(() => import("./Correlationcreation"));
export const ConfigurealertIndex = React.lazy(() => import("./Configure Alerts"));
export const CongigureReportIndex = React.lazy(() => import("./Report Creation"));
export const VisualizationIndex = React.lazy(() => import("./Visualization"));
export const AlertIndex = React.lazy(() => import("./Alert"));
export const ReportIndex = React.lazy(() => import("./Reports"))
export const CorrelationIndex = React.lazy(() => import("./Correlation"));
export const SettingsIndex = React.lazy(() => import("./Settings"));
export const UsersIndex = React.lazy(() => import("./Settings/users"));
export const ChannelIndex=React.lazy(()=> import("./Settings/channels") )
export const RolesIndex = React.lazy(() => import("./Settings/roles"));
export const ContactIndex = React.lazy(() => import("./Settings/Contacts"));
export const LoginPage = React.lazy(() => import("./Public/Login"));

export interface DeleteReportResponse {
  success: boolean;
  status: number;
  message: string;
}

export interface CreateReportResponse {
  success: boolean
  status: number
  message: string
  data: Data
}

export interface Data {
  id: string
  reportName: string
  dashboards: Dashboard[]
  cronInterval: string
  contacts: string[]
  notificationChannelId: string
  cronStatus: string
  nextRunTime: string
  createdOn: string
  updatedOn: string
}

export interface Dashboard {
  dashboardId: string
  timePeriod: string
}

export interface Report {
  id: string
  reportName: string
  dashboards: Dashboard[]
  cronInterval: string
  contacts: string[]
  notificationChannelId: string
  cronStatus: string
  nextRunTime: string
  createdOn: string
  updatedOn: string
}

export interface Dashboard {
  dashboardId: string
  timePeriod: string
  dashboardName: string
}


export interface CreateReportRequest {
  reportName: string;
  dashboards: { dashboardId: string; timePeriod: string }[];
  schedulerInfo: { expression: string };
  contacts: string[];
  notificationChannelId: string;
};
export interface ToggleCronStatusRequest {
  reportId: string;
  status: "pause" | "start";
};

export interface ReportPaginatedResponse<T> {
  message: string,
  success: boolean,
  status: number,
  data: T[];
  total_items: number;
  page: number;
  per_page: number;
}


export interface cronStatusResponse {
  success: boolean
  status: number
  message: string
  data: Data
}

export interface Data {
  message: string
}


export interface ReportsInstantTriggerResponse {
  success: boolean
  status: number
  message: string
  data: TriggerData
}

export interface TriggerData {
  message: string
}

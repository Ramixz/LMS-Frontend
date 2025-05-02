export interface Dashboard {
  _id: Id;
  name: string;
  description: string;
  createdBy: CreatedBy;
  createdOn: string;
  updatedOn: string;
  status: string;
  chartCount: number;
  visualizationIds?: VisualizationId[];
  layout?: Layout;
}

export interface threshold{
  dashboardId: string;
  dashboardName?: string;
  timePeriod: string;
}

export interface Id {
  $oid: string;
}

export interface CreatedBy {
  $oid: string;
}
export interface CreatedOn {
  $date: string
}

export interface UpdatedOn {
  $date: string
}

export interface CreatedOn {
  $date: string
}

export interface UpdatedOn {
  $date: string
}
export interface VisualizationId {
  id: string;
  status: string;
  connectorid: string;
  connectorName: string;
}

export interface Layout {
  lg: Lg[];
  md: Md[];
  sm: Sm[];
  xs: X[];
  undefined: Undefined[];
}

export interface Lg {
  w: number;
  h: number;
  x: number;
  y: number;
  i: string;
  moved: boolean;
  static: boolean;
}

export interface Md {
  w: number;
  h: number;
  x: number;
  y: number;
  i: string;
  moved?: boolean;
  static?: boolean;
}

export interface Sm {
  x: number;
  y: number;
  w: number;
  h: number;
  i: string;
}

export interface X {
  x: number;
  y: number;
  w: number;
  h: number;
  i: string;
}

export interface Undefined {
  x: number;
  y: number;
  w: number;
  h: number;
  i: string;
}


export interface DashboardPayload {
  name: string;
  description: string;
}

export interface DeleteDashboardResponse {
  message: string;
  status_code:number;
  success:boolean;
}

export interface UpdateDashboardResponse {
  message: string;
  status_code:number;
  success:boolean;
}

export interface createDashboardResponse {
  id: string
}

export interface DashboardAPITypes {
  _id: Id
  name: string
  description: string
  createdBy: CreatedBy
  createdOn: CreatedOn
  updatedOn: UpdatedOn
  status: string
  visualizationIds?: VisualizationId[]
  message?: string
}
export interface  GetVisualizationsQuery  {
  id: number | string | undefined;
}

export interface GetAllDashboardResponse {
  data: DashboardAPITypes[]
  total_items: number
  page: number
  per_page: number
  message?: string
  visualizationIds?:string
}

export interface XAxisItem  {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yAxis?: any; // Define properly if possible
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yAxisOrder?: any;
  order?: string; // Adjust the type as per actual data
  calendar_interval?: string;
  field_type?: string;
  interval?: number;
  function?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow other properties
}
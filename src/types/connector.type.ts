export interface ConnectorInfoByIdResponse {
    data: Data
    success: boolean
    status_code: number
  }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface BaseQueryParams<T = Record<string, any>> {
  page: number;
  rowPerPage?: number;
  sort?: string;
  order?: string; 
  body?: T; // Generic type for body
}

export interface BaseApiResponse<T> {
  data: T[];
  success: boolean;
  status_code: number;
  total_count: number;
}
  
  export interface Data {
    _id: Id
    connectorInfo: ConnectorInfo
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schedulerInfo: any
    createdBy: CreatedBy
    createdOn: CreatedOn
    updatedOn: UpdatedOn
    status: string
    onBoardStatus: string
  }
  
  export interface Id {
    $oid: string
  }
  
  export interface ConnectorInfo {
    type: string
    status: string
    name: string
    index: string
    equation: any[]
    details: Details
  }
  
  export interface Details {
    renameFields: any[]
    removeFields: any[]
  }
  
  export interface CreatedBy {
    $oid: string
  }
  
  export interface CreatedOn {
    $date: string
  }
  
  export interface UpdatedOn {
    $date: string
  }
  export interface SchedulerInfo {
    startDate?: string
    endDate?: string
    interval?: string
    lastRuntime?: string
  }
  export interface ConnectorsType {
    _id?: Id
    connectorInfo?: ConnectorInfo
    schedulerInfo?: SchedulerInfo
    createdBy?: string
    createdOn?: CreatedOn
    updatedOn?: UpdatedOn
    status?: string
    baseUrl?: string;
    dataset?: string[];
    apiSecret?: string;
    apiKey?: string;
  }
  export interface CreateConnectorResponseType{
    id: string;
  }
  export interface Filter {
    field: string
    function: string
    value: string
    operator: string
  }
  export interface Query {
    filter: Filter[]
  }
  export interface BodyConnectorGenericPayload {
    query: Query
  }
 export interface ConnectorsGenericParams {
    page: number | string,
    rowPerPage: number | string,
    sort: string,
    order: string,
    type?: string,
    body: BodyConnectorGenericPayload,
    id?: string
  }

  export interface GetConnectorsResponse {
    data: ConnectorsType[]
    total_items: number
    page: number
    per_page: number
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type GetConnectorsParams<T = Record<string, any>> = BaseQueryParams<T>;
  // export type GetConnectorsResponse = BaseApiResponse<Data>;


  export interface ConnectorTypeResponse {
    data: ConnectorType
    success: boolean
    status_code: number
  }
  
  export interface ConnectorType {
    sdp: string
    ceipal: string
    mongo: string
    fileupload: string
    elasticsearch: string
    mysql: string
    postgresql: string
    cockroachdb: string
    cassandra: string
    oracledb: string
    dynamodb: string
    salesforce: string
    mssql: string
    saphana: string
    couchbase: string
    spotlight: string
    sharepoint: string
    loq: string
    ibm: string
    firebase: string
    redis: string
    couchdb: string
    supabase: string
    influxdb: string
    "ceipal reports": string
    hrone: string
    flowace: string
    gitlab: string
    "business-central-dynamics": string
    "service-now": string
    "zoho-crm": string
    sharepro: string
    mariadb: string
    onehash: string
  }
  

  // types.ts
export interface Connector {
  name: string;
  type: ConnectorTypes;
  logo: string;
  connectors: string;
  category: ConnectorCategory;
  description: string;
}

export type ConnectorTypes =
  | 'fileupload'
  | 'salesforce'
  | 'gitlab'
  | 'loq'
  | 'mysql'
  | 'firebase'
  | 'elasticsearch'
  | 'cockroachdb'
  | 'cassandra'
  | 'dynamodb'
  | 'couchbase'
  | 'redis'
  | 'couchdb'
  | 'sharepoint'
  | 'sdp'
  | 'postgresql'
  | 'oracledb'
  | 'mariadb'
  | 'mssql'
  | 'supabase'
  | 'hrone'
  | 'ceipal'
  | 'business-central-dynamics'
  | 'onehash'
  | 'spotlight';

export type ConnectorCategory = 'File' | 'Application' | 'Internal' | 'Database';

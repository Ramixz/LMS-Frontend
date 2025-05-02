export interface Job {
  _id: {
    $oid: string;
  };
  jobName: string;
  jobField: string;
  jobFormat: string;
  notificationChannel: string[];
  contactList: string[];
  message: string;
  jobFunction: string;
  expression: string;
  thresholdDetails: Array<{
    value: number;
    equation: string;
    severity: string;
  }>;
  aggs: {
    yAxis_0: {
      [key: string]: {
        field: string;
      };
    };
    stats?: {
      stats: {
        field: string;
      };
    };
  };
  query: Record<string, unknown>;
  connectorInfo: {
    name: string;
    type: string;
    index: string;
    status: string;
    details?: {
      renameFields: string[];
      removeFields: string[];
    };
  };
  createdBy: {
    $oid: string;
  };
  createdOn: string;
  updatedOn: string;
  status: string;
  jobStatus: string;
  cron_status: string;
  job_id: string;
}


export interface AllAlert {
  _id: Id
  message: string
  severity: string
  threshold: number
  thresholdSet: number
  alertStatus: string
  jobId: string
  createdOn: string
  updatedOn: string
  closedTime?: string
  auditStatus: string
  auditTime: string
}

export interface Id {
  $oid: string
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


export interface ToggleCronStatusRequest  {
  jobId: string;
  status: "pause" | "start";
};

export interface AlertPreviewResponse {
  message: string
  thresoldValue: number
  success: boolean
  status_codee: number
}
export interface FieldFilterAPIresponse {
  aggregatable: boolean
  esTypes: string[]
  metadata_field: boolean
  name: string
  readFromDocValues: boolean
  searchable: boolean
  type: string
}
export interface GetFieldFilterType {
  fields: FieldFilterAPIresponse[]
  indices: string[]
}
export type GetFieldFilterQuery = {
  index: string;
  pattern: string
}
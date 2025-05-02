export interface Correlation {
    _id:             ID;
    correlationName: string;
    connectors:      string[];
    payload:         Payload;
    schedulerInfo:   SchedulerInfo;
    createdAt:       Date;
    updatedOn:       Date;
    createdBy:       string;
    status:          string;
    index:           string;
    updatedAt:       Date;
}

export interface ID {
    $oid: string;
}

export interface Payload {
    joins: Join[];
}

export interface Join {
    index:   string;
    key:     string;
    dataset: string;
}

export interface SchedulerInfo {
    expression:  string;
    cron_status: string;
    job_id:      string;
}


export interface CorrelationDeleteResponse {
    message:      string;
    errorMessage: string;
    success:      boolean;
    status_code:  number;
}

export interface DatasetOption {
    datasetToShow: string;
    dataset: string;
    index: string;
  }
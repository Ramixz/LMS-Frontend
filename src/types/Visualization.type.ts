

export interface Visualization {
    _id:                  ID;
    visualizationTitle:   string;
    visualizationType:    string;
    visualizationDetails: string;
    connectorInfo:        WelcomeConnectorInfo;
    createdBy:            ID;
    createdOn:            Date;
    updatedOn:            Date;
    status:               string;
}

export interface ID {
    $oid: string;
}

export interface WelcomeConnectorInfo {
    _id:           ID;
    connectorInfo: ConnectorInfoConnectorInfo;
    createdBy:     string;
    createdOn:     AtedOn;
    updatedOn:     AtedOn;
    status:        string;
}

export interface ConnectorInfoConnectorInfo {
    name:   string;
    type:   string;
    status: string;
    index:  string;
}

export interface AtedOn {
    $date: Date;
}

export interface VisualizationDeleteResponse {
    message: string
  }
  
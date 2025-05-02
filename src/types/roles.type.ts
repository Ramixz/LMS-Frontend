
export interface SelfRolesAPIResult {
    user_id: string
    permission: string[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errors: any[]
    success: boolean
  }
  

export interface GetAllRoleRequest {
    roleName: string
}
// Define the expected response type
export interface GetEditRoleResponse {
    data: CreateRoleType & {
      _id: { $oid: string };
      status: string;
      createdBy: { $oid: string };
      createdOn: string;
      updatedOn: string;
      updatedBy: string;
    };
  }
  
  
export interface    CreateRoleType {
    roleName: string;
    permissions: string[];
    connectorIds: string[];
    dashboardIds: string[]
}

export interface PermissionApiResponse {
    id:string;
    roleName: string
    permission: string[]
    createdAt: string
    updatedAt: string
}


export interface ID {
    $oid: string;
}


export interface Roles {
    _id:          ID;
    roleName:     string;
    permissions:  string[];
    dashboardIds: Array<ID | string>;
    connectorIds: string[];
    createdBy:    ID;
    createdOn:    Date;
    updatedOn:    Date;
    status:       string;
}

export interface RolesDeleteResponse {
    success: boolean;
    status:  number;
    message: string;
}

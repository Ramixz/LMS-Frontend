export interface Users {
    _id: Id
    firstName: string
    lastName: string
    email: string
    password: string
    createdOn: Date
    createdBy?: CreatedBy
    updatedOn: Date
    status: string
    assignedRole: any[]
    dashboards?: Dashboard[]
    visualizations?: Visualization[]
  }
  
  export interface Id {
    $oid: string
  }
  
  export interface CreatedBy {
    $oid: string
  }
  
  export interface Dashboard {
    $oid: string
  }
  
  export interface Visualization {
    $oid: string
  }

  export interface Id2 {
    $oid: string;
  }
  export interface AssignedRole {
  _id: Id2;
  role: string;
  createdBy: CreatedBy;
  status: string;
}
export interface CreateUserAPIMutation {
   data: {
  firstName: string;
  lastName: string;
  email: string;
  assignedRole: AssignedRole[];
  password?: string | undefined;
};
}


export interface CreateUserPayload {
  firstName: string
  lastName: string
  email: string
  assignedRole: string[]
  password?: string;
}


export interface CreateUserResponse {
  id: string
}



export interface DeleteUserResponse {
  message: string
}


export interface UpdateUserResponse {
  message: string
}

export interface UpdateUserPayload {
  firstName: string
  lastName: string
  email: string
  assignedRole: string[]
}


export interface UserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  assignedRole: string[];
  password?: string;
}
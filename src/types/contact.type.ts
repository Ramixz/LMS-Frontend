export interface Contacts {
    _id: Id
    firstName: string
    lastName: string
    phone: string
    email: string
    createdOn: string
    updatedOn: string
    status: string
}

export interface Id {
    $oid: string
}

export interface DeleteContactResponse {
    message: string
}

export interface AddContactPayload {
    firstName: string
    lastName: string
    phone: string
    email: string
}

export interface AddContactResponse {
    id: string
    message?: string
    ErrorMessage?: string
}

export interface EditContactPayload {
    firstName: string
    lastName: string
    phone: string
    email: string
}

export interface EditContactResponse {
    message: string
}


export interface ContactFormValues {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
}

export interface ContactFormProps {
    contact: Partial<ContactFormValues>;
    onSubmit: (values: ContactFormValues) => void;
    isEditing?: boolean;
}
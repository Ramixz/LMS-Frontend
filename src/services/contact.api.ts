import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { GenericPaginatedResponse } from "../types/GenericResponse.type";
import { AddContactPayload, AddContactResponse, Contacts, DeleteContactResponse, EditContactPayload, EditContactResponse } from "../types/contact.type";

export const contactsAPI = createApi({
    reducerPath: "contactsAPI",
    baseQuery: baseQueryWithReauth(""),
    tagTypes: ["allContacts"],
    endpoints: (builder) => ({
            getAllContacts: builder.query<
                GenericPaginatedResponse<Contacts>,
                { params: { page?: number; per_page?: number , order? : number, sort? : string, } }
            >({
                query: ({ params }) => ({
                    url: "/get/contact",
                    method: "POST",
                    params,
                body: {
                    "query": {
                        "filter": [
                            {
                                "field": "status",
                                "function": "match",
                                "value": "Active",
                                "operator": "AND"
                            }
                        ],
                        "sort": [
                            {
                                "field": "updatedOn",
                                "order": "desc"
                            }
                        ]
                    }
                },
            }),

            keepUnusedDataFor: 5,
            providesTags: ["allContacts"]
        }),

        deleteContacts: builder.mutation<
            DeleteContactResponse,
            string
        >({
            query: (contactId) => ({
                url: `/contact/${contactId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["allContacts"]
        }),

        addContact: builder.mutation<
            AddContactResponse,
            AddContactPayload
        >({
            query: (payload) => ({
                url: `/contact`,
                method: "POST",
                body: payload
            }),
            invalidatesTags: ["allContacts"]
        }),

        editContact: builder.mutation<
            EditContactResponse,
            { contactId: string; payload: EditContactPayload }
        >({
            query: ({ contactId, payload }) => ({
                url: `/contact/${contactId}`,
                method: "PUT",
                body: payload
            }),
            invalidatesTags: ["allContacts"]
        })
    })
})


export const {
    useLazyGetAllContactsQuery,
    useDeleteContactsMutation,
    useAddContactMutation,
    useEditContactMutation
} = contactsAPI
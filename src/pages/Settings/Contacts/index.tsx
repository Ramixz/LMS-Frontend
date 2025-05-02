/* eslint-disable @typescript-eslint/no-unused-vars */
import { ActionIcon, Box, Button, Divider, Group, Text } from "@mantine/core";
import Page from "../../../components/Layout/Page";
import { IconAddressBook, IconDownload, IconList, IconPencilMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import { useAddContactMutation, useDeleteContactsMutation, useEditContactMutation, useLazyGetAllContactsQuery } from "../../../services/contact.api";
import DataTable from "../../../components/DataTable";
import { toLocalFormattedDate } from "../../../lib/helpers";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { ContactFormValues, Contacts as ContactResponse } from "../../../types/contact.type";
import ContactForm from "./Form";
import useHasPermission from "../../../hooks/checkPermission";
import { PERMISSIONS } from "../../../lib/permissions";
import { ALL_MODULES } from "../../../lib/enums/modules";
import RoleWrapper from "../../../components/RoleWrapper";


export default function Contacts() {
    const [
        getAllContacts,
        { data, isFetching, isLoading, isError, isUninitialized },
    ] = useLazyGetAllContactsQuery();

    const [deleteContact] = useDeleteContactsMutation();
    const [addContact] = useAddContactMutation();
    const [editContact] = useEditContactMutation();

    const handleDelete = (id: string, name: string) => {
        modals.open({
            title: (
                <Group>
                    <Box
                        style={(theme) => ({
                            borderRadius: theme.radius.xs,
                            border: `1px solid ${theme.colors.gray[4]}`,
                            padding: theme.spacing.xs,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        })}
                    >
                        <ActionIcon c={"danger.7"} variant="transparent">
                            <IconTrash size={"22"} />
                        </ActionIcon>
                    </Box>
                    <Text><b>Delete this Contact?</b></Text>
                </Group>
            ),
            centered: true,
            shadow: "0px",
            children: (
                <Box>
                    <Divider mt={0} mb="xs" />
                    <Text size="sm" mb="md">
                        Are you sure you want to delete this Contact?
                    </Text>
                    <Group justify="flex-start" gap="sm">
                        <Button
                            variant="filled"
                            color="red"
                            onClick={async () => {
                                try {
                                    const response = await deleteContact(id).unwrap();
                                    if (response.message === "Successfully Deleted") {
                                        showNotification({
                                            title: "Success",
                                            message: `Contact "${name}" has been successfully deleted.`,
                                            color: "green",
                                        });
                                    }
                                    modals.closeAll();
                                } catch (error) {
                                    showNotification({
                                        title: "Error",
                                        message: `Unable to delete Contact "${name}".`,
                                        color: "red",
                                    });
                                }
                            }}
                        >
                            Delete
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => modals.closeAll()}
                        >
                            Cancel
                        </Button>
                    </Group>
                </Box>
            )
        });
    };

    const handleAddContact = () => {
        modals.open({
            title: (
                <Group>
                    <Box
                        style={(theme) => ({
                            borderRadius: theme.radius.xs,
                            border: `1px solid ${theme.colors.gray[4]}`,
                            padding: theme.spacing.xs,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        })}
                    >
                        <ActionIcon c={"secondary.7"} variant="transparent" size={"md"}>
                            <IconAddressBook />
                        </ActionIcon>
                    </Box>
                    <Text><b>Add Contact</b></Text>
                </Group>
            ),
            centered: true,
            shadow: "0px",
            children: (
                <>
                    <Divider mt={0} mb="xs" />
                    <ContactForm
                        contact={{
                            firstName: "",
                            lastName: "",
                            phone: "",
                            email: ""
                        }}
                        onSubmit={async (values: ContactFormValues) => {
                            try {
                                const response = await addContact(values).unwrap();
                                if (response.id != null) {
                                    showNotification({
                                        title: "Success",
                                        message: `Contact "${values.firstName} ${values.lastName}" has been successfully added.`,
                                        color: "success.5"
                                    });
                                }
                                modals.closeAll();
                            } catch (error) {
                                showNotification({
                                    title: "Error",
                                    message: "Contact already exists.",
                                    color: "red"
                                });
                            }
                        }}
                    />
                </>
            )
        });
    };

    const handleEditContact = (contact: ContactResponse) => {
        modals.open({
            title: (
                <Group>
                    <Box
                        style={(theme) => ({
                            borderRadius: theme.radius.xs,
                            border: `1px solid ${theme.colors.gray[4]}`,
                            padding: theme.spacing.xs,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        })}
                    >
                        <ActionIcon c={"secondary.7"} variant="transparent" size={"md"}>
                            <IconAddressBook />
                        </ActionIcon>
                    </Box>
                    <Text><b>Review and Update Your Contact</b></Text>
                </Group>
            ),
            centered: true,
            children: (
                <ContactForm
                    isEditing={true}
                    contact={contact}
                    onSubmit={async (values: ContactFormValues) => {
                        try {
                            const response = await editContact({
                                contactId: contact._id.$oid,
                                payload: values
                            }).unwrap();

                            if (response.message === "Successfully Updated") {
                                showNotification({
                                    title: "Success",
                                    message: `Contact "${values.firstName} ${values.lastName}" has been updated.`,
                                    color: "green",
                                });
                            }
                            modals.closeAll();
                        } catch (error) {
                            showNotification({
                                title: "Error",
                                message: `Failed to update contact "${values.firstName} ${values.lastName}".`,
                                color: "red",
                            });
                        }
                    }}
                />
            ),
        });
    };
    const allowedActions = useHasPermission([PERMISSIONS(ALL_MODULES.CONTACT).UPDATE, PERMISSIONS(ALL_MODULES.CONTACT).DELETE])
    return (
        <Page pageTitle="Contacts" bgWhite>
            <Divider my="sm" size={"sm"} />
            <Group justify="end" mb="md" pr={"xxs"}>
                <RoleWrapper permissions={[PERMISSIONS(ALL_MODULES.CONTACT).CREATE]}>
                    <Button leftSection={<IconPlus size={20} />} onClick={handleAddContact}>
                        Contact
                    </Button>
                </RoleWrapper>
                <Button leftSection={<IconDownload size={20} />} variant="outline">
                    Download
                </Button>
                <Button leftSection={<IconList size={20} />} variant="outline">
                    View
                </Button>
            </Group>

            <DataTable
                totalRowCount={data?.total_items ?? 0}
                columns={[
                    {
                        header: "FIRST NAME",
                        accessorKey: "firstName",
                    },
                    {
                        header: "LAST NAME",
                        accessorKey: "lastName",
                    },
                    {
                        header: "PHONE",
                        accessorKey: "phone",
                    },
                    {
                        header: "EMAIL",
                        accessorKey: "email",
                    },
                    {
                        header: "CREATED DATE",
                        accessorFn: (row) => {
                            const { date, time } = toLocalFormattedDate(row.createdOn);
                            return (
                                <div>
                                    <div>{date},</div>
                                    <div>{time}</div>
                                </div>
                            );
                        },
                        accessorKey: "createdOn",
                    },
                ]}
                data={data?.data ?? []}
                {...{ isFetching, isLoading: isLoading || isUninitialized, isError }}
                renderRowActions={({ row }) => {
                    return (
                        <Group gap="md">
                            <RoleWrapper permissions={[PERMISSIONS(ALL_MODULES.CONTACT).UPDATE]}>
                                <ActionIcon
                                    variant="subtle"
                                    size="sm"
                                    c={"surfaceGrey.7"}
                                    onClick={() => handleEditContact(row.original)}
                                    title="Edit Contact"
                                >
                                    <IconPencilMinus size="xxl" stroke={1.5} />
                                </ActionIcon>
                            </RoleWrapper>
                            <RoleWrapper permissions={[PERMISSIONS(ALL_MODULES.CONTACT).DELETE]}>
                                <ActionIcon
                                    variant="subtle"
                                    size="sm"
                                    c={"surfaceGrey.7"}
                                    onClick={() => handleDelete(row.original._id.$oid, `${row.original.firstName} ${row.original.lastName}`)}
                                    title="Delete Contact"
                                >
                                    <IconTrash size="xxl" stroke={1.5} />
                                </ActionIcon>
                            </RoleWrapper>
                        </Group>
                    );
                }}
                onStateChange={({ pagination }) => {
                    getAllContacts(
                        {
                            params: {
                                page: pagination.pageIndex,
                                per_page: pagination.pageSize,
                            },
                        },
                        true
                    );
                }}
                enableRowActions={allowedActions}
            />
        </Page>
    )
}
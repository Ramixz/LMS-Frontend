import {
  useLazyGetAllUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation
} from "../../../services/users.api";
import { useLazyGetAllRolesQuery } from "../../../services/roles.api";
import DataTable from "../../../components/DataTable";
import Page from "../../../components/Layout/Page";
import { ActionIcon, Box, Button, Divider, Group, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconPlus, IconDownload, IconList, IconUserPlus, IconPencilMinus, IconTrash, IconUserEdit } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { UserForm } from "./Form";
import { toLocalFormattedDate } from "../../../lib/helpers";
import RoleWrapper from "../../../components/RoleWrapper";
import { ALL_MODULES } from "../../../lib/enums/modules";
import { PERMISSIONS } from "../../../lib/permissions";
import useHasPermission from "../../../hooks/checkPermission";

export default function Users() {
  const [getAllUsers, { data, isFetching, isLoading, isError }] = useLazyGetAllUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [getAllRoles, { data: rolesData }] = useLazyGetAllRolesQuery();

  const [roleOptions, setRoleOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    getAllRoles({
      params: {
        page: 0,
        per_page: 100,
        sort: 'roleName',
        order: 'asc'
      }
    });
  }, [getAllRoles]);

  useEffect(() => {
    if (rolesData?.data) {
      setRoleOptions(
        rolesData.data
          .filter((role: any) => role?.roleName?.trim())
          .map((role: any) => ({
            value:
              typeof role._id === 'object' && role._id.$oid
                ? role._id.$oid
                : role._id?.toString() || '',
            label: role.roleName?.trim() || 'Unnamed Role'
          }))
      );
    }
  }, [rolesData]);

  const handleAddUser = () => {
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
            <ActionIcon c={"secondary.7"} variant="transparent">
              <IconUserPlus size={22} />
            </ActionIcon>
          </Box>
          <Text><b>Add User</b></Text>
        </Group>
      ),
      centered: true,
      shadow: "0px",
      children: (
        <>
          <Divider mt={0} mb="xs" />
          <UserForm
            roleOptions={roleOptions}
            onSubmit={async (values) => {
              try {
                const response = await createUser({
                  ...values,
                  assignedRole: values.assignedRole
                }).unwrap();

                if (response.id) {
                  showNotification({
                    title: "Success",
                    message: `User "${values.firstName} ${values.lastName}" created successfully`,
                    color: "green",
                  });
                  modals.closeAll();
                }
              } catch (error) {
                showNotification({
                  title: "Error",
                  message: "User already exists",
                  color: "red",
                });
              }
            }}
          />
        </>
      )
    });
  };

  const handleEditUser = (user: any) => {
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
            <ActionIcon c={"secondary.7"} variant="transparent">
              <IconUserEdit size={22} />
            </ActionIcon>
          </Box>
          <Text><b>Review and Update User</b></Text>
        </Group>
      ),
      centered: true,
      shadow: "0px",
      children: (
        <UserForm
          user={user}
          isEditing={true}
          roleOptions={roleOptions}
          onSubmit={async (values) => {
            try {
              const userId = user._id.$oid;
              const response = await updateUser({
                data: values,
                id: userId
              }).unwrap();

              if (response.message === "Successfully Updated") {
                showNotification({
                  title: "Success",
                  message: `User "${values.firstName} ${values.lastName}" updated`,
                  color: "green",
                });
              }
              modals.closeAll();
            } catch (error) {
              showNotification({
                title: "Error",
                message: "Failed to update user",
                color: "red",
              });
            }
          }}
        />
      ),
    });
  };

  const handleDeleteUser = (id: string, firstName: string, lastName: string) => {
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
              <IconTrash size={22} />
            </ActionIcon>
          </Box>
          <Text><b>Delete this User?</b></Text>
        </Group>
      ),
      centered: true,
      shadow: "0px",
      children: (
        <Box>
          <Divider mt={0} mb="xs" />
          <Text size="sm" mb="md">
            Are you sure you want to delete user "{firstName} {lastName}"?
          </Text>
          <Group justify="flex-start" gap="sm">
            <Button
              variant="filled"
              color="red"
              onClick={async () => {
                try {
                  await deleteUser(id).unwrap();
                  showNotification({
                    title: "Success",
                    message: `User "${name}" deleted successfully`,
                    color: "green",
                  });
                  modals.closeAll();
                } catch (error) {
                  showNotification({
                    title: "Error",
                    message: `Failed to delete user "${name}"`,
                    color: "red",
                  });
                }
              }}
            >
              Delete
            </Button>
            <Button variant="outline" onClick={() => modals.closeAll()}>
              Cancel
            </Button>
          </Group>
        </Box>
      )
    });
  };
  const allowedActions = useHasPermission([PERMISSIONS(ALL_MODULES.USER).UPDATE, PERMISSIONS(ALL_MODULES.USER).DELETE])
  return (
    <Page pageTitle="Users" bgWhite>
      <Divider my="sm" size={"sm"} />
      <Group justify="end" mb="md" pr={"xxs"}>
        <RoleWrapper permissions={[PERMISSIONS(ALL_MODULES.USER).CREATE]}>
          <Button
            leftSection={<IconPlus size={20} />}
            onClick={handleAddUser}
          >
            User
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
          { header: "FIRST NAME", accessorKey: "firstName" },
          { header: "LAST NAME", accessorKey: "lastName" },
          { header: "EMAIL", accessorKey: "email" },
          { header: "STATUS", accessorKey: "status" },
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
        {...{ isFetching, isLoading, isError }}
        renderRowActions={({ row }: any) => (
          <Group gap="md">
            <RoleWrapper permissions={[PERMISSIONS(ALL_MODULES.USER).UPDATE]}>
              <ActionIcon
                variant="subtle"
                size="sm"
                c={"surfaceGrey.7"}
                onClick={() => handleEditUser(row.original)}
                title="Edit User"
              >
                <IconPencilMinus size="xxl" stroke={1.5} />
              </ActionIcon>
            </RoleWrapper>
            <RoleWrapper permissions={[PERMISSIONS(ALL_MODULES.USER).DELETE]}>
              <ActionIcon
                variant="subtle"
                size="sm"
                c={"surfaceGrey.7"}
                onClick={() => {
                  if (row.original && row.original._id) {
                    handleDeleteUser(row.original._id.$oid, row.original.firstName, row.original.lastName);
                  } else {
                    // console.error("row.original or row.original._id is undefined", row.original);
                  }
                }}

                title="Delete User"
              >
                <IconTrash size="xxl" stroke={1.5} />
              </ActionIcon>
            </RoleWrapper>
          </Group>
        )}
        onStateChange={({ pagination }: any) => {
          getAllUsers({
            params: {
              page: pagination.pageIndex,
              per_page: pagination.pageSize,
            },
          });
        }}
        enableRowActions={allowedActions}
      />
    </Page>
  );
}
import { ActionIcon, Box, Button, Divider, Group, Text } from "@mantine/core";
import { IconDownload, IconList, IconPencilMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { useDeleteRolesMutation, useLazyGetAllRolesQuery } from "../../../services/roles.api";
import Page from "../../../components/Layout/Page";
import DataTable from "../../../components/DataTable";
import { toLocalFormattedDate } from "../../../lib/helpers";
import PermissionsHoverCard from "../../../components/HoverCardComponent";
import useHasPermission from "../../../hooks/checkPermission";
import { PERMISSIONS } from "../../../lib/permissions";
import { ALL_MODULES } from "../../../lib/enums/modules";
import RoleWrapper from "../../../components/RoleWrapper";
import useNav from "../../../hooks/useNav";
import { Link } from "react-router-dom";
import routeFn from "../../../utils/routehelpers";

export default function Alert() {
  const [getAllRoles, { data, isFetching, isLoading, isError }] = useLazyGetAllRolesQuery();
  const [deleteRoles] = useDeleteRolesMutation();

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
          <Text><b>Delete this Role?</b></Text>
        </Group>
      ),
      centered: true,
      shadow: "0px",
      children: (
        <Box>
          <Divider mt={0} mb="xs" />
          <Text size="sm" mb="md">
            Are you sure you want to delete this Role?
          </Text>
          <Group justify="flex-start" gap="sm">
            <Button
              variant="filled"
              color="red"
              radius="sm"
              onClick={async () => {
                try {
                  const response = await deleteRoles(id).unwrap();
                  if (response.status === 200) {
                    showNotification({
                      title: "Success",
                      message: `Role "${name}" has been successfully deleted.`,
                      color: "green",
                    });
                  }
                  modals.closeAll();
                } catch (error) {
                  showNotification({
                    title: "Error",
                    message: `Unable to delete Role "${name}".`,
                    color: "red",
                  });
                }
              }}
            >
              Delete
            </Button>
            <Button
              variant="outline"
              radius="sm"
              onClick={() => modals.closeAll()}
            >
              Cancel
            </Button>
          </Group>
        </Box>
      )
    });
  };
const navigate = useNav();
const handleEdit = (id: string) => {
  navigate('roles.edit', { id }); 
};
  const allowedActions = useHasPermission([PERMISSIONS(ALL_MODULES.ROLES).UPDATE, PERMISSIONS(ALL_MODULES.ROLES).DELETE])

  return (
    <Page pageTitle="Roles" bgWhite>
      <Group justify="end" mb="md" pr={"xxs"}>
        <RoleWrapper permissions={[PERMISSIONS(ALL_MODULES.ROLES).CREATE]}>
          <Button component={Link} to={routeFn('roles.create',undefined,undefined)}  leftSection={<IconPlus size={20} />}>
            Role
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
            header: "Name",
            accessorKey: "roleName",
          },
          {
            header: "Created Time",
            accessorFn: (row) => {
              const { date, time } = toLocalFormattedDate(row.createdOn);
              return (
                <div>
                  <div>{date}, {time}</div>
                </div>
              );
            },
            accessorKey: "createdOn",
          },
          {
            header: "Updated Time",
            accessorFn: (row) => {
              const { date, time } = toLocalFormattedDate(row.updatedOn);
              return (
                <div>
                  <div>{date}, {time}</div>
                </div>
              );
            },
            accessorKey: "updatedOn",
          },
          {
            header: "Permissions",
            accessorFn: (row) => (
              <Group align="center">
                <Text>{(row.permissions?.length ?? 0).toString().padStart(2, "0")}</Text>
                <PermissionsHoverCard permissions={row.permissions} />
              </Group>
            ),
            accessorKey: "permissions",
          },
        ]}
        data={data?.data ?? []}
        {...{ isFetching, isLoading, isError }}
        renderRowActions={({ row }) => {
          return (
            <Group gap="md">
              <RoleWrapper permissions={[PERMISSIONS(ALL_MODULES.ROLES).UPDATE]}>
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  c={"surfaceGrey.7"}
                  onClick={() => handleEdit(row.original._id.$oid)}
                  title="Edit Role"
                >
                  <IconPencilMinus size="xxl" stroke={1.5} />
                </ActionIcon>
              </RoleWrapper>
              <RoleWrapper permissions={[PERMISSIONS(ALL_MODULES.ROLES).DELETE]}>
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  c={"surfaceGrey.7"}
                  onClick={() => handleDelete(row.original._id.$oid, row.original.roleName)}
                  title="Delete Role"
                >
                  <IconTrash size="xxl" stroke={1.5} />
                </ActionIcon>
              </RoleWrapper>
            </Group>
          );
        }}
        onStateChange={({ pagination }) => {
          getAllRoles({
            params: {
              page: pagination.pageIndex,
              per_page: pagination.pageSize,
              order: "desc",
              sort: "updatedOn"
            },
          });
        }}
        enableRowActions={allowedActions}
      />
    </Page>
  );
}

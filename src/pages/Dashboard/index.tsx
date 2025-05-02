import {
  useDeleteDashboardMutation,
  useEditDashboardMutation,
  useLazyGetAllDashboardsQuery,
  useCreateDashboardMutation,
} from "../../services/dashboard.api";
import DataTable from "../../components/DataTable";
import Page from "../../components/Layout/Page";
import { Button, Group, Text, Badge, Flex, Box, Divider, ActionIcon, Menu } from "@mantine/core";
import { IconDownload, IconLayoutDashboard, IconList, IconPencilMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { MantineHoverCardComponent } from "../../components/HoverCardComponent";
import DashboardForm, { DashboardFormValues } from "./Form";
import { Dashboard as DashboardResponse } from "../../types/Dashboard.type";
import RoleWrapper from "../../components/RoleWrapper";
import { PERMISSIONS } from "../../lib/permissions";
import { ALL_MODULES } from "../../lib/enums/modules";
import useHasPermission from "../../hooks/checkPermission";
import useNav from "../../hooks/useNav";


export default function Dashboard() {
  const [
    getAllDashboards,
    { data, isFetching, isLoading, isError, isUninitialized },
  ] = useLazyGetAllDashboardsQuery();

  const navigate = useNav();
  const [deleteDashboard] = useDeleteDashboardMutation();
  const [editDashboard] = useEditDashboardMutation();
  const [addDashboard] = useCreateDashboardMutation()

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
          <Text><b>Delete this dashboard?</b></Text>
        </Group>
      ),
      centered: true,
      shadow: "0px",
      children: (
        <Box>
          <Divider mt={0} mb="xs" />
          <Text size="sm" mb="md">
            Are you sure you want to delete this dashboard?
          </Text>
          <Group justify="flex-start" gap="sm">
            <Button
              variant="filled"
              color="red"
              radius="sm"
              onClick={async () => {
                try {
                  const response = await deleteDashboard(id).unwrap();
                  if (response.status_code === 200) {
                    showNotification({
                      title: "Success",
                      message: `Dashboard "${name}" has been successfully deleted.`,
                      color: "green",
                    });
                  }
                  modals.closeAll();
                } catch (error) {
                  showNotification({
                    title: "Error",
                    message: `Unable to delete dashboard "${name}".`,
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


  const handleEdit = (dashboard: DashboardResponse) => {
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
            <ActionIcon c={"secondary.7"} variant="transparent" size={"sm"}>
              <IconLayoutDashboard />
            </ActionIcon>
          </Box>
          <Text><b>Review and Update Your Dashboard</b></Text>
        </Group>
      ),
      centered: true,
      children: (
        <Box>
          <Divider mt={0} mb="xs" />
          <DashboardForm
            isEditing
            dashboard={dashboard}
            onSubmit={async (values: DashboardFormValues) => {
              try {
                const response = await editDashboard({
                  dashboardId: dashboard._id.$oid,
                  payload: values,
                }).unwrap();

                if (response.status_code === 200) {
                  showNotification({
                    title: "Success",
                    message: `Dashboard "${values.name}" updated successfully`,
                    color: "green",
                  });
                }
                modals.closeAll();
              } catch (error) {
                showNotification({
                  title: "Error",
                  message: "Failed to update dashboard",
                  color: "red",
                });
              }
            }}
          />
        </Box>
      ),
    });
  };

  const handleAddDashboard = () => {
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
            <ActionIcon c={"secondary.7"} variant="transparent" size={"sm"}>
              <IconLayoutDashboard />
            </ActionIcon>
          </Box>
          <Text><b>Create New Dashboard</b></Text>
        </Group>
      ),
      centered: true,
      children: (
        <Box>
          <Divider mt={0} mb="xs" />
          <DashboardForm
            onSubmit={async (values: DashboardFormValues) => {
              try {
                const response = await addDashboard(values).unwrap();

                if (response.id) {
                  showNotification({
                    title: "Success",
                    message: `Dashboard "${values.name}" created successfully`,
                    color: "green",
                  });
                }
                modals.closeAll();
              } catch (error) {
                showNotification({
                  title: "Error",
                  message: "Failed to create dashboard",
                  color: "red",
                });
              }
            }}
          />
        </Box>
      ),
    });
  };

  const allowedActions = useHasPermission([PERMISSIONS(ALL_MODULES.DASHBOARD).UPDATE, PERMISSIONS(ALL_MODULES.DASHBOARD).DELETE])
  return (
    <Page pageTitle="Dashboard" bgWhite>
      <Divider my="sm" size={"sm"} />
      <Group justify="end" mb="md" pr={"xxs"}>
        <RoleWrapper permissions={[PERMISSIONS(ALL_MODULES.DASHBOARD).CREATE]}>
          <Button leftSection={<IconPlus size={20} />} onClick={handleAddDashboard}>
            Dashboard
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
            header: "NAME",
            accessorKey: "name",

          },
          {
            header: "DESCRIPTION",
            accessorKey: "description",
          },
          {
            header: "CONNECTORS",
            accessorKey: "visualizationIds",
            Cell: ({ row }) => {
              const connectors = row?.original?.visualizationIds
                ?.map(({ connectorName, connectorid }) => ({ connectorName, connectorid }))
                .filter(
                  (value, index, array) =>
                    index === array.findIndex((t) => t.connectorid === value.connectorid)
                ) || [];

              if (connectors.length === 0) {
                return "";
              }
              const [menuOpened, setMenuOpened] = useState(false);
              return (
                <Flex align="center" justify="left" gap="xs" pt="xs" pb="xs" wrap="nowrap">
                  {connectors.slice(0, 3).map((connector) => {
                    return (
                      <MantineHoverCardComponent
                        key={connector.connectorid}
                        id={connector.connectorid}
                        trigger={
                          <Badge
                            style={{ backgroundColor: "rgba(182, 180, 186, 0.1)", color: "#84818A", fontWeight: 600, cursor: "pointer" }}
                            radius="sm"
                            onMouseEnter={() => setMenuOpened(false)}
                          >
                            {connector.connectorName}
                          </Badge>
                        }
                      />
                    );
                  })}

                  {connectors.length > 3 && (
                    <Menu
                      withinPortal
                      position="bottom"
                      withArrow
                      opened={menuOpened}
                      onOpen={() => setMenuOpened(true)}
                      onClose={() => setMenuOpened(false)}
                    >
                      <Menu.Target>
                        <Text
                          component="span"
                          size="xs"
                          style={{
                            cursor: "pointer",
                            color: "#84818A",
                            display: "inline-flex",
                            alignItems: "center",
                            lineHeight: "normal",
                          }}
                        >
                          ...(+{connectors.length - 3} more)
                        </Text>
                      </Menu.Target>
                      <Menu.Dropdown style={{ maxWidth: "300px", padding: "8px" }}>
                        <Group gap="xs" wrap="wrap">
                          {connectors.slice(3).map((connector) => {
                            return (
                              <MantineHoverCardComponent
                                key={connector.connectorid}
                                id={connector.connectorid}
                                trigger={
                                  <Badge
                                    style={{ backgroundColor: "rgba(182, 180, 186, 0.1)", color: "#84818A", fontWeight: 600, cursor: "pointer" }}
                                    radius="sm"
                                  >
                                    {connector.connectorName}
                                  </Badge>
                                }
                              />
                            );
                          })}
                        </Group>
                      </Menu.Dropdown>
                    </Menu>
                  )}
                </Flex>
              );
            },
            size: 350,
          },
          {
            header: "CHARTS",
            accessorKey: "chartCount",
            size: 100,
            Cell: ({ cell }) => {
              const value = cell.getValue<number>();
              return value < 10 ? `0${value}` : value;
            }
          },
        ]}
        data={data?.data ?? []}
        {...{ isFetching, isLoading: isLoading || isUninitialized, isError }}
        renderRowActions={({ row }) => {
          return (
            <Flex gap="md">
              <RoleWrapper permissions={[PERMISSIONS(ALL_MODULES.DASHBOARD).UPDATE]}>
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  c={"surfaceGrey.7"}
                  onClick={(e) => {
                    e.stopPropagation(); // prevent row click
                    handleEdit(row.original);
                  }}                  
                  title="Edit Dashboard"
                >
                  <IconPencilMinus size="xxl" stroke={1.5} />
                </ActionIcon>
              </RoleWrapper>
              <RoleWrapper permissions={[PERMISSIONS(ALL_MODULES.DASHBOARD).DELETE]}>
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  c={"surfaceGrey.7"}
                  onClick={(e) => {
                    e.stopPropagation(); // prevent row click
                    handleDelete(row.original._id.$oid, row.original.name);
                  }}                 
                   title="Delete Dashboard"
                >
                  <IconTrash size="xxl" stroke={1.5} />
                </ActionIcon>
              </RoleWrapper>
            </Flex>
          );
        }}

        onStateChange={({ pagination }) => {
          getAllDashboards(
            {
              params: {
                page: pagination.pageIndex,
                per_page: pagination.pageSize,
              },
            },
            true
          );
        }}
        enableRowActions = {allowedActions}
        mantineTableBodyRowProps={({ row }) => ({
          onClick: () => {
            const id = row.original._id?.$oid || row.original.id; // Adjust ID extraction
            if (id) {
              navigate("dashboard.show", { id });
              console.log("iiii",id);
              
               // Navigate to separate page
            }
          },
          sx: { cursor: "pointer" },
        })}
      />
    </Page>
  );
}

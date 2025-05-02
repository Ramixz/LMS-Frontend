import { ActionIcon, Box, Button, Divider, Group, Menu, Text } from "@mantine/core";
import DataTable from "../../components/DataTable";
import Page from "../../components/Layout/Page";
import { toLocalFormattedDate } from "../../lib/helpers";
import { useDeleteCorrelationMutation, useGetCorrelationSchedulerTriggerMutation, useLazyGetAllCorrelationQuery } from "../../services/correlation.api";
import { IconBolt, IconDatabaseSearch, IconDots, IconDownload, IconList, IconPlus, IconSitemap, IconTrash } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { CorrelationHoverCard } from "../../components/HoverCardComponent";
import RoleWrapper from "../../components/RoleWrapper";
import { PERMISSIONS } from "../../lib/permissions";
import { ALL_MODULES } from "../../lib/enums/modules";
import useHasPermission from "../../hooks/checkPermission";
import { Link } from "react-router-dom";
import routeFn from "../../utils/routehelpers";
export default function Correlation() {
  const [getAllVisualization, { data, isFetching, isLoading, isError }] =
    useLazyGetAllCorrelationQuery();
  const [deleteCorrelation] = useDeleteCorrelationMutation();
  const [getCorrelationSchedulerTrigger] = useGetCorrelationSchedulerTriggerMutation();
  const handleDelete = (id: string) => {
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
          <Text><b>Delete this Correlation?</b></Text>
        </Group>
      ),
      centered: true,
      shadow: "0px",
      children: (
        <Box>
          <Divider mt={0} mb="xs" />
          <Text size="sm" mb="md">
            Are you sure you want to delete this Correlation?
          </Text>
          <Group justify="flex-start" gap="sm">
            <Button
              variant="filled"
              color="red"
              onClick={async () => {
                try {
                  await deleteCorrelation(id).unwrap();

                  showNotification({
                    title: "Success",
                    message: `Visualization has been successfully deleted.`,
                    color: "green",
                  });
                  modals.closeAll();
                } catch (error) {
                  showNotification({
                    title: "Error",
                    message: `Failed to delete visualization. Please try again.`,
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
  const handleTrigger =async (id: string) => { 
    try {
      const response = await getCorrelationSchedulerTrigger(id).unwrap();
      if (response.success) {
        showNotification({
          title: "Success",
          message: `Successfully triggered the scheduler`,
          color: "green",
        });
      } else {
        showNotification({
          title: "Error",
          message: `Error while  triggered the scheduler`,
          color: "red",
        });
      }
    } catch (error) {
      showNotification({
        title: "Error",
        message: `Something went wrong while triggered the scheduler. Please try again later.`,
        color: "red",
      });
    }
  }

  const allowedActions = useHasPermission([PERMISSIONS(ALL_MODULES.CORRELATION).UPDATE, PERMISSIONS(ALL_MODULES.CORRELATION).DELETE])
  return (
    <Page pageTitle="Correlation" bgWhite>
      <Divider my="sm" size={"sm"} />
      <Group justify="end" mb="md" pr={"xxs"}>
        <RoleWrapper permissions={[PERMISSIONS(ALL_MODULES.CORRELATION).CREATE]} >
          <Button component={Link}  to={routeFn("correlation.create",undefined,undefined)} leftSection={<IconPlus size={20} />}>
            Correlation
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
            accessorKey: "correlationName",
          },
          {
            header: "CONNECTORS",
            accessorFn: (row) => <CorrelationHoverCard connectors={row.connectors || []} joins={row.payload?.joins || []} />,
            accessorKey: "connectors",
          },
          {
            header: "CREATED DATE",
            accessorFn: (row) => {
              const { date, time } = toLocalFormattedDate(row.createdAt);
              return (
                <div>
                  <div>{date},</div>
                  <div>{time}</div>
                </div>
              );
            },
            accessorKey: "createdAt",
          },
          {
            header: "UPDATED DATE",
            accessorFn: (row) => {
              const { date, time } = toLocalFormattedDate(row.updatedAt);
              return (
                <div>
                  <div>{date},</div>
                  <div>{time}</div>
                </div>
              );
            },
            accessorKey: "updatedAt",
          },
        ]}
        data={data?.data ?? []}
        {...{ isFetching, isLoading, isError }}
        renderRowActions={({ row }) => {
          return (
            <Menu position="left-start" withArrow withinPortal>
              <Menu.Target>
                <Button variant="subtle">
                  <IconDots size={22} color="black" />
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <RoleWrapper permissions={[PERMISSIONS(ALL_MODULES.CORRELATION).READ]}>
                  <Menu.Item leftSection={<IconSitemap size={21} stroke={1.5} />}>
                    View Schema
                  </Menu.Item>
                </RoleWrapper>
                <RoleWrapper permissions={[PERMISSIONS(ALL_MODULES.CORRELATION).READ]}>
                  <Menu.Item leftSection={<IconDatabaseSearch size={21} stroke={1.5} />}>
                    View Data
                  </Menu.Item>
                </RoleWrapper>
                <RoleWrapper permissions={[PERMISSIONS(ALL_MODULES.CORRELATION).UPDATE]}>
                  <Menu.Item  onClick={() => handleTrigger(row.original._id.$oid)} leftSection={<IconBolt size={21} stroke={1.5} />}>
                    Scheduler Trigger
                  </Menu.Item>
                </RoleWrapper>
                <RoleWrapper permissions={[PERMISSIONS(ALL_MODULES.CORRELATION).DELETE]}>
                  <Menu.Item
                    leftSection={<IconTrash size={21} stroke={1.5} color="red" />}
                    onClick={() => handleDelete(row.original._id.$oid)}
                    c={"red"}>
                    Delete
                  </Menu.Item>
                </RoleWrapper>
              </Menu.Dropdown>
            </Menu>
          );

        }}
        onStateChange={({ pagination }) => {
          getAllVisualization({
            params: {
              page: pagination.pageIndex,
              per_page: pagination.pageSize,
            },
          });
        }}
        enableRowActions = {allowedActions}
      />
    </Page>
  );
}

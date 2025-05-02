import { useDeleteVisualizationMutation, useLazyGetAllVisualizationQuery } from "../../services/visualization.api";
import DataTable from "../../components/DataTable";
import Page from "../../components/Layout/Page";
import { ActionIcon, Box, Button, Divider, Flex, Group, Text } from "@mantine/core";
import { IconDownload, IconList, IconPencilMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { toLocalFormattedDate } from "../../lib/helpers";
import { visualizationTypeMap } from "../../lib/constants/visualizations-types";
import { visualizationTypeIcons } from "../../lib/constants/visualization-icons";
import RoleWrapper from "../../components/RoleWrapper";
import { PERMISSIONS } from "../../lib/permissions";
import { ALL_MODULES } from "../../lib/enums/modules";
import useHasPermission from "../../hooks/checkPermission";

export default function Visualization() {
  const [getAllVisualization, { data, isFetching, isLoading, isError }] =
    useLazyGetAllVisualizationQuery();
  const [deleteVisualization] = useDeleteVisualizationMutation();

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
          <Text><b>Delete this visualization?</b></Text>
        </Group>
      ),
      centered: true,
      shadow: "0px",
      children: (
        <Box>
          <Divider mt={0} mb="xs" />
          <Text size="sm" mb="md">
            Are you sure you want to delete this visualization?
          </Text>
          <Group justify="flex-start" gap="sm">
            <Button
              variant="filled"
              color="red"
              radius="sm"
              onClick={async () => {
                try {
                  await deleteVisualization({
                    visualizationId: id,
                    view: "library"
                  }).unwrap();

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
  const allowedActions = useHasPermission([PERMISSIONS(ALL_MODULES.VISUALIZATION).UPDATE, PERMISSIONS(ALL_MODULES.VISUALIZATION).DELETE])
  return (
    <Page pageTitle="Visualizations" bgWhite>
      <Divider my="sm" size={"sm"} />
      <Group justify="end" mb="md" pr={"xxs"}>
        <RoleWrapper permissions={[PERMISSIONS(ALL_MODULES.VISUALIZATION).CREATE]}>
          <Button leftSection={<IconPlus size={20} />}>
            Visualization
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
            accessorKey: "visualizationTitle",
          },
          {
            header: "TYPE",
            accessorFn: (row) => (
              <Group gap="xs">
                {visualizationTypeIcons[row.visualizationType] || null}
                {visualizationTypeMap[row.visualizationType] || row.visualizationType}
              </Group>
            ),
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
          {
            header: "UPDATE DATE",
            accessorFn: (row) => {
              const { date, time } = toLocalFormattedDate(row.updatedOn);
              return (
                <div>
                  <div>{date},</div>
                  <div>{time}</div>
                </div>
              );
            },
            accessorKey: "updatedOn",
          },
          {
            header: "CONNECTOR",
            accessorFn: ({ connectorInfo }) => connectorInfo?.connectorInfo.name
          },
        ]}
        data={data?.data ?? []}
        {...{ isFetching, isLoading, isError }}
        renderRowActions={({ row }) => {
          return (
            <Flex gap="md">
              <RoleWrapper permissions={[PERMISSIONS(ALL_MODULES.VISUALIZATION).UPDATE]}>
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  c={"surfaceGrey.7"}
                  // onClick={() => handleEdit(row.original)}
                  title="Edit Dashboard"
                >
                  <IconPencilMinus size="xxl" stroke={1.5} />
                </ActionIcon>
              </RoleWrapper>
              <RoleWrapper permissions={[PERMISSIONS(ALL_MODULES.VISUALIZATION).DELETE]}>
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  c={"surfaceGrey.7"}
                  onClick={() => handleDelete(row.original._id.$oid)}
                  title="Delete Dashboard"
                >
                  <IconTrash size="xxl" stroke={1.5} />
                </ActionIcon>
              </RoleWrapper>
            </Flex>
          )

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
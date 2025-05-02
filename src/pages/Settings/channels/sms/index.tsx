import { ActionIcon, Box, Group, Divider, Text, Button } from "@mantine/core";
import DataTable from "../../../../components/DataTable";
import { useLazyGetAllNotificationChannelsQuery, useEditChannelMutation, useDeleteChannelMutation } from "../../../../services/channel.api";
import { IconPencilMinus, IconTrash } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { ChannelForm } from "../ChannelForm";
import { NotificationModuleType } from "../../../../lib/enums/NotificationModuleType";
import RoleWrapper from "../../../../components/RoleWrapper";
import { ALL_MODULES } from "../../../../lib/enums/modules";
import { PERMISSIONS } from "../../../../lib/permissions";
import useHasPermission from "../../../../hooks/checkPermission";

export default function SMS() {
  const [getAllNotificationChannels, { data, isLoading, isError, isFetching }] = useLazyGetAllNotificationChannelsQuery();
  const [updateChannel] = useEditChannelMutation();
  const [deleteChannel] = useDeleteChannelMutation();

  const handleEditChannel = (channel: any) => {
    modals.open({
      title: (
        <Group>
          <Box
            style={(theme) => ({
              borderRadius: theme.radius.xs,
              border: `1px solid ${theme.colors.gray[4]}`,
              padding: theme.spacing.xs,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            })}
          >
            <ActionIcon c={"secondary.7"} variant="transparent" size={"md"}>
              <IconPencilMinus />
            </ActionIcon>
          </Box>
          <Text><b>Edit Channel</b></Text>
        </Group>
      ),
      centered: true,
      children: (
        <>
          <Divider mt={0} mb="xs" />
          <ChannelForm
            channel={channel}
            onSubmit={async (values) => {
              try {
                await updateChannel({
                  id: channel._id.$oid,
                  data: values
                }).unwrap();
                showNotification({
                  title: "Success",
                  message: `Channel "${values.name}" updated successfully`,
                  color: "green",
                });
                modals.closeAll();
              } catch (error) {
                showNotification({
                  title: "Error",
                  message: "Failed to update channel",
                  color: "red",
                });
              }
            }}
          />
        </>
      )
    });
  };

  const handleDeleteChannel = (id: string, name: string) => {
    modals.open({
      title: (
        <Group>
          <Box
            style={(theme) => ({
              borderRadius: theme.radius.xs,
              border: `1px solid ${theme.colors.gray[4]}`,
              padding: theme.spacing.xs,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            })}
          >
            <ActionIcon c={"danger.7"} variant="transparent">
              <IconTrash size={"22"} />
            </ActionIcon>
          </Box>
          <Text><b>Delete this Channel?</b></Text>
        </Group>
      ),
      centered: true,
      children: (
        <Box>
          <Divider mt={0} mb="xs" />
          <Text size="sm" mb="md">
            Are you sure you want to delete the channel "{name}"? This action is irreversible.
          </Text>
          <Group justify="flex-start" gap="sm">
            <Button
              variant="filled"
              color="red"
              onClick={async () => {
                try {
                  const response = await deleteChannel(id).unwrap();
                  if (response.message === "Successfully Deleted") {
                    showNotification({
                      title: "Success",
                      message: `Channel "${name}" has been successfully deleted.`,
                      color: "green",
                    });
                  }
                  modals.closeAll();
                } catch (error) {
                  showNotification({
                    title: "Error",
                    message: `Failed to delete channel "${name}".`,
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
      ),
    });
  };
  const allowedActions = useHasPermission([PERMISSIONS(ALL_MODULES.NOTIFICATIONCHANNEL).UPDATE, PERMISSIONS(ALL_MODULES.NOTIFICATIONCHANNEL).DELETE])
  return (
    <Box>
      <DataTable
        totalRowCount={data?.total_items ?? 0}
        columns={[
          { header: "NAME", accessorKey: "name" },
          { header: "BASE URL", accessorKey: "config.baseUrl" },
          { header: "PLAN ID", accessorKey: "config.plan_id" },
          { header: "SENDER SMS", accessorKey: "config.senderSMS" },
          { header: "MODULE", accessorKey: "module" },
          { header: "STATUS", accessorKey: "status" }
        ]}
        data={data?.data ?? []}
        {...{ isFetching, isLoading, isError }}
        renderRowActions={({ row }: { row: any }) => (
          <Group gap="xs">
            <RoleWrapper permissions={[PERMISSIONS(ALL_MODULES.NOTIFICATIONCHANNEL).UPDATE]}>
              <ActionIcon
                variant="subtle"
                size="sm"
                title="Edit Channel"
                onClick={() => handleEditChannel(row.original)}
              >
                <IconPencilMinus size={20} stroke={1.5} />
              </ActionIcon>
            </RoleWrapper>
            <RoleWrapper permissions={[PERMISSIONS(ALL_MODULES.NOTIFICATIONCHANNEL).DELETE]}>
              <ActionIcon
                variant="subtle"
                size="sm"
                title="Delete Channel"
                onClick={() => handleDeleteChannel(row.original._id.$oid, row.original.name)}
              >
                <IconTrash size={20} stroke={1.5} />
              </ActionIcon>
            </RoleWrapper>
          </Group>
        )}
        onStateChange={({ pagination }) => {
          getAllNotificationChannels({
            params: {
              page: pagination.pageIndex,
              per_page: pagination.pageSize,
            },
            module_type: NotificationModuleType.SINCH_SMS
          });
        }}
        enableRowActions={allowedActions}
      />
    </Box>
  );
}

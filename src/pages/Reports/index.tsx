/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import DataTable from "../../components/DataTable";

import { Button, Switch, Group, Text, Divider, ActionIcon, Flex, Box } from "@mantine/core";
import { IconDownload, IconList, IconMail, IconPencilMinus, IconPlus, IconTrash } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import moment from "moment";
import { useLazyGetAllReportsQuery, useDeleteReportMutation, useToggleCronStatusMutation, useReportsInstantTriggerMutation } from "../../services/report.api";
import Page from "../../components/Layout/Page";
import { toLocalFormattedDate } from "../../lib/helpers";
import { Link } from "react-router-dom";
import routeFn from "../../utils/routehelpers";
import RoleWrapper from "../../components/RoleWrapper";
import { PERMISSIONS } from "../../lib/permissions";
import { ALL_MODULES } from "../../lib/enums/modules";
import useHasPermission from "../../hooks/checkPermission";
import useNav from "../../hooks/useNav";

export default function Reports() {
  const [fetchReports, { data, isFetching, isLoading, isError }] = useLazyGetAllReportsQuery();
  const [toggleCronStatus] = useToggleCronStatusMutation();
  const [deleteReport] = useDeleteReportMutation();
  const [triggerReport] = useReportsInstantTriggerMutation();


  const handleToggleStatus = async (reportId: string, currentStatus: string, setChecked: (checked: boolean) => void) => {
    const newStatus = currentStatus.toLowerCase() === "active" ? "pause" : "start";

    try {
      const toggleResponse = await toggleCronStatus({ reportId, status: newStatus });
      if (toggleResponse.data?.success) {
        showNotification({
          title: "Success",
          message: `Alert status has been successfully ${newStatus === "start" ? "activated" : "paused"}.`,
          color: "green",
        });
      } else {
        setChecked(currentStatus.toLowerCase() === "active");
        showNotification({
          title: "Error",
          message: "Unable to change the alert status.",
          color: "red",
        });
      }
    } catch (error) {
      setChecked(currentStatus.toLowerCase() === "active");
      showNotification({
        title: "Error",
        message: "Unable to change the alert status.",
        color: "red",
      });
    }
  };

  const handleTrigger = async (reportId: string) => {
    try {
      const response = await triggerReport(reportId).unwrap();
      if (response.success) {
        showNotification({
          title: "Success",
          message: `Your report is being generated and will be sent to your email.`,
          color: "green",
        });
      } else {
        showNotification({
          title: "Error",
          message: `We were unable to generate your report. Please try again later.`,
          color: "red",
        });
      }
    } catch (error) {
      showNotification({
        title: "Error",
        message: `Something went wrong while requesting the report. Please try again later.`,
        color: "red",
      });
    }
  }

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
          <Text><b>Delete this Report?</b></Text>
        </Group>
      ),
      centered: true,
      shadow: "0px",
      children: (
        <Box>
          <Divider mt={0} mb="xs" />
          <Text size="sm" mb="md">
            Are you sure you want to delete this Report?
          </Text>
          <Group justify="flex-start" gap="sm">
            <Button
              variant="filled"
              color="red"
              radius="sm"
              onClick={async () => {
                try {
                  const response = await deleteReport(id).unwrap();
                  if (response.status === 200) {
                    showNotification({
                      title: "Success",
                      message: `Report "${name}" has been successfully deleted.`,
                      color: "green",
                    });
                  }
                  modals.closeAll();
                } catch (error) {
                  showNotification({
                    title: "Error",
                    message: `Unable to delete Report "${name}".`,
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

  const allowedCron = useHasPermission([PERMISSIONS(ALL_MODULES.REPORTS).UPDATE])
  const allowedActions = useHasPermission([PERMISSIONS(ALL_MODULES.REPORTS).UPDATE, PERMISSIONS(ALL_MODULES.REPORTS).DELETE])

  const navigate = useNav();
  const handleEditClick = (id: string) => {
    navigate("ConfigureReport.edit", { id });
  };
  // edit part
  return (
    <Page pageTitle="Reports" bgWhite>
      <Divider my="sm" size={"sm"} />
      <Group justify="end" mb="md" pr={"xxs"}>
        <RoleWrapper permissions={[PERMISSIONS(ALL_MODULES.REPORTS).CREATE]}>
        <Button leftSection={<IconPlus size={20} />} component={Link} to={routeFn("ConfigureReport.create",undefined,undefined)}>
          Report
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
            header: "REPORT NAME",
            accessorKey: "reportName",
          },
          {
            header: "NEXT RUN TIME",
            accessorKey: "nextRunTime",
            Cell: ({ row }) => {
              const nextRunTime = row.original.nextRunTime;
              return nextRunTime !== "Not Running" ? moment(nextRunTime).format("Do MMM, YYYY, hh:mm") : nextRunTime;
            },
            maxSize: 25
          },
          {
            header: "CRON STATUS",
            accessorFn: (row) => {
              const cronStatus = row.cronStatus || "";
              const reportId = row.id;
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const [checked, setChecked] = useState(cronStatus.toLowerCase() === "active");

              return (
                <Switch
                  checked={checked}
                  onChange={() => {
                    setChecked(!checked);
                    handleToggleStatus(reportId, cronStatus, setChecked);
                  }}
                  c="primary.8"
                  size="md"
                />
              );
            },
            accessorKey: "cron_status",
            visibleInShowHideMenu: allowedCron,
            maxSize: 25
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
            maxSize: 25
          },
          {
            header: "UPDATED DATE",
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
            maxSize: 25
          },
        ]}
        data={data?.data ?? []}
        {...{ isFetching, isLoading, isError }}
        renderRowActions={({ row }) => (
          <Flex gap="md">
            <RoleWrapper permissions={[PERMISSIONS(ALL_MODULES.REPORTS).UPDATE]}>
              <ActionIcon
                variant="subtle"
                size="sm"
                c={"surfaceGrey.7"}
                title="Edit Report"
                onClick={() => handleEditClick(row.original.id)}          
                   >
                <IconPencilMinus size="xxl" stroke={1.5} />
              </ActionIcon>
            </RoleWrapper>
            <RoleWrapper permissions={[PERMISSIONS(ALL_MODULES.REPORTS).UPDATE]}>
              <ActionIcon
                variant="subtle"
                size="sm"
                c={"surfaceGrey.7"}
                onClick={() => handleTrigger(row.original.id)}
                title="Generate Report"
              >
                <IconMail size="xxl" stroke={1.5} />
              </ActionIcon>
            </RoleWrapper>
            <RoleWrapper permissions={[PERMISSIONS(ALL_MODULES.REPORTS).DELETE]}>
              <ActionIcon
                variant="subtle"
                size="sm"
                c={"surfaceGrey.7"}
                onClick={() => handleDelete(row.original.id, row.original.reportName)}
                title="Delete Report"
              >
                <IconTrash size="xxl" stroke={1.5} />
              </ActionIcon>
            </RoleWrapper>
          </Flex>
        )}
        onStateChange={({ pagination }) => {
          fetchReports({ params: { page: pagination.pageIndex, per_page: pagination.pageSize } });
        }}
        initialState={{ columnVisibility: { cron_status: allowedCron } }}
        enableRowActions={allowedActions}
      />
    </Page>
  );
}
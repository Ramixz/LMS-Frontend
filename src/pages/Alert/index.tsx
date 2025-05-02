import { Tabs, TextInput, Divider, Text, Badge, Group, Button } from "@mantine/core";
import DataTable from "../../components/DataTable";
import { useLazyGetAllAlertsQuery } from "../../services/alert.api";
import { colors } from "../../lib/constants/theme-colors";
import { toLocalFormattedDate } from "../../lib/helpers";
import { IconDownload, IconList } from "@tabler/icons-react";
import ConfiguredAlerts from "./ConfiguredAlert";
import Page from "../../components/Layout/Page";

export default function Alert() {
  const [getAllAlerts, { data, isFetching, isLoading, isError }] =
    useLazyGetAllAlertsQuery();

  return (
    <Page pageTitle="Alerts" bgWhite>
      
      <Divider my="sm" />

      <Tabs defaultValue="allAlerts">
        <Tabs.List>
          <Tabs.Tab value="allAlerts">All Alerts</Tabs.Tab>
          <Tabs.Tab value="configuredAlerts">Configured Alerts</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="allAlerts">
          
          <Group justify="space-between" align="center" mb="md" pr={"xxs"}>

            <TextInput mt={"sm"} placeholder="Search..." style={{ maxWidth: 400 }} />

            <Group gap="sm" mt={"sm"}>
              <Button leftSection={<IconDownload size={20} />} variant="outline">
                Download
              </Button>
              <Button leftSection={<IconList size={20} />} variant="outline">
                View
              </Button>
            </Group>
          </Group>

          <div style={{ width: "100%", overflowX: "auto", marginTop: "10px" }}>
            <DataTable
              totalRowCount={data?.total_items ?? 0}
              columns={[
                { header: "MESSAGE", accessorKey: "message" },
                {
                  header: "SEVERITY",
                  accessorKey: "severity",
                  Cell: ({ row }) => {
                    const severity = String(row.original.severity || "").toLowerCase();

                    return (
                      <Text style={{ color: severity === "critical" ? "red" : "black" }}>
                        {severity === "critical" ? severity.toUpperCase() : severity}
                      </Text>
                    );
                  },
                },
                { header: "THRESHOLD", accessorKey: "threshold" },
                { header: "THRESHOLD SET", accessorKey: "thresholdSet" },
                {
                  header: "ALERT STATUS",
                  accessorKey: "alertStatus",
                  Cell: ({ row }) => {
                    const status = String(row.original.alertStatus || "").toLowerCase();

                    const statusConfig: Record<string, { text: string; background: string; label: string }> = {
                      open: { text: colors.success[10], background: colors.success[11], label: "Open" },
                      closed: { text: colors.danger[10], background: colors.danger[11], label: "Closed" },
                      paused: { text: colors.warning[10], background: colors.warning[11], label: "Paused" },
                    };

                    const { text, background, label } = statusConfig[status] || {
                      text: colors.surfaceGrey[6],
                      background: colors.surfaceGrey[2],
                      label: "Unknown",
                    };

                    return (
                      <Badge
                        style={{
                          backgroundColor: background,
                          color: text,
                          fontWeight: 600,
                          textTransform: "none",
                        }}
                        radius="sm"
                      >
                        {label}
                      </Badge>
                    );
                  },
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
                  accessorKey: "createdOn"
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
                  accessorKey: "updatedOn"
                },
              ]}
              data={data?.data ?? []}
              {...{ isFetching, isLoading, isError }}
              onStateChange={({ pagination }) => {
                getAllAlerts({
                  params: {
                    page: pagination.pageIndex,
                    per_page: pagination.pageSize,
                  },
                });
              }}
            />
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="configuredAlerts">
              <ConfiguredAlerts/>
        </Tabs.Panel>
      </Tabs>
    </Page>
  );
}

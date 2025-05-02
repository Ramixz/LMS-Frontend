import { Badge, Box, Button, Group, Switch, TextInput } from "@mantine/core";
import { useLazyGetAllJobsQuery, useToggleCronStatusMutation, useLazyAlertPreviewQuery } from "../../../services/alert.api";
import DataTable from "../../../components/DataTable";
import { Job } from "../../../types/alert.type";
import { toLocalFormattedDate } from "../../../lib/helpers";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { IconDownload, IconList, IconPlus, IconRefresh } from "@tabler/icons-react";
import { colors } from "../../../lib/constants/theme-colors";
import { Link } from "react-router-dom";
import routeFn from "../../../utils/routehelpers";

export default function ConfiguredAlerts() {
    const [getAllJobs, { data, isFetching, isLoading, isError }] = useLazyGetAllJobsQuery();
    const [toggleCronStatus] = useToggleCronStatusMutation();
    const [fetchAlertPreview] = useLazyAlertPreviewQuery();

    const handleToggleStatus = async (jobId: string, currentStatus: string, setChecked: (checked: boolean) => void) => {
        const newStatus = currentStatus === "active" ? "pause" : "start";

        try {
            const toggleResponse = await toggleCronStatus({ jobId, status: newStatus });
            if (toggleResponse.data?.success) {
                showNotification({
                    title: "Success",
                    message: `Alert status has been successfully ${newStatus === "start" ? "activated" : "paused"}.`,
                    color: "green",
                });
            } else {
                setChecked(currentStatus === "active");
                showNotification({
                    title: "Error",
                    message: "Unable to change the alert status.",
                    color: "red",
                });
            }
        } catch (error) {
            setChecked(currentStatus === "active");
            showNotification({
                title: "Error",
                message: "Unable to change the alert status.",
                color: "red",
            });
        }
    };

    return (
        <Box>
            <Group justify="space-between" align="center" mb="md" pr={"xxs"}>
                <TextInput mt={"sm"} placeholder="Search..." style={{ maxWidth: 400 }} />

                <Group gap="sm" mt={"sm"}>
                         <Button leftSection={<IconPlus size={20} />}  component={Link} to={routeFn("ConfigureAlert.index",undefined,undefined)} >
                                          Add Alert
                                        </Button>
                    <Button leftSection={<IconDownload size={20} />} variant="outline">
                        Download
                    </Button>
                    <Button leftSection={<IconList size={20} />} variant="outline">
                        View
                    </Button>
                </Group>
            </Group>

            <DataTable
                totalRowCount={data?.total_items ?? 0}
                columns={[
                    { header: "ALERT NAME", accessorKey: "jobName" },
                    { header: "MESSAGE", accessorKey: "message" },
                    {
                        header: "STATUS",
                        accessorKey: "jobStatus",
                        Cell: ({ row }) => {
                            const status = String(row.original.jobStatus || "").toLowerCase();
                            const statusConfig: Record<string, { text: string; background: string; label: string }> = {
                                enable: { text: colors.success[10], background: colors.success[11], label: "ENABLE" },
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
                        header: "CRON STATUS",
                        accessorFn: (row) => {
                            const cronStatus = row.cron_status;
                            const jobId = row._id;
                            const [checked, setChecked] = useState(cronStatus === "active");

                            return (
                                <Switch
                                    checked={checked}
                                    onChange={() => {
                                        setChecked(!checked);
                                        handleToggleStatus(jobId.$oid, cronStatus, setChecked);
                                    }}
                                    c="primary.8"
                                    size="md"
                                />
                            );
                        },
                        accessorKey: "cron_status",
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
                    },
                    {
                        header: "THRESHOLD VALUE",
                        Cell: ({ row }) => {
                            const jobId = row.original._id;

                            const handlePreview = async () => {
                                try {
                                    const response = await fetchAlertPreview(jobId.$oid).unwrap();
                                    if (response.success) {
                                        showNotification({
                                            title: "Alert Preview",
                                            message: `Threshold: ${response.thresoldValue}, Message: ${response.message}`,
                                            color: "#0D2653",
                                        });
                                    } else {
                                        showNotification({
                                            title: "Error",
                                            message: "Failed to fetch alert preview.",
                                            color: "red",
                                        });
                                    }
                                } catch (error) {
                                    showNotification({
                                        title: "Error",
                                        message: "An error occurred while fetching alert preview.",
                                        color: "red",
                                    });
                                }
                            };

                            return (
                                <Button variant="transparent" onClick={handlePreview}>
                                    <IconRefresh size={25} style={{ color: colors.danger[7] }} />
                                </Button>
                            );
                        },
                    },
                ]}
                data={(data?.data as Job[]) ?? []}
                {...{ isFetching, isLoading, isError }}
                onStateChange={({ pagination }) => {
                    getAllJobs({ params: { page: pagination.pageIndex, per_page: pagination.pageSize } });
                }}
            />
        </Box>
    );
}

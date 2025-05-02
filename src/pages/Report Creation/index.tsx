/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-debugger */
import { useForm, zodResolver } from "@mantine/form";
import Page from "../../components/Layout/Page";
import {
  Box,
  Button,
  Group,
  Title,
  Divider,
  Card,
  TextInput,
  Text,
  Tooltip,
  ActionIcon,
  Stack,
  Grid,
  Select,
  MultiSelect,
  Flex,
} from "@mantine/core";
import {
  IconAddressBook,
  IconInfoCircle,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { ReportFormSchema } from "./reportvalidationSchema";
import { useLazyGetAllDashboardsQuery } from "../../services/dashboard.api";
import { useEffect, useState } from "react";
import {
  useAddContactMutation,
  useLazyGetAllContactsQuery,
} from "../../services/contact.api";
import { useCreateReportMutation, useGetReportByIDMutation, useUpdateReportMutation, useUpdateSchedulerReportStatusMutation } from "../../services/report.api";
import { showNotification } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import ContactForm from "../Settings/Contacts/Form";
import { ContactFormValues } from "../../types/contact.type";
import {  useParams } from "react-router-dom";
import { NotificationModuleType } from "../../lib/enums/NotificationModuleType";
import { ChannelForm } from "../Settings/channels/ChannelForm";
import {
  useCreateChannelMutation,
  useLazyGetAllChannelsQuery,
} from "../../services/channel.api";
import useNav from "../../hooks/useNav";
import { threshold } from "../../types/Dashboard.type";

export default function ReportCreation() {
  const {id}=useParams();
  const [getReportByID, {data:reportEditDetails}] = useGetReportByIDMutation();
  const [updateReport] = useUpdateReportMutation();
  const [updateSchedulerReportStatus] = useUpdateSchedulerReportStatusMutation();
  const navigate = useNav();


  // Remove threshold
  const removeThreshold = (index: number) => {
    form.removeListItem("dashboards", index);
  };
  const [activeTab, setActiveTab] = useState<NotificationModuleType>(
    NotificationModuleType.EMAIL
  );
  const form = useForm({
    initialValues: {
      reportName: "",
      dashboards:  [
        {
          dashboardId: "",
         dashboardName: "",
          timePeriod: "",
        },
      ],
      contacts:  [],
      channels: "",
      cronExpression:"",
    },
    validate: zodResolver(ReportFormSchema),
  });
  
  const [getAllDashboards, { data }] = useLazyGetAllDashboardsQuery();
  const [getAllContacts, { data: contactList }] = useLazyGetAllContactsQuery();
  const [GetAllChannels, { data: channelList }] =
    useLazyGetAllChannelsQuery();
  const [addContact] = useAddContactMutation();
  const [createReport] = useCreateReportMutation();
  const [createChannel] = useCreateChannelMutation();

  useEffect(() => {
    getAllDashboards({
      params: {
        page: undefined,
        per_page: undefined
      }
    });
  }, [getAllDashboards]);

  useEffect(() => {
    getAllContacts({
      params: { sort: "createdOn", order: -1 },
    });
  }, []);

  useEffect(() => {
    GetAllChannels({
      params: { sort: "createdOn", order: -1 },
      body: {
        query: {
          filter: [
            {
              field: "status",
              function: "match",
              value: "Active",
              operator: "AND",
            }
          ]
        },
      },
    });
  }, []);
  // edit functionlity
  useEffect(()=>{
    if(id){
      getReportByID(id)
    }
      },[])
  const reportDetails = reportEditDetails?.data;
      useEffect(() => {
        if (reportEditDetails?.data && !form.initialized) {
          form.initialize({
            reportName: reportDetails.reportName ?? "",
            dashboards: reportDetails?.dashboards.map((dashboard: { dashboardId: any; timePeriod: any; }) => ({
              dashboardId: dashboard.dashboardId ?? "",
              timePeriod: dashboard.timePeriod ?? "",
            })) || [
              {
                dashboardId: "",
                timePeriod: "",
              },
            ],
            contacts: reportDetails.contacts ?? [],
            channels: reportDetails?.notificationChannelId ?? "",
            cronExpression: reportDetails.cronInterval ?? "",
          });
        }
      }, [reportEditDetails, form]);
      const addThreshold = () => {
        form.insertListItem("dashboards", {
          dashboardName: "",
          timePeriod: "",
        });
      };
  const dashboardOptionsFromAPI =
  data?.data?.map(({ name, _id }) => ({
    label: name ?? "Unknown Dashboard",
    value: _id?.$oid ?? _id,
  })) ?? [];

// Get the dashboards that are in `form.values.dashboards` but missing from `dashboardOptionsFromAPI`
const missingDashboards = reportDetails?.dashboards
  .filter((dashboard: { dashboardId: string; }) => !dashboardOptionsFromAPI.some(option => option.value === dashboard.dashboardId))
  .map((dashboard: { dashboardName: any; dashboardId: any; }) => ({
    label: dashboard.dashboardName ?? "Unknown Dashboard",  // Use stored name
    value: dashboard.dashboardId,  // Keep the ID for binding
  }));

// Merge existing API options with missing dashboards
const dashboardOptions = [
  ...dashboardOptionsFromAPI,
  ...(Array.isArray(missingDashboards) ? missingDashboards : []),
];
  const contactOptions =
    contactList?.data?.map(({ _id, firstName }) => ({
      label: firstName,
      value: _id?.$oid ?? _id,
    })) ?? [];
    const channelOptions =
    channelList?.data?.map(({ _id, name }) => ({
      label: name,
      value: _id?.$oid ?? _id,
    })) ?? [];
  const handleAddContact = () => {
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
              <IconAddressBook />
            </ActionIcon>
          </Box>
          <Text>
            <b>Add Contact</b>
          </Text>
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
              email: "",
            }}
            onSubmit={async (values: ContactFormValues) => {
              try {
                const response = await addContact(values).unwrap();
                if (response.id != null) {
                  showNotification({
                    title: "Success",
                    message: `Contact "${values.firstName} ${values.lastName}" has been successfully added.`,
                    color: "success.5",
                  });
                }
                modals.closeAll();
              } catch (error) {
                showNotification({
                  title: "Error",
                  message: "Contact already exists.",
                  color: "red",
                });
              }
            }}
          />
        </>
      ),
    });
  };
  const handleAddChannel = (moduleType?: NotificationModuleType) => {
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
              <IconPlus />
            </ActionIcon>
          </Box>
          <b>Add New Channel</b>
        </Group>
      ),
      centered: true,
      children: (
        <>
          <Divider mt={0} mb="xs" />
          <ChannelForm
            initialModule={moduleType || activeTab}
            onSubmit={async (values) => {
              try {
                await createChannel(values).unwrap();

                showNotification({
                  title: "Success",
                  message: `Channel created successfully`,
                  color: "green",
                });
                setActiveTab(values.module);
                modals.closeAll();
              } catch (error) {
                showNotification({
                  title: "Error",
                  message: "Failed to create channel",
                  color: "red",
                });
              }
            }}
          />
        </>
      ),
    });
  };
   
  const handleSubmit = async (values: any) => {
    // debugger
    const payload = {
      reportName: values.reportName,
      contacts: values?.contacts ?? [],
      notificationChannelId: values?.channels ?? "",
       
      dashboards:
        values?.dashboards?.map((dashboard: any) => {
          const selectedDashboard = dashboardOptions.find(
            (option) => option.value === dashboard.dashboardId
          );
          return {
            dashboardId: selectedDashboard?.value || dashboard.dashboardId, // Use selected ID if available
            dashboardName: selectedDashboard?.label || "Unknown Dashboard", // Use selected Name if available
            timePeriod: dashboard.timePeriod ?? "",
          };
        }) ?? [],
      schedulerInfo: {
        expression: values?.cronExpression,
      },
    };
    try {
      if (id) {
        const updateResponse = await updateReport({
          id: id,
          data: payload,
        }).unwrap();
        if (updateResponse?.success) {
          showNotification({
            title: "Success",
            message: updateResponse?.message || "Report updated successfully",
            color: "green",
          });
          navigate("report.index");
        }     
        else {
          showNotification({
            title: 'Error',
            message: updateResponse?.message || 'Failed to update report',
            color: "red",
          });
        } 
      }
      else {
        const createResponse = await createReport(payload);
        if (createResponse?.data?.data) {
          showNotification({
            title: "Success",
            message: "Report created successfully",
            color: "green",
          });
          const schedulerRes = await updateSchedulerReportStatus({
            id: createResponse?.data?.data?.id,
            status: 'start',
          }).unwrap();

          if (schedulerRes?.message) {
            showNotification({
              title: 'Success',
              message: 'Scheduler status updated to Start',
              color: "green",
            });
          }

          navigate("alert.index");
        } else if (createResponse?.error) {
          showNotification({
            title: "Error",
            message: "Failed to create report",
            color: "red",
          });
        } else {
          showNotification({
            title: "Error",
            message: "Failed ",
            color: "red",
          });
        }
      }

    } catch (error) {
      console.error("Error while creating report:", error);
      showNotification({
        title: "Error",
        message: "An error occurred while creating the report",
        color: "red",
      });
    }
  };

  return (
    <Page pageTitle="Reports">
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          form.onSubmit(handleSubmit)();
        }}
      >
        <Divider mt="sm" color="#D1D5DB" />
        <Group justify="space-between" align="center" mt="md">
          <Title size={16}>Alerts Report</Title>
          <Button w={140} variant="filled" type="submit">
          {id ? "Update Report" : "Save Report"}
          </Button>
        </Group>

        {/* Section 1 */}
        <Card padding="lg" radius="sm" mt={12}>
          <Grid gutter="lg">
            <Grid.Col span={4}>
              <TextInput
                placeholder="Give your report a name"
                required
                radius="sm"
                label="Enter Report Name"
                {...form.getInputProps("reportName")}
                error={form?.errors?.reportName}
              />
            </Grid.Col>
          </Grid>
        </Card>
        {/* Section 2 */}
        <Card padding="lg" radius="sm" mt={12}>
          <Title order={3} size="16">
            Define Dashboard and Time Period{" "}
            <Text span c="red">
              *
            </Text>
            <Tooltip label="Define threshold conditions" position="top">
              <ActionIcon variant="transparent">
                <IconInfoCircle size={14} />
              </ActionIcon>
            </Tooltip>
          </Title>
          <Stack gap="md" mt="sm">
            {form.values.dashboards.map(
              (dashboard: threshold, index: number) => (
                <Grid key={index} align="center">
                  {/* Equation Select */}
                  <Grid.Col span={4}>
                    <Select
                      data={dashboardOptions}
                      placeholder="Select option..."
                      radius="sm"
                      label=" Select Dashboard"
                      nothingFoundMessage={"No Option Found"}
                      withAsterisk
                      {...form.getInputProps(
                        `dashboards.${index}.dashboardId`,
                        {
                          withError: true,
                        }
                      )}
                    />
                  </Grid.Col>

                  {/* Severity Select */}
                  <Grid.Col span={4}>
                    <Select
                      data={[
                        { value: "yearly", label: "Yearly" },
                        { value: "monthly", label: "Monthly" },
                        { value: "weekly", label: "Weekly" },
                        { value: "daily", label: "Daily" },
                      ]}
                      placeholder="Select Time "
                      radius="sm"
                      label="Time Period"
                      withAsterisk
                      {...form.getInputProps(`dashboards.${index}.timePeriod`, {
                        withError: true,
                      })}
                    />
                  </Grid.Col>
                  {/* Add Button */}
                  <Grid.Col span="content">
                    <ActionIcon
                      variant="outline"
                      onClick={addThreshold}
                      radius="sm"
                      size="lg"
                      color="primary.7"
                      mt={25}
                    >
                      <IconPlus size={20} />
                    </ActionIcon>
                  </Grid.Col>

                  {index > 0 && (
                    <Grid.Col span="content">
                      <ActionIcon
                        variant="outline"
                        color="red"
                        onClick={() => removeThreshold(index)}
                        radius="sm"
                        // size="lg"
                        mt={28}
                      >
                        <IconTrash size={20} />
                      </ActionIcon>
                    </Grid.Col>
                  )}
                </Grid>
              )
            )}
          </Stack>
        </Card>
        {/* Section 3 */}
        <Group align="start">
          <Card padding="lg" radius="sm" mt="md" style={{ flex: 1 }}>
            <Grid align="center" gutter="xs">
              <Grid.Col span={8}>
                <MultiSelect
                  data={contactOptions}
                  placeholder="Select contacts..."
                  searchable
                  clearable
                  label={
                    <Flex align="center" gap={2}>
                      Contact<span style={{ color: "red" }}>*</span>
                      <Tooltip
                        label="Select contacts from the list"
                        position="top"
                      >
                        <IconInfoCircle size={14} />
                      </Tooltip>
                    </Flex>
                  }
                  nothingFoundMessage={"No Option Found"}
                  radius="sm"
                  {...form.getInputProps("contacts")}
                  error={form.errors.contacts}
                />
              </Grid.Col>
              <Grid.Col
                span={1}
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  height: "100%",
                }}
              >
                <ActionIcon
                  variant="outline"
                  radius="sm"
                  size={36}
                  mt={20}
                  onClick={handleAddContact}
                >
                  <IconPlus size={18} />
                </ActionIcon>
              </Grid.Col>
            </Grid>
          </Card>
          {/* Select Channel Card */}
          <Card padding="lg" radius="sm" mt="md" style={{ flex: 1 }}>
            <Grid align="center" gutter="xs">
              <Grid.Col span={8}>
                <Select
                  data={channelOptions}
                  placeholder="Select contacts..."
                  searchable
                  clearable
                  radius="sm"
                  label={
                    <Flex align="center" gap={2}>
                      Channel<span style={{ color: "red" }}>*</span>
                      <Tooltip
                        label="Select channels from the list"
                        position="top"
                      >
                        <IconInfoCircle size={14} />
                      </Tooltip>
                    </Flex>
                  }
                  nothingFoundMessage={"No Option Found"}
                  {...form.getInputProps("channels")}
                  error={form.errors.channels}
                />
              </Grid.Col>
              <Grid.Col
                span={1}
                style={{ display: "flex", alignItems: "center" }}
              >
                <ActionIcon
                  variant="outline"
                  radius="sm"
                  size={36}
                  mt={20}
                  onClick={() => handleAddChannel(activeTab)}
                >
                  <IconPlus size={18} />
                </ActionIcon>
              </Grid.Col>
            </Grid>
          </Card>
        </Group>
        {/* Section 4 */}
        <Card padding="lg" radius="sm" mt="md">
          <Stack gap="xs">
            <TextInput
              placeholder="Enter cron expression (e.g., 0 0 * * *)"
              radius="sm"
              w="40%"
              label={
                <Flex align="center" gap={4}>
                  {" "}
                  {/* Reduced gap */}
                  Cron Expression <span style={{ color: "red" }}>*</span>
                  <Tooltip label="Type the cron expression" position="top">
                    <IconInfoCircle size={14} />
                  </Tooltip>
                </Flex>
              }
              {...form.getInputProps("cronExpression")}
              error={form.errors.cronExpression}
            />
          </Stack>
        </Card>
      </Box>
    </Page>
  );
}

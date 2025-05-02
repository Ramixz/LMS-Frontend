/* eslint-disable @typescript-eslint/no-unused-vars */
import { useForm, zodResolver } from "@mantine/form";
import Page from "../../components/Layout/Page";
import {
  Box,
  Button,
  Card,
  Divider,
  Group,
  Stepper,
  TextInput,
  Title,
  Text,
  Grid,
  Flex,
  Tooltip,
  Select,
  Stack,
  NumberInput,
  ActionIcon,
  MultiSelect,
} from "@mantine/core";
import { useEffect, useState } from "react";
import {
  useGetFieldsOfConnectorsQuery,
  useLazyGetConnectorsQuery,
} from "../../services/connector.api";
import { IconAddressBook, IconInfoCircle, IconPlus, IconTrash } from "@tabler/icons-react";
import { AlertFormSchema } from "./alertSchema";
import { useAddContactMutation, useLazyGetAllContactsQuery } from "../../services/contact.api";
import { useCreateChannelMutation, useLazyGetAllChannelsQuery } from "../../services/channel.api";
import { modals } from "@mantine/modals";
import ContactForm from "../Settings/Contacts/Form";
import { showNotification } from "@mantine/notifications";
import { ContactFormValues } from "../../types/contact.type";
import { NotificationModuleType } from "../../lib/enums/NotificationModuleType";
import { ChannelForm } from "../Settings/channels/ChannelForm";

export default function ConfigAlert() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<NotificationModuleType>(
      NotificationModuleType.EMAIL
    );
  const [getconnectors, { data: connectorsList }] = useLazyGetConnectorsQuery();
  const { data } = useGetFieldsOfConnectorsQuery(selectedIndex, {
    
    skip: !selectedIndex,
  });
  
  const connectorOptions =
    connectorsList?.data?.map((connector) => ({
      value: JSON.stringify(connector.connectorInfo),
      label: connector?.connectorInfo?.name || '',
    })) || [];
  function sanitizeOption(value?: string | null): string {
    if (!value) return "";
    return value
      .replace(/["'\uFEFF\u200B]/g, "")
      .replace(/\n/g, " ")
      .trim();
  }

  const filteredOptions =
    data?.fields
      ?.filter((e: Field) => e?.searchable && e?.aggregatable)
      // ?.filter((e) => type ? checkSubset(type.split(","), [e.type]) : true) // Match type if provided
      ?.map((el: Field) => ({
        value: sanitizeOption(el?.name),
        label: sanitizeOption(el?.name),
        type: sanitizeOption(el?.type),
      })) || [];
  const handleConnectorChange = (value: string | null) => {
    if (value) {
      const connectorInfo = JSON.parse(value);
      setSelectedIndex(connectorInfo?.index);
      form.setFieldValue("connector", value);
    } else {
      setSelectedIndex(null);
    }
  };
  const addThreshold = () => {
    form.insertListItem("thresholds", {
      value: "",
      equation: "",
      severity: "",
    });
  };

  // Remove threshold
  const removeThreshold = (index: number) => {
    form.removeListItem("thresholds", index);
  };

  const form = useForm({
    initialValues: {
      alertName: "",
      connector: "",
      dateField: "",
      function: "",
      field: "",
      timePeriodValue: "",
      timePeriodUnit: "",
      count: "",
      thresholds: [{ value: "", equation: "", severity: "" }],
      alertMessage: "",
      cronExpression: "",
      contacts: [],
      channels: "",
    },
    validate: zodResolver(AlertFormSchema), // Apply Zod validation
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (values: any) => {
    const connectorInfo = values.connector
      ? JSON.parse(values.connector)
      : null;
    console.log("Form Submitted:", {
      ...values,
      connector: connectorInfo,
    });
  };
  useEffect(() => {
    getconnectors({
      body: {
        query: {
          filter: [
            {
              field: "status",
              function: "match",
              value: "Active",
              operator: "AND",
            },
          ],
        },
      },
      page: 0,
    });
  }, [getconnectors]);
    const [getAllContacts, { data: contactList }] =
      useLazyGetAllContactsQuery();
      const [GetAllChannels, { data: channelList }] =
      useLazyGetAllChannelsQuery();
    const [addContact] = useAddContactMutation();
    const [createChannel] = useCreateChannelMutation();
    useEffect(() => {
      getAllContacts({
        params: { sort: "createdOn", order: -1 },
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
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
  
  const handleStepChange = (nextStep: number) => {
    if (nextStep === 1) {
      // Validate individual fields
      const requiredFields = [
        'alertName',
        'connector',
        'dateField',
        'function',
        'field',
        'timePeriodValue',
        'timePeriodUnit',
        'count'
      ] as const;

      let hasError = false;
      requiredFields.forEach(field => {
        const formValues = form.values as Record<string, any>;
        if (!formValues[field]) {
          form.setFieldError(field, 'This field is required');
          hasError = true;
        }
      });

      // Validate threshold fields
      form.values.thresholds.forEach((threshold, index) => {
        if (!threshold.value) {
          form.setFieldError(`thresholds.${index}.value`, 'Value is required');
          hasError = true;
        }
        if (!threshold.equation) {
          form.setFieldError(`thresholds.${index}.equation`, 'Equation is required');
          hasError = true;
        }
        if (!threshold.severity) {
          form.setFieldError(`thresholds.${index}.severity`, 'Severity is required');
          hasError = true;
        }
      });

      if (hasError) {
        return;
      }
    }
    setActiveStep(nextStep);
  };

  return (
    <Page pageTitle="Alerts">
      <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
        <Divider mt="sm" color="#D1D5DB" />
        <Group justify="space-between" align="center" mt="md">
          <Title size={16}>Configure Alerts</Title>
          <Group gap="sm" mt={"sm"}>
            {activeStep === 1 && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleStepChange(0)}
                >
                  Back
                </Button>
                <Button w={120} type="submit">
                  Save Alert
                </Button>
              </>
            )}
            {activeStep === 0 && (
              <Button
                w={120}
                onClick={() => handleStepChange(1)}
              >
                Next
              </Button>
            )}
          </Group>
        </Group>
        <Card mt={12} padding="lg" radius="sm">
          <Stepper
            iconSize={42}
            active={activeStep}
            onStepClick={handleStepChange}
          >
            <Stepper.Step
              label=" Define Configurations"
              onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
            />

            <Stepper.Step
              label=" Set Alerts"
              onClick={() => setActiveStep((prev) => Math.min(prev + 1, 1))}
            />
          </Stepper>
        </Card>
        {/* Section 1 */}
        {activeStep === 0 && (
          <>
            <Card padding="lg" radius="sm" mt="md">
              <Grid gutter="lg">
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    label="Enter Alert Name"
                    placeholder="Give your alert rule a name"
                    required
                    radius="sm"
                    {...form.getInputProps("alertName")}
                  />
                </Grid.Col>
              </Grid>
            </Card>
            <Card padding="lg" radius="sm" mt="md">
              <Text size="xl" fw={600}>
                Connector{" "}
                <Text component="span" c="red">
                  *
                </Text>
              </Text>

              <Grid gutter="lg" mt="sm">
                <Grid.Col span={4}>
                  <Select
                    placeholder="Select option..."
                    nothingFoundMessage={"No Option Found"}
                    radius="sm"
                    label={
                      <Flex align="center" gap="xs">
                        Select Connector
                        <Tooltip
                          label="Select the connector type"
                          position="top"
                        >
                          <IconInfoCircle size={14} />
                        </Tooltip>
                      </Flex>
                    }
                    data={connectorOptions}
                    {...form.getInputProps("connector")}
                    onChange={handleConnectorChange}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Select
                    placeholder="Select option..."
                    radius="sm"
                    nothingFoundMessage={"No Option Found"}
                    label={
                      <Flex align="center" gap="xs">
                        Date Field
                        <Tooltip
                          label="Select the connector type"
                          position="top"
                        >
                          <IconInfoCircle size={14} />
                        </Tooltip>
                      </Flex>
                    }
                    data={filteredOptions}
                    {...form.getInputProps("dateField")}
                  />
                </Grid.Col>
              </Grid>
            </Card>
            <Card padding="lg" radius="sm" mt="md">
              <Title size="xl" fw={600}>
                Set Threshold Values
                <Text component="span" c="red">
                  {" "}
                  *{" "}
                </Text>
                <Tooltip label="Select the threshold type" position="top">
                  <IconInfoCircle size={14} />
                </Tooltip>
              </Title>
              <Grid mt="md">
                <Grid.Col span={4}>
                  <Select
                    placeholder="Select option..."
                    radius="sm"
                    label=" Select functions"
                    data={["option1", "option2"]}
                    {...form.getInputProps("function")}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Select
                    placeholder="Select option..."
                    label="Field"
                    radius="sm"
                    data={["option1", "option2"]}
                    {...form.getInputProps("field")}
                  />
                </Grid.Col>
                <Grid.Col span={4} />
              </Grid>
              <Grid mt="md">
                <Grid.Col span={4}>
                  <Stack gap="xs">
                    <Group grow>
                      <NumberInput
                        placeholder="02"
                        radius="sm"
                        label="Time Period"
                        hideControls
                        {...form.getInputProps("timePeriodValue")}
                      />
                      <Select
                        data={[
                          { label: "Second", value: "second" },
                          { label: "Minute", value: "minute" },
                          { label: "Hour", value: "hour" },
                          { label: "Day", value: "day" },
                          { label: "Week", value: "week" },
                          { label: "Month", value: "month" },
                          { label: "Year", value: "year" },
                        ]}
                        placeholder="Select"
                        radius="sm"
                        {...form.getInputProps("timePeriodUnit")}
                        mt={25}
                      />
                    </Group>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Stack gap="xs">
                    <TextInput
                      placeholder="Placeholder text"
                      radius="sm"
                      label="Count"
                      {...form.getInputProps("count")}
                    />
                  </Stack>
                </Grid.Col>
              </Grid>
            </Card>
            <Card padding="lg" radius="sm" mt="md">
              <Title order={3} size="16">
                Define Threshold Configurations{" "}
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
                {form.values.thresholds.map((_, index) => (
                  <Grid key={index} align="center">
                    {/* Value Input */}
                    <Grid.Col span={2}>
                      <NumberInput
                        placeholder="02"
                        radius="sm"
                        label="Value"
                        hideControls
                        {...form.getInputProps(`thresholds.${index}.value`)}
                      />
                    </Grid.Col>

                    {/* Equation Select */}
                    <Grid.Col span={3}>
                      <Select
                        data={["=", "!=", ">", "<", ">=", "<="]}
                        placeholder="Equation"
                        label="Equation"
                        radius="sm"
                        {...form.getInputProps(`thresholds.${index}.equation`)}
                      />
                    </Grid.Col>

                    {/* Severity Select */}
                    <Grid.Col span={3}>
                      <Select
                        data={["Critical", "Major", "Minor"]}
                        placeholder="Severity"
                        label="Severity"
                        radius="sm"
                        {...form.getInputProps(`thresholds.${index}.severity`)}
                      />
                    </Grid.Col>
                    {/* Add Button */}
                    {form.values.thresholds.length > 1 && (
                      <Grid.Col span="content">
                        <ActionIcon
                          variant="outline"
                          color="red"
                          onClick={() => removeThreshold(index)}
                          radius="sm"
                          size="lg"
                          mt={28}
                        >
                          <IconTrash size={20} />
                        </ActionIcon>
                      </Grid.Col>
                    )}
                    {/* Remove Button (Only show if more than one threshold exists) */}
                    {index === form.values.thresholds.length - 1 && (
                      <Grid.Col span="content">
                        <ActionIcon
                          variant="outline"
                          onClick={addThreshold}
                          radius="sm"
                          size="lg"
                          color="primary.7"
                          mt={28}
                          // disabled={
                          //   !form.values.thresholds[index]?.severity &&
                          //   !form.values.thresholds[index]?.equation &&
                          //   !form.values.thresholds[index]?.value
                          // }
                        >
                          <IconPlus size={20} />
                        </ActionIcon>
                      </Grid.Col>
                    )}
                  </Grid>
                ))}
              </Stack>
            </Card>
          </>
        )}
        {activeStep === 1 && (
          <>
            <Card padding="lg" radius="sm" mt="md">
              <Grid gutter="lg">
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <TextInput
                    placeholder="Enter alert message here..."
                    radius="sm"
                    label={
                      <Flex align="center" gap={2}>
                        Enter Alert Message
                        <span style={{ color: "red" }}>*</span>
                        <Tooltip label="Type the Message" position="top">
                          <IconInfoCircle size={14} />
                        </Tooltip>
                      </Flex>
                    }
                    // w="30%"
                    {...form.getInputProps("alertMessage")}
                  />
                </Grid.Col>
              </Grid>
            </Card>
            <Group align="start">
              <Card padding="lg" radius="sm" mt="md" style={{ flex: 1 }}>
                <Grid align="center" gutter="xs">
                  <Grid.Col span={8}>
                    <MultiSelect
                      data={contactOptions}
                      placeholder="Select contacts..."
                      nothingFoundMessage={"No Option Found"}
                      searchable
                      clearable
                      radius="sm"
                      label={
                        <Flex align="center" gap={2}>
                          Select Contact<span style={{ color: "red" }}>*</span>
                          <Tooltip
                            label="Select contacts from the list"
                            position="top"
                          >
                            <IconInfoCircle size={14} />
                          </Tooltip>
                        </Flex>
                      }
                      {...form.getInputProps("contacts")}
                    />
                  </Grid.Col>
                  <Grid.Col
                    span={1}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <ActionIcon variant="outline" radius="sm" size={36} mt={22}
                     onClick={handleAddContact}>
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
                      nothingFoundMessage={"No Option Found"}
                      searchable
                      clearable
                      radius="sm"
                      label={
                        <Flex align="center" gap={2}>
                          Select Channel<span style={{ color: "red" }}>*</span>
                          <Tooltip
                            label="Select channel from the list"
                            position="top"
                          >
                            <IconInfoCircle size={14} />
                          </Tooltip>
                        </Flex>
                      }
                      {...form.getInputProps("channels")}
                    />
                  </Grid.Col>
                  <Grid.Col
                    span={1}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <ActionIcon variant="outline" radius="sm" size={36} mt={22}
                      onClick={() => handleAddChannel(activeTab)}>
                      <IconPlus size={18} />
                    </ActionIcon>
                  </Grid.Col>
                </Grid>
              </Card>
            </Group>
            <Card padding="lg" radius="sm" mt="md">
              <Stack gap="xs">
                <TextInput
                  placeholder="Enter cron expression (e.g., 0 0 * * *)"
                  radius="sm"
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
                  w="40%"
                  {...form.getInputProps("cronExpression")}
                />
              </Stack>
            </Card>
          </>
        )}
      </Box>
    </Page>
  );
}
interface Field {
  name: string;
  type: string;
  searchable: boolean;
  aggregatable: boolean;
}

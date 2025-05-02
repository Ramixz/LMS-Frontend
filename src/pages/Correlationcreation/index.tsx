import { Button, Text, Group, Card, Title, TextInput, Tooltip, Select, ActionIcon, Box, Grid } from "@mantine/core";
import Page from "../../components/Layout/Page";
import { IconInfoCircle, IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { useCreateCorrelationMutation, useLazyFetchDatasetsQuery, useLazyGetCronjobCorrelationQuery } from "../../services/correlation.api";
import { useLazyGetFieldFilterQuery } from "../../services/alert.api";
import { showNotification } from "@mantine/notifications";
import { ConnectorsType } from "../../types/connector.type";
import { CorrelationFormSchema } from "./correlationValidationSchema";
import { randomId } from "@mantine/hooks";
import useNav from "../../hooks/useNav";
import { Link } from "react-router-dom";
import routeFn from "../../utils/routehelpers";

interface DashboardPair {
  dataset: string;
  field: string;
  index: string;
  datasetToShow?: string;
  selectedValue?: string;
  key?: string; 
}

interface CorrelationFormValues {
  correlationName: string;
  dashboards: DashboardPair[];
}

export default function CorrelationCreation() {
  const [cronValue, setCronValue] = useState<string>("");
  const [fetchDatasets, { data: datasetOptions }] = useLazyFetchDatasetsQuery();
  const [getFieldFilter] = useLazyGetFieldFilterQuery();
  const [createCorrelation, { isLoading: isCorrelationLoading }] = useCreateCorrelationMutation();
  const [getCronjobCorrelation, { isLoading: isCronJobLoading }] = useLazyGetCronjobCorrelationQuery();
  const navigate = useNav();
  const [dashboardOptions, setDashboardOptions] = useState<any>([]);
  const [fieldOptionsMap, setFieldOptionsMap] = useState<Record<number, any[]>>({});
  const form = useForm<CorrelationFormValues>({
    initialValues: {
      correlationName: "",
      dashboards: [{ dataset: "", field: "", index: "", key: randomId()  }],
    },
    validate: zodResolver(CorrelationFormSchema),
    mode: "uncontrolled",
  });

  const addDashboardPair = () => {
    form.insertListItem('dashboards', {
      dataset: "",
      field: "",
      index: "",
      key: randomId(), 
    });
  };
  const removeDashboardPair = (index: number) => {
    form.removeListItem('dashboards',index)
  };
  const fetchDataset = () => {
    if (!datasetOptions?.datasets) return;
  
    const uniqueOptions = Array.from(
      new Map(
        datasetOptions.datasets.map((dataset: DashboardPair) => [
          dataset.index,
          {
            label: dataset.datasetToShow,
            value: dataset.index,
            index: dataset.index,
            dataset: dataset.dataset,
          },
        ])
      ).values()
    );
    setDashboardOptions(uniqueOptions);
  };
  useEffect(() => {
    fetchDataset();
  }, [datasetOptions]);
  
  useEffect(() => {
    fetchDatasets({});
  }, []);
  const handleDatasetChange = async (index: number, selectedValue: string) => {
    const selectedOption = dashboardOptions.find((option: { value: string }) => option.value === selectedValue);
    if (!selectedOption) return;
    const currentDashboards = form.getValues().dashboards;
    currentDashboards[index] = {
      ...currentDashboards[index],
      dataset: selectedValue,
      index: selectedOption.index,
      field: "",
    };

    form.setValues({ dashboards: currentDashboards });
    try {
      const response = await getFieldFilter(selectedOption.index).unwrap();
      if (response?.fields) {
        const filteredFields = response.fields.filter((field) => !field.name.endsWith(".lower"));
        const mappedFields = filteredFields.map((field) => ({
          label: field.name,
          value: field.name,
        }));
        setFieldOptionsMap((prev) => ({ ...prev, [index]: mappedFields }));
      }
    } catch (error) {
      form.setFieldError(`dashboards.${index}.field`, `Error fetching fields for this database `);
    }
  };

  const handleSubmit = async (values: CorrelationFormValues) => {
    const joins = values.dashboards.map((pair: DashboardPair) => ({
      index: pair.index,
      key: pair.field,
      dataset: dashboardOptions.find((option: DashboardPair) => option.index === pair.index)?.dataset,
    }));

    const datasetsToShow = values.dashboards.map(
      (pair) => dashboardOptions.find((option: { value: string; dataset: string }) => option.value === pair.dataset)?.label
    );

    const payload = {
      correlationName: values.correlationName,
      payload: { joins },
      connectors: datasetsToShow.filter(Boolean),
      schedulerInfo: {
        expression: cronValue,
      },
    } as ConnectorsType;

    try {
      const createResponse = await createCorrelation(payload);

      if ("data" in createResponse && createResponse.data?.id) {
        showNotification({
          title: "Success",
          message: "Correlation created successfully",
          color: "green",
        });

        const schedulerRes = await getCronjobCorrelation(createResponse.data.id);
        if ("data" in schedulerRes && schedulerRes.data) {
          navigate("correlation.index");
        }
      } else if ("error" in createResponse) {
        navigate("correlation.index");
      }
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Unable to create correlation. Please try again",
        color: "red",
      });
    }
  };
  return (
    <Page pageTitle="Correlation">
      <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
        <Group justify="space-between" align="center" mb="md" pr="xxs">
          <Title size={16} fw={600}>
            Add Correlation
          </Title>
          <Group gap="sm">            
            <Button variant="outline" component={Link} to={routeFn('correlation.index',undefined,undefined)}>
              Back
            </Button>
            <Button type="submit" loading={isCorrelationLoading || isCronJobLoading}>
              Save
            </Button>
          </Group>
        </Group>

        <Card padding="lg" radius="md" mt={12}>
         <Grid gutter="lg">
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                withAsterisk
                label="Enter Correlation Name"
                placeholder="Enter Correlation Name"
                radius="sm"
                {...form.getInputProps("correlationName")}
              />
            </Grid.Col>
          </Grid>
        </Card>

        <Card padding="lg" mt={12} radius="md">
          <Text size="lg" fw={600} c="surfaceGrey.8">
            Define Datasets and Fields{" "}
            <Tooltip label="Ensure that both the datasets and fields contain at least two items." position="top">
              <ActionIcon variant="transparent" size="xs">
                <IconInfoCircle size={"sm"} />
              </ActionIcon>
            </Tooltip>
          </Text>
          {form.getValues().dashboards.map((dashboard, index) => (
            <Group key={dashboard.key || index} mt="md" grow>
              <Box>
                <Select
                  withAsterisk
                  searchable
                  label="Select Datasets"
                  placeholder="Select option..."
                  data={dashboardOptions
                    .filter(
                      (option: any) =>
                        !form.getValues().dashboards.some(
                          (dashboard, i) => dashboard.dataset === option.value && i !== index
                        )
                    )
                    .map((option: any) => ({
                      value: option.value,
                      label: option.label,
                    }))}
                  key={form.key(`dashboards.${index}.dataset`)} // Unique key for dataset
                  {...form.getInputProps(`dashboards.${index}.dataset`)}
                  value={form.getValues().dashboards[index].dataset}
                  onChange={(value) => value && handleDatasetChange(index, value)}
                  radius="sm"
                  mt="xs"
                />
              </Box>

              <Box>
                <Select
                  placeholder="Select Field"
                  label=" Select Fields"
                  withAsterisk
                  searchable
                  data={fieldOptionsMap[index] || []}
                  value={dashboard.field}
                  key={form.key(`dashboards.${index}.field`)} // Unique key for field
                  {...form.getInputProps(`dashboards.${index}.field`)}
                  onChange={(value) => {
                    const updatedDashboards = form.getValues().dashboards;
                    updatedDashboards[index].field = value!;
                    form.setValues({ dashboards: updatedDashboards });
                  }}
                  radius="sm"
                  mt="xs"
                />
              </Box>

              <Group mt="xl" justify="xs" align="center">
                {form.getValues().dashboards.length > 1 && (
                  <ActionIcon
                    variant="outline"
                    color="red"
                    onClick={() => removeDashboardPair(index)}
                    radius="sm"
                    size={36}
                  >
                    <IconTrash color="red" size={20} stroke={1.5} />
                  </ActionIcon>
                )}
                {index === form.getValues().dashboards.length - 1 &&
                  form.getValues().dashboards.length < 5 && (
                    <ActionIcon
                      variant="outline"
                      onClick={addDashboardPair}
                      radius="sm"
                      color="primary.7"
                      size={36}
                      disabled={!form.getValues().dashboards[index].field}
                    >
                      <IconPlus 
                      size={20} stroke={1.5} />
                    </ActionIcon>
                  )}
              </Group>
            </Group>
          ))}

        </Card>
        <Card padding="lg" mt={12} radius="md">
          <Group justify="space-between" align="center">
            <Group justify="xs" align="center">
              <Text size="lg" fw={600} c="surfaceGrey.8">
                Cron Expression <Text span c="red">*</Text>
                <Tooltip
                  label="Specify the cron expression to define the schedule. Ensure the expression is valid and follows the required format."
                  position="top"
                >
                  <ActionIcon variant="transparent" size="xs">
                    <IconInfoCircle size={"sm"} />
                  </ActionIcon>
                </Tooltip>
              </Text>
            </Group>
          </Group>
          <TextInput
            placeholder="Enter cron expression (e.g., 0 0 * * *)"
            value={cronValue}
            onChange={(e) => setCronValue(e.target.value)}
            radius="sm"
            mt="xs"
          />
        </Card>
      </Box>
    </Page>
  );
}

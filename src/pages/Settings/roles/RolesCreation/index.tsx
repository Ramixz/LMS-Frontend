import { Box, Text, Checkbox, Table, Group, Card, TextInput, MultiSelect, Button, Title } from "@mantine/core";
import { useState, useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";
import Page from "../../../../components/Layout/Page";
import { Link, useNavigate, useParams } from "react-router-dom";
import routeFn from "../../../../utils/routehelpers";
import { showNotification } from "@mantine/notifications";
import { useLazyGetAllDashboardsQuery } from "../../../../services/dashboard.api";
import { useLazyGetConnectorsQuery } from "../../../../services/connector.api";
import { useCreateRoleMutation, useEditRoleMutation, useGetRoleByIDMutation } from "../../../../services/roles.api";
import { z } from "zod";


interface RoleDetails {
  _id?: { $oid: string };
  roleName: string;
  connectorIds: string[];
  dashboardIds: string[];
  permissions: string[];
}


const CreateRoleSchema = z.object({
  roleName: z.string().min(1, "Role name is required"),
  connectorIds: z.array(z.string()).min(1, "Please select at least one connector."),
  dashboardIds: z.array(z.string()).min(1, "Please select at least one dashboard."),
  permissions: z.array(z.string()).min(1, "Error - Permissions not selected."),
});

export default function RoleCreationOrEdit({
  permissionDetails = null,
}: {
  permissionDetails?: RoleDetails | null;
}) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [createRole] = useCreateRoleMutation();
  const [editRole] = useEditRoleMutation();
  const [getConnectors, { data: connectorData }] = useLazyGetConnectorsQuery();
  const [getAllDashboards, { data: dashboardData }] = useLazyGetAllDashboardsQuery();
  const [getRoleByID, { data: editRoleData }] = useGetRoleByIDMutation();

  const [connectorOptions, setConnectorOptions] = useState<{ value: string; label: string }[]>([]);
  const [dashboardOptions, setDashboardOptions] = useState<{ value: string; label: string }[]>([]);

  const MODULES = [
    "DASHBOARD",
    "VISUALIZATION",
    "CONNECTOR",
    "ALERT",
    "REPORT",
    "CORRELATION",
    "USER",
    "ROLE",
    "CONTACT",
    "CHANNEL",
  ];
  const ACTIONS = ["CREATE", "READ", "UPDATE", "DELETE"];

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      roleName: permissionDetails?.roleName || "",
      connectorIds: permissionDetails?.connectorIds || [],
      dashboardIds: permissionDetails?.dashboardIds || [],
      permissions: permissionDetails?.permissions || [],
    },
    validate: zodResolver(CreateRoleSchema),
  });

  useEffect(() => {
    getConnectors({
      page: 0,
      rowPerPage: 300,
      order: "-1",
      sort: "createdOn",
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
    });
    getAllDashboards({
      params: {
        page: 0,
        per_page: 1000,
      },
    });
  }, [getConnectors, getAllDashboards]);

  useEffect(() => {
    if (id) {
      getRoleByID(id);
    }
  }, [id, getRoleByID]);



  useEffect(() => {
    if (connectorData?.data) {
      const options = connectorData.data.map((connector: any) => ({
        label: connector.connectorInfo.name,
        value: connector._id.$oid,
      }));
      setConnectorOptions(options);
    }
  }, [connectorData]);

  useEffect(() => {
    if (dashboardData?.data) {
      const options = dashboardData.data.map((dashboard: any) => ({
        label: dashboard.name,
        value: dashboard._id.$oid,
      }));
      setDashboardOptions(options);
    }
  }, [dashboardData]);

  const handlePermissionToggle = (module: string, action: string) => {
    const permission = `${module}:${action}`;
    const currentPermissions = form.getValues().permissions || [];
    const updatedPermissions = currentPermissions.includes(permission)
      ? currentPermissions.filter((p) => p !== permission)
      : [...currentPermissions, permission];
    form.setFieldValue("permissions", updatedPermissions);
  };

  
  const isChecked = (module: string, action: string) => {
    return form.getValues().permissions?.includes(`${module}:${action}`);
  };
  useEffect(() => {
    if (editRoleData?.data && !form.initialized) {
      const roleData = editRoleData?.data;
      form.initialize({
        roleName: roleData.roleName,
        connectorIds: roleData.connectorIds,
        dashboardIds: roleData.dashboardIds,
        permissions: roleData.permissions,
      });
    }
  }, [editRoleData, form]);
  
  const handleSubmit = async (values: typeof form.values) => {
    try {
      const formData = {
        roleName: values.roleName,
        connectorIds: values.connectorIds,
        dashboardIds: values.dashboardIds,
        permissions: values.permissions,
      };

      if (id) {
        
        await editRole({
          id: id,
          ...formData,
        }).unwrap();
        showNotification({
          title: "Success",
          message: `Role "${formData.roleName}" has been successfully updated.`,
          color: "green",
        });
      } else {
        
        await createRole(formData).unwrap();
        showNotification({
          title: "Success",
          message: `Role "${formData.roleName}" has been successfully created.`,
          color: "green",
        });
      }

      navigate(routeFn("settings.roles", undefined, undefined));
    } catch (error: any) {
      showNotification({
        title: "Error",
        message: error?.data?.message || "Something went wrong!",
        color: "red",
      });
    }
  };

  return (
    <Page pageTitle="Roles">
      <Box component="form" onSubmit={form.onSubmit(handleSubmit)}>
        <Group justify="space-between" align="center" mb="md" pr="xxs">
          <Title size={16} fw={600}>
            {id ? "Edit Role" : "Create Role"}
          </Title>
          <Group gap="sm">
            <Button
              variant="outline"
              component={Link}
              to={routeFn("settings.roles", undefined, undefined)}
            >
              Back
            </Button>
            <Button type="submit">{id ? "Update" : "Create"} Role</Button>
          </Group>
        </Group>

        <Card padding="lg" radius="md" mt={12}>
          <Group grow align="center" mb="md">
            <TextInput
              label="Role Name"
              placeholder="Enter a name for the role"
              withAsterisk
              {...form.getInputProps("roleName")}
              key={form.key("roleName")}
            />
            <MultiSelect
              label="Select Connectors"
              placeholder="Select options..."
              data={connectorOptions}
              searchable
              clearable
              withAsterisk
              withScrollArea
              checkIconPosition="right"
              {...form.getInputProps("connectorIds")}
              key={form.key("connectorIds")}
            />
            <MultiSelect
              label="Select Dashboards"
              placeholder="Select options..."
              data={dashboardOptions}
              searchable
              clearable
              withAsterisk
              withScrollArea
              checkIconPosition="right"
              {...form.getInputProps("dashboardIds")}
              key={form.key("dashboardIds")}
            />
          </Group>

          {/* Permissions */}
          <Box bg="white">
            <Group justify="apart" mb="xs">
              <Text fw={500}>
                Select Permissions <Text span c="red">*</Text>
              </Text>
              {form.errors.permissions && (
                <Text size="sm" c="red">
                  {form.errors.permissions}
                </Text>
              )}
            </Group>

            <Box>
              <Table horizontalSpacing="lg" verticalSpacing="md">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>MODULE</Table.Th>
                    {ACTIONS.map((action) => (
                      <Table.Th color="surfaceGrey.6" key={action} align="center">
                        {action}
                      </Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {MODULES.map((module) => (
                    <Table.Tr key={module}>
                      <Table.Td>{module}</Table.Td>
                      {ACTIONS.map((action) => (
                        <Table.Td key={`${module}-${action}`} align="center">
                          <Checkbox
                            checked={isChecked(module, action)}
                            onChange={() => handlePermissionToggle(module, action)}
                            size="md"
                            radius={"xs"}
                            key={form.key(`${module}-${action}`)}
                          />
                        </Table.Td>
                      ))}
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Box>
          </Box>
        </Card>
      </Box>
    </Page>
  );
}

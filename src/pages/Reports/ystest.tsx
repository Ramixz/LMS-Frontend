// Leads.tsx
import DataTable from "../../components/DataTable";
import Page from "../../components/Layout/Page";
import { ActionIcon, Box, Button, Divider, Group, Text, Tabs, Card, Badge, rem, Stack } from "@mantine/core";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconPlus, IconDownload, IconList, IconInfoCircle, IconPencil, IconTrash, IconCalendar, IconCurrencyDollar ,IconPercentage} from "@tabler/icons-react";
import { LeadForm } from "./form";
import { toLocalFormattedDate } from "../../lib/helpers";
import { useCreateLeadMutation, useDeleteLeadMutation, useUpdateLeadMutation ,useLazyGetAllLeadsQuery} from "../../services/estest.api";

export default function Leads() {
    const [getLeads, { data, isFetching, isLoading, isError }] = useLazyGetAllLeadsQuery();
    const [createLead] = useCreateLeadMutation();
    const [deleteLead] = useDeleteLeadMutation();
    const [updateLead] = useUpdateLeadMutation();

    const handleAddLead = () => {
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
                        <ActionIcon c={"secondary.7"} variant="transparent">
                            <IconPlus size={22} />
                        </ActionIcon>
                    </Box>
                    <Text><b>Add New Lead</b></Text>
                </Group>
            ),
            centered: true,
            shadow: "0px",
            children: (
                <>
                    <Divider mt={0} mb="xs" />
                    <LeadForm
                        onSubmit={async (values) => {
                            try {
                                await createLead(values).unwrap();
                                showNotification({
                                    title: "Success",
                                    message: "Lead created successfully",
                                    color: "green",
                                });
                                modals.closeAll();
                            } catch (error) {
                                showNotification({
                                    title: "Error",
                                    message: "Failed to create lead",
                                    color: "red",
                                });
                            }
                        }}
                    />
                </>
            )
        });
    };

    const handleEditLead = (lead: any) => {
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
                        <ActionIcon c={"secondary.7"} variant="transparent">
                            <IconPencil size={22} />
                        </ActionIcon>
                    </Box>
                    <Text><b>Edit Lead</b></Text>
                </Group>
            ),
            centered: true,
            shadow: "0px",
            children: (
                <LeadForm
                    lead={lead}
                    isEditing={true}
                    onSubmit={async (values) => {
                        try {
                            await updateLead({ id: lead._id, ...values }).unwrap();
                            showNotification({
                                title: "Success",
                                message: "Lead updated successfully",
                                color: "green",
                            });
                            modals.closeAll();
                        } catch (error) {
                            showNotification({
                                title: "Error",
                                message: "Failed to update lead",
                                color: "red",
                            });
                        }
                    }}
                />
            ),
        });
    };
    const handleShowLoanOffers = (lead: any) => {
  // pretend lead.offers is an array of offers; you can replace this with your real data
  const offers = lead.offers ?? [
    { amount: 50000, rate: 5.5, term: 36 },
    { amount: 75000, rate: 6.0, term: 60 },
  ];

  modals.open({
    title: (
      <Group >
        <IconInfoCircle size={24} />
        <Text>Loan Offers for {lead.last_name}</Text>
      </Group>
    ),
    size: 'xl',
    children: (
      <Group grow align="stretch" mt="md" >
        {offers.map((offer, idx) => (
          <Card
            key={idx}
            withBorder
            shadow="sm"
            radius="md"
            p="lg"
            sx={(theme) => ({
              flex: `1 1 calc(50% - ${theme.spacing.lg})`,
              minWidth: rem(240),
            })}
          >
            <Group  mb="sm">
              <Text  size="lg">{`Offer ${idx + 1}`}</Text>
              <Badge color="blue" variant="light">{`${offer.rate}% APR`}</Badge>
            </Group>

            <Stack >
              <Group >
                <IconCurrencyDollar size={18} />
                <Text size="sm">
                  Amount: <Text component="span">${offer.amount.toLocaleString()}</Text>
                </Text>
              </Group>

              <Group >
                <IconPercentage size={18} />
                <Text size="sm">
                  Interest Rate: <Text component="span" >{offer.rate}%</Text>
                </Text>
              </Group>

              <Group >
                <IconCalendar size={18} />
                <Text size="sm">
                  Term: <Text component="span">{offer.term} months</Text>
                </Text>
              </Group>
            </Stack>

            {/* optionally add a footer with actions */}
            <Group  mt="md">
              <Button size="xs" variant="light">Apply now</Button>
            </Group>
          </Card>
        ))}
      </Group>
    ),
  });
};
    // const handleShowLoanOffers = (lead: any) => {
    //     modals.open({
    //         title: (
    //             <Group>
    //                 <IconInfoCircle size={24} />
    //                 <Text>Loan Offers for {lead.last_name}</Text>
    //             </Group>
    //         ),
    //         size: "xl",
    //         children: (
    //             <Tabs defaultValue="offer1">
    //                 <Tabs.List>
    //                     <Tabs.Tab value="offer1">Offer 1</Tabs.Tab>
    //                     <Tabs.Tab value="offer2">Offer 2</Tabs.Tab>
    //                 </Tabs.List>

    //                 <Tabs.Panel value="offer1" pt="xs">
    //                     <div>
    //                         <Text size="sm">Loan Amount: $50,000</Text>
    //                         <Text size="sm">Interest Rate: 5.5%</Text>
    //                         <Text size="sm">Term: 36 months</Text>
    //                     </div>
    //                 </Tabs.Panel>

    //                 <Tabs.Panel value="offer2" pt="xs">
    //                     <div>
    //                         <Text size="sm">Loan Amount: $75,000</Text>
    //                         <Text size="sm">Interest Rate: 6.0%</Text>
    //                         <Text size="sm">Term: 60 months</Text>
    //                     </div>
    //                 </Tabs.Panel>
    //             </Tabs>
    //         )
    //     });
    // };

    return (
        <Page pageTitle="Leads" bgWhite>
            <Divider my="sm" size={"sm"} />
            <Group justify="end" mb="md" pr={"xxs"}>
                <Button
                    leftSection={<IconPlus size={20} />}
                    onClick={handleAddLead}
                >
                    Lead
                </Button>
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
                    { header: "Aadhaar", accessorKey: "aadhaar_no" },
                    { header: "PAN", accessorKey: "pan_no" },
                    { header: "Last Name", accessorKey: "last_name" },
                    { header: "Email", accessorKey: "email" },
                    { header: "Contact", accessorKey: "contact" },
                   
                ]}
                data={data?.data ?? []}
                {...{ isFetching, isLoading, isError }}
                renderRowActions={({ row }: any) => (
                    <Group gap="md">
                        <ActionIcon
                            variant="subtle"
                            size="sm"
                            c={"surfaceGrey.7"}
                            onClick={() => handleEditLead(row.original)}
                            title="Edit"
                        >
                            <IconPencil size="xxl" stroke={1.5} />
                        </ActionIcon>

                        <ActionIcon
                            variant="subtle"
                            size="sm"
                            c={"surfaceGrey.7"}
                            onClick={() => handleShowLoanOffers(row.original)}
                            title="View Loan Offers"
                        >
                            <IconInfoCircle size="xxl" stroke={1.5} />
                        </ActionIcon>

                        <ActionIcon
                            variant="subtle"
                            size="sm"
                            c={"surfaceGrey.7"}
                            onClick={() => deleteLead(row.original._id)}
                            title="Delete"
                        >
                            <IconTrash size="xxl" stroke={1.5} />
                        </ActionIcon>
                    </Group>
                )}
                onStateChange={({ pagination }: any) => {
                    getLeads({
                        params: {
                          page: pagination.pageIndex,
                          per_page: pagination.pageSize,
                          sort: 'createdOn',
                          order: 'desc'
                        }
                      });
                }}
                enableRowActions
            />
        </Page>
    );
}
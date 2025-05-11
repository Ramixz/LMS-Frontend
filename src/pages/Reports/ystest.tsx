// Leads.tsx
import DataTable from "../../components/DataTable";
import Page from "../../components/Layout/Page";
import { ActionIcon, Box, Button, Divider, Group, Text, Card, Badge, rem, Stack, Flex } from "@mantine/core";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconPlus, IconDownload, IconList, IconInfoCircle, IconPencil, IconTrash, IconCalendar, IconCurrencyDollar, IconPercentage, IconCheck, IconPointFilled } from "@tabler/icons-react";
import { useCreateLeadMutation, useDeleteLeadMutation, useUpdateLeadMutation, useLazyGetAllLeadsQuery } from "../../services/estest.api";
import { useState } from "react";
import { Stepper, TextInput, PasswordInput, Code } from "@mantine/core";
import { useForm } from "@mantine/form";
import { toLocalFormattedDate } from "../../lib/helpers";

interface LeadFormProps {
    lead?: any;
    isEditing?: boolean;
    onSubmit: (values: any) => void;
}

function LeadForm({ lead, isEditing, onSubmit }: LeadFormProps) {
    const [active, setActive] = useState(0);
    const [aadhaarVerified, setAadhaarVerified] = useState(false);
    const [panVerified, setPanVerified] = useState(false);

    const form = useForm({
        initialValues: {
            last_name: lead?.last_name || "",
            contact: lead?.contact || "",
            email: lead?.email || "",
            aadhaar_no: lead?.aadhaar_no || "",
            pan_no: lead?.pan_no || "",
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
            contact: (value) => (value.length === 10 ? null : "Must be 10 digits"),
            last_name: (value) => (value.length > 0 ? null : "Last name is required"),
        },
    });

    const nextStep = () =>
        setActive((current) => {
            if (form.validate().hasErrors) {
                return current;
            }
            return current < 3 ? current + 1 : current;
        });

    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    const verifyAadhaar = () => {
        const aadhaar = form.values.aadhaar_no;
        if (/^\d{12}$/.test(aadhaar)) {
            setAadhaarVerified(true);
            return true;
        }
        setAadhaarVerified(false);
        form.setFieldError('aadhaar_no', 'Aadhaar must be 12 digits');
        return false;
    };

    const verifyPan = () => {
        const pan = form.values.pan_no;
        if (/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(pan)) {
            setPanVerified(true);
            return true;
        }
        setPanVerified(false);
        form.setFieldError('pan_no', 'PAN must be in format ABCDE1234F');
        return false;
    };

    const handleAadhaarChange = (value: string, index: number) => {
        const newAadhaar = form.values.aadhaar_no.split("");
        newAadhaar[index] = value;
        form.setFieldValue("aadhaar_no", newAadhaar.join(""));
        setAadhaarVerified(false);

        if (value && index < 11) {
            const nextInput = document.getElementById(`aadhaar-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    return (
        <Box>
            <Stepper
                active={active}
                onStepClick={setActive}
                allowNextStepsSelect={false}
                breakpoint="sm"
            >
                <Stepper.Step label="First step" description="Basic information">
                    <Stack spacing="md">
                        <TextInput
                            label="Last Name"
                            placeholder="Enter last name"
                            required
                            {...form.getInputProps("last_name")}
                        />
                        <TextInput
                            label="Contact Number"
                            placeholder="Enter contact number"
                            required
                            type="tel"
                            {...form.getInputProps("contact")}
                        />
                        <TextInput
                            label="Email"
                            placeholder="Enter email"
                            required
                            {...form.getInputProps("email")}
                        />
                    </Stack>
                </Stepper.Step>

                <Stepper.Step label="Second step" description="Aadhaar verification">
                    <Stack spacing="md">
                        <Text size="sm" weight={500}>
                            Aadhaar Number
                        </Text>
                        <Group spacing={5}>
                            {Array.from({ length: 12 }).map((_, index) => (
                                <TextInput
                                    key={index}
                                    id={`aadhaar-${index}`}
                                    style={{ width: rem(40), position: 'relative' }}
                                    maxLength={1}
                                    value={form.values.aadhaar_no[index] ? " " : ""}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value) handleAadhaarChange(value, index);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Backspace" && !form.values.aadhaar_no[index] && index > 0) {
                                            document.getElementById(`aadhaar-${index - 1}`)?.focus();
                                        }
                                    }}
                                    styles={{
                                        input: {
                                            textAlign: 'center',
                                            paddingLeft: rem(12),
                                            letterSpacing: rem(4),
                                            height: rem(40),
                                        },
                                    }}
                                    rightSection={
                                        form.values.aadhaar_no[index] && (
                                            <IconPointFilled
                                                size={16}
                                                style={{
                                                    position: 'absolute',
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    pointerEvents: 'none'
                                                }}
                                            />
                                        )
                                    }
                                />
                            ))}
                        </Group>
                        <Button
                            onClick={verifyAadhaar}
                            leftIcon={aadhaarVerified ? <IconCheck /> : null}
                            variant={aadhaarVerified ? "light" : "filled"}
                            color={aadhaarVerified ? "teal" : "blue"}
                        >
                            {aadhaarVerified ? "Aadhaar Verified" : "Verify Aadhaar"}
                        </Button>
                        {form.errors.aadhaar_no && (
                            <Text size="sm" color="red">
                                {form.errors.aadhaar_no}
                            </Text>
                        )}
                    </Stack>
                </Stepper.Step>

                <Stepper.Step label="Final step" description="PAN verification">
                    <Stack spacing="md">
                        <TextInput
                            label="PAN Number"
                            placeholder="Enter PAN number"
                            description="Format: ABCDE1234F"
                            {...form.getInputProps("pan_no")}
                        />
                        <Button
                            onClick={verifyPan}
                            leftIcon={panVerified ? <IconCheck /> : null}
                            variant={panVerified ? "light" : "filled"}
                            color={panVerified ? "teal" : "blue"}
                        >
                            {panVerified ? "PAN Verified" : "Verify PAN"}
                        </Button>
                        {form.errors.pan_no && (
                            <Text size="sm" color="red">
                                {form.errors.pan_no}
                            </Text>
                        )}
                    </Stack>
                </Stepper.Step>

                <Stepper.Completed>
                    <Box>
                        <Text size="lg" weight={500} mb="md">
                            Review your information
                        </Text>
                        <Code block>
                            {JSON.stringify(
                                {
                                    last_name: form.values.last_name,
                                    contact: form.values.contact,
                                    email: form.values.email,
                                    aadhaar_no: `${form.values.aadhaar_no.substring(0, 4)} XXXXXX ${form.values.aadhaar_no.substring(8)}`,
                                    pan_no: form.values.pan_no,
                                },
                                null,
                                2
                            )}
                        </Code>
                    </Box>
                </Stepper.Completed>
            </Stepper>

            <Group position="right" mt="xl">
                {active !== 0 && (
                    <Button variant="default" onClick={prevStep}>
                        Back
                    </Button>
                )}
                {active !== 3 && (
                    <Button onClick={nextStep} disabled={active === 1 && !aadhaarVerified}>
                        Next step
                    </Button>
                )}
                {active === 3 && (
                    <Button
                        onClick={() => onSubmit(form.values)}
                        disabled={!aadhaarVerified || !panVerified}
                    >
                        {isEditing ? "Update Lead" : "Create Lead"}
                    </Button>
                )}
            </Group>
        </Box>
    );
}

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
            size: "xl",
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
            size: "xl",
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
                            style={(theme) => ({
                                flex: `1 1 calc(50% - ${theme.spacing.lg})`,
                                minWidth: rem(240),
                            })}
                        >
                            <Group mb="sm">
                                <Text size="lg">{`Offer ${idx + 1}`}</Text>
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

                            <Group mt="md">
                                <Button size="xs" variant="light">Apply now</Button>
                            </Group>
                        </Card>
                    ))}
                </Group>
            ),
        });
    };

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
                    { header: "Email", accessorKey: "email", size: 120 },
                    { header: "Last Name", accessorKey: "last_name", size: 120 },
                    { header: "Contact", accessorKey: "contact", size: 120 },
                    {
                        header: "PAN",
                        accessorFn: (row: any) => {
                            const pan = row.pan_no;
                            if (!pan) return null;
                            return `${pan.substring(0, 5)}XXXX${pan.charAt(9)}`;
                        },
                        size: 100
                    },
                    {
                        header: "Aadhaar",
                        accessorFn: (row: any) => {
                            const aadhaar = row.aadhaar_no;
                            if (!aadhaar) return null;
                            return `${aadhaar.substring(0, 4)}XXXXXX${aadhaar.substring(10)}`;
                        },
                        size: 140
                    },
                    {
                        header: "Created By",
                        accessorKey: "created_by",
                        size: 120
                    },
                    {
                        header: "CREATED DATE",
                        accessorFn: (row) => {
                            const { date, time } = toLocalFormattedDate(row.created_at);
                            return (
                                <div>
                                    <div>{date},</div>
                                    <div>{time}</div>
                                </div>
                            );
                        },
                        size: 140
                    },
                ]}
                data={data?.data ?? []}
                {...{ isFetching, isLoading, isError }}
                renderRowActions={({ row }: any) => (
                    <Flex gap="md" noWrap>
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
                    </Flex>
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
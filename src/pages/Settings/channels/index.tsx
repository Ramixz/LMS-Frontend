import { ActionIcon, Box, Button, Divider, Group, Tabs } from "@mantine/core";
import Page from "../../../components/Layout/Page";
import {  IconMessageCircle, IconDownload, IconList, IconPlus, IconMail } from "@tabler/icons-react";
import SMS from "./sms";
import SMTP from "./smtp";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { ChannelForm } from "./ChannelForm";
import { useCreateChannelMutation } from "../../../services/channel.api";
import { NotificationModuleType } from "../../../lib/enums/NotificationModuleType";
import { useState } from "react";
import RoleWrapper from "../../../components/RoleWrapper";
import { PERMISSIONS } from "../../../lib/permissions";
import { ALL_MODULES } from "../../../lib/enums/modules";

export default function Channels() {
    const [activeTab, setActiveTab] = useState<NotificationModuleType>(NotificationModuleType.EMAIL);
    const [createChannel] = useCreateChannelMutation();

    const handleAddChannel = (moduleType?: NotificationModuleType) => {
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
                        <ActionIcon c={"secondary.7"} variant="transparent" size={"md"}>
                            <IconPlus />
                        </ActionIcon>
                    </Box>
                    <b>Add  Channel</b>
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

    return (
        <Page pageTitle="Channels" bgWhite>
            <Divider my="sm" />

            <Group justify="end" mb="md" pr={"xxs"}>
                <RoleWrapper permissions={[PERMISSIONS(ALL_MODULES.NOTIFICATIONCHANNEL).CREATE]}>
                    <Button
                        leftSection={<IconPlus size={20} />}
                        onClick={() => handleAddChannel(activeTab)}
                    >
                        Channel
                    </Button>
                </RoleWrapper>
                <Button leftSection={<IconDownload size={20} />} variant="outline">
                    Download
                </Button>
                <Button leftSection={<IconList size={20} />} variant="outline">
                    View
                </Button>
            </Group>

            <Tabs
                value={activeTab}
                onChange={(value) => setActiveTab(value as NotificationModuleType)}
                variant="default"
            >
                <Tabs.List>
                    <Tabs.Tab
                        value={NotificationModuleType.EMAIL}
                        leftSection={<IconMail size={12} />}
                    >
                        EMAIL
                    </Tabs.Tab>
                    <Tabs.Tab
                        value={NotificationModuleType.SINCH_SMS}
                        leftSection={<IconMessageCircle size={12} />}
                    >
                        SMS
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value={NotificationModuleType.EMAIL}>
                    <SMTP />
                </Tabs.Panel>
                <Tabs.Panel value={NotificationModuleType.SINCH_SMS}>
                    <SMS />
                </Tabs.Panel>
            </Tabs>
        </Page >
    );
}
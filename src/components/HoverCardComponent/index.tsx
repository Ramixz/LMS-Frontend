import { HoverCard, Text, Table, Loader, Badge, Menu, Group, Stack } from "@mantine/core";
import { useGetConnectorByIdQuery } from "../../services/connector.api";
import { ReactNode, useState } from "react";
import { useHover } from "@mantine/hooks";
import { connectorTypeMap } from "../../lib/constants/connector-types";
import { IconEye } from "@tabler/icons-react";


interface MantineHoverCardProps {
    id: string;
    trigger: ReactNode;
}

interface ConnectorsListProps {
    connectors: string[];
    joins: { index: string; key: string; dataset: string }[];
}


interface PermissionsHoverCardProps {
    permissions: string[];
}

function formatPermissions(permissions: string[]): Record<string, string[]> {
    const grouped: Record<string, string[]> = {};

    permissions.forEach((perm) => {
        const [entity, action] = perm.split(":");
        if (!grouped[entity]) {
            grouped[entity] = [];
        }
        grouped[entity].push(action);
    });

    return grouped;
}


export function MantineHoverCardComponent({ id, trigger }: MantineHoverCardProps) {
    const { hovered, ref } = useHover()

    const { data, isLoading } = useGetConnectorByIdQuery({ id }, { skip: !id || !hovered });
    const connectorTypeKey = data?.data.connectorInfo?.type ?? "";
    const connectorType = connectorTypeKey in connectorTypeMap ? connectorTypeMap[connectorTypeKey] : "Unknown";
    return (
        <HoverCard width={280} shadow="md" openDelay={100} closeDelay={0}>
            <HoverCard.Target>
                <div ref={ref}>
                    {trigger}
                </div>
            </HoverCard.Target>
            <HoverCard.Dropdown>
                <Text size="sm" color="gray">
                    <b>Connector Information</b>
                </Text>
                {isLoading ? (
                    <Loader size="sm" />
                ) : (
                    <Table>
                        <tbody>
                            <tr>
                                <td>Name</td>
                                <td><Text size="sm" color="red">{data?.data.connectorInfo.name ?? "Null"}</Text></td>
                            </tr>
                            <tr>
                                <td>Type</td>
                                <td><Text size="sm" color="red">{connectorType}</Text></td>
                            </tr>
                            <tr>
                                <td>Status</td>
                                <td><Text size="sm" color="red">{data?.data.connectorInfo.status === "SUCCESS" ? "Active" : "Inactive"}</Text></td>
                            </tr>
                        </tbody>
                    </Table>
                )}
            </HoverCard.Dropdown>
        </HoverCard>
    );
}



export function CorrelationHoverCard({ connectors, joins }: ConnectorsListProps) {
    const [menuOpened, setMenuOpened] = useState(false);
    const { hovered, ref } = useHover();

    if (hovered && menuOpened) {
        setMenuOpened(false);
    }

    if (!connectors || connectors.length === 0) {
        return <span>No Connectors</span>;
    }

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <HoverCard width={250} shadow="md" openDelay={100} closeDelay={0}>
                <HoverCard.Target>
                    <div ref={ref}>
                        <Badge style={{
                            backgroundColor: "#F4F5F6",
                            color: "#383E42",
                            fontWeight: 600,
                            cursor: "pointer",
                        }}
                            radius={"sm"}
                        >
                            {connectors[0]}
                        </Badge>
                    </div>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                    <Text size="sm" color="gray"><b>Dataset Information</b></Text>
                    {joins[0] ? (
                        <Table>
                            <tbody>
                                <tr>
                                    <td>Dataset</td>
                                    <td><Text size="sm" color="red">{joins[0].dataset ?? "N/A"}</Text></td>
                                </tr>
                                <tr>
                                    <td>Key</td>
                                    <td><Text size="sm" color="red">{joins[0].key ?? "N/A"}</Text></td>
                                </tr>
                            </tbody>
                        </Table>
                    ) : <Loader size="sm" />}
                </HoverCard.Dropdown>
            </HoverCard>

            {connectors.length > 1 && (
                <Menu
                    withinPortal
                    position="bottom"
                    withArrow
                    opened={menuOpened}
                    onOpen={() => setMenuOpened(true)}
                    onClose={() => setMenuOpened(false)}
                >
                    <Menu.Target>
                        <Text component="span" size="11px" style={{ cursor: "pointer", color: "#020c31" }}>
                            ...(+{connectors.length - 1} more)
                        </Text>
                    </Menu.Target>
                    <Menu.Dropdown style={{ maxWidth: "300px", padding: "8px" }}>
                        <Group gap="xs">
                            {connectors.slice(1).map((connector, index) => (
                                <HoverCard key={index} width={250} shadow="md" openDelay={100} closeDelay={0}>
                                    <HoverCard.Target>
                                        <Badge style={{
                                            backgroundColor: "#F4F5F6",
                                            color: "#383E42",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                        }}
                                            radius={"sm"}
                                        >
                                            {connector}
                                        </Badge>
                                    </HoverCard.Target>
                                    <HoverCard.Dropdown>
                                        <Text size="sm" color="gray"><b>Dataset Information</b></Text>
                                        {joins[index + 1] ? (
                                            <Table>
                                                <tbody>
                                                    <tr>
                                                        <td>Dataset</td>
                                                        <td><Text size="sm" color="red">{joins[index + 1].dataset ?? "N/A"}</Text></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Key</td>
                                                        <td><Text size="sm" color="red">{joins[index + 1].key ?? "N/A"}</Text></td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        ) : <Loader size="sm" />}
                                    </HoverCard.Dropdown>
                                </HoverCard>
                            ))}
                        </Group>
                    </Menu.Dropdown>
                </Menu>
            )}
        </div>
    );
}



export default function PermissionsHoverCard({ permissions = [] }: PermissionsHoverCardProps) {
    const formattedPermissions = formatPermissions(permissions);

    const longestPermission = Object.entries(formattedPermissions)
        .map(([entity, actions]) => `${entity}: ${actions.join(", ")}`)
        .reduce((longest, current) => (current.length > longest.length ? current : longest), "");

    const estimatedWidth = Math.min(Math.max(longestPermission.length * 7, 320), 600);

    return (
        <HoverCard shadow="md" withArrow openDelay={100} closeDelay={0}>
            <HoverCard.Target>
                <IconEye size={22} stroke={1.5} color="#6E7882"/>
            </HoverCard.Target>
            <HoverCard.Dropdown
                p="md"
                style={{
                    minWidth: estimatedWidth,
                    maxWidth: "90vw",
                    whiteSpace: "normal",
                    overflowWrap: "break-word",
                }}
            >
                <Stack gap={"xs"}>
                    {Object.entries(formattedPermissions).map(([entity, actions]) => (
                        <Text key={entity} size="sm">
                            <span style={{ fontWeight: 600, marginRight: "12px", display: "inline-block" }}>
                                •
                            </span>
                            <span style={{ fontWeight: 600 }}>{entity} : </span>{" "}
                            <span style={{ color: "#8E979F" }}>{actions.join(", ")}</span>
                        </Text>
                    ))}
                </Stack>
            </HoverCard.Dropdown>
        </HoverCard>
    );
}
// DataExplorer.tsx
import {
  Tabs,
  Card,
  Text,
  Image,
  Grid,
  Group,
  Box,
  Divider,
  Loader,
  Center,
} from '@mantine/core';
import Page from '../../components/Layout/Page';
import { useEffect, useState } from 'react';
import { useLazyGetConnectorListQuery } from '../../services/connector.api';
import { staticConnectors } from '../../lib/constants/Connectors';

const categories = ['Application', 'Database', 'File', 'Internal'];

export default function DataExplorer() {
  const [loadConnectors, { data, isLoading }] = useLazyGetConnectorListQuery();
  const [connectors, setConnectors] = useState(staticConnectors);

  useEffect(() => {
    loadConnectors();
  }, []);

  useEffect(() => {
    if (data?.data) {
      const updated = staticConnectors.map((connector) => ({
        ...connector,
        connectors: String(Number(data.data[connector.type]) || 0).padStart(2, '0'),
      }));
      setConnectors(updated);
    }
  }, [data]);

  return (
    <Page pageTitle="Data Explorer">
      <Divider my="sm" size="sm" />
      <Tabs defaultValue="Application" radius="xs" mt="lg">
        <Tabs.List grow mb="lg">
          {categories.map((category) => (
            <Tabs.Tab
              value={category}
              key={category}
              fw={500}
              styles={{
                tab: {
                  '&[data-active]': {
                    backgroundColor: '#facc15',
                    color: '#000',
                    fontWeight: 600,
                  },
                },
              }}
            >
              {category}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {categories.map((category) => (
          <Tabs.Panel value={category} key={category}>
            <Box px={0}>
              {isLoading ? (
                <Center py="lg">
                  <Loader />
                </Center>
              ) : (
                <Grid gutter="lg">
                  {connectors
                    .filter((conn) => conn.category === category)
                    .map((connector, i) => {
                      const connectorId = `${connector.name}-${i}`;

                      return (
                        <Grid.Col
                          span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                          key={connectorId}
                        >
                          <Card shadow="sm" padding="lg" radius="md" withBorder bg="white" style={{ height: '100%' }}>
                            <Group justify="space-between" align="start" mb="xs">
                              {connector.logo ? (
                                <Image
                                  src={connector.logo}
                                  alt={connector.name}
                                  height={50}
                                  width={80}
                                  fit="contain"
                                />
                              ) : (
                                <Text fw={700} size="lg" c="blue">
                                  {connector.name.slice(0, 3).toUpperCase()}
                                </Text>
                              )}
                              <Text size="xs" c="dimmed">
                                No. of Connectors: {connector.connectors}
                              </Text>
                            </Group>
                            <Text fw={700} size="sm" mt="sm" mb={2}>
                              {connector.name}
                            </Text>
                            <Text size="sm" c="gray">
                              {connector.description}
                            </Text>
                          </Card>
                        </Grid.Col>
                      );
                    })}
                </Grid>
              )}
            </Box>
          </Tabs.Panel>
        ))}
      </Tabs>
    </Page>
  );
}

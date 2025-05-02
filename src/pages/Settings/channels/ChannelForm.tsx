import { TextInput, Select, Group, Button, Grid } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { z } from "zod";
import { zodResolver } from "@mantine/form";
import { EmailModule } from "../../../types/channel.type";
import { NotificationModuleType } from "../../../lib/enums/NotificationModuleType";

const smtpConfigSchema = z.object({
  serverName: z.string().min(1, "Server name is required"),
  port: z.coerce.number().min(1, "Port is required"),
  tls: z.string().optional(),
  encryptionMethod: z.string().optional(),
  userName: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  subjectEmail: z.string().optional(),
});

const smsConfigSchema = z.object({
  plan_id: z.string().min(1, "Plan ID is required"),
  api_token: z.string().min(1, "API Token is required"),
  token: z.string().min(1, "Token is required"),
  baseUrl: z.string().min(1, "Base URL is required"),
  senderSMS: z.string().min(1, "Sender SMS is required"),
  sms: z.string().min(1, "Message is required"),
});

const channelSchema = z.discriminatedUnion("module", [
  z.object({
    module: z.literal(NotificationModuleType.EMAIL),
    name: z.string().min(1, "Name is required"),
    config: smtpConfigSchema,
  }),
  z.object({
    module: z.literal(NotificationModuleType.SINCH_SMS),
    name: z.string().min(1, "Name is required"),
    config: smsConfigSchema,
  }),
]);

type ChannelFormValues = z.infer<typeof channelSchema>;

interface ChannelFormProps {
  channel?: EmailModule;
  initialModule?: NotificationModuleType;
  onSubmit: (values: ChannelFormValues) => void;
}

export const ChannelForm: React.FC<ChannelFormProps> = ({
  channel,
  initialModule = NotificationModuleType.EMAIL,
  onSubmit
}) => {
  const isEdit = !!channel;

  const getInitialConfig = () => {
    if (!channel) return {} as any;
    return {
      ...(channel.module === NotificationModuleType.EMAIL
        ? {
          serverName: "",
          port: "",
          userName: "",
          password: "",
          tls: "",
          encryptionMethod: "",
          subjectEmail: "",
        }
        : {
          plan_id: "",
          api_token: "",
          token: "",
          baseUrl: "",
          senderSMS: "",
          sms: "",
        }),
      ...channel.config,
    };
  };

  const form = useForm<ChannelFormValues>({
    validate: zodResolver(channelSchema),
    initialValues: {
      module: (channel?.module as NotificationModuleType) || initialModule,
      name: channel?.name || "",
      config: getInitialConfig(),
    },
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <Select
            label="Module Type"
            placeholder="Select module"
            data={[
              { value: NotificationModuleType.EMAIL, label: "Email" },
              { value: NotificationModuleType.SINCH_SMS, label: "SMS" },
            ]}
            {...form.getInputProps("module")}
            required
            disabled={isEdit}
            checkIconPosition="right"
          
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6 }}>
          <TextInput
            label="Name"
            placeholder="Enter channel name"
            {...form.getInputProps("name")}
            required
          />
        </Grid.Col>

        {form.values.module === NotificationModuleType.EMAIL && (
          <>
            <Grid.Col span={6}>
              <TextInput
                label="Server Name"
                placeholder="Enter server name"
                {...form.getInputProps("config.serverName")}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Port"
                placeholder="Enter port"
                type="number"
                {...form.getInputProps("config.port")}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="TLS"
                placeholder="Enter TLS"
                {...form.getInputProps("config.tls")}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Encryption Method"
                placeholder="Enter encryption method"
                {...form.getInputProps("config.encrytionMethod")}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Username"
                placeholder="Enter username"
                {...form.getInputProps("config.userName")}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Password"
                placeholder="Enter password"
                type="password"
                {...form.getInputProps("config.password")}
                required
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <TextInput
                label="Subject"
                placeholder="Enter email subject"
                {...form.getInputProps("config.subjectEmail")}
              />
            </Grid.Col>
          </>
        )}

        {form.values.module === NotificationModuleType.SINCH_SMS && (
          <>
            <Grid.Col span={6}>
              <TextInput
                label="Plan ID"
                placeholder="Enter plan ID"
                {...form.getInputProps("config.plan_id")}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="API Token"
                placeholder="Enter API token"
                {...form.getInputProps("config.api_token")}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Token"
                placeholder="Enter token"
                {...form.getInputProps("config.token")}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Base URL"
                placeholder="Enter base URL"
                {...form.getInputProps("config.baseUrl")}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Sender SMS"
                placeholder="Enter sender number"
                {...form.getInputProps("config.senderSMS")}
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Message"
                placeholder="Enter default message"
                {...form.getInputProps("config.sms")}
                required
              />
            </Grid.Col>
          </>
        )}
      </Grid>

      <Group justify="flex-start" mt="md" gap="sm">
        <Button type="submit" disabled={isEdit && !form.isDirty()}>
          {isEdit ? "Save Changes" : "Create Channel"}
        </Button>
        <Button variant="outline" onClick={() => modals.closeAll()}>
          Cancel
        </Button>
      </Group>
    </form>
  );
};

import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";
import classes from "./AuthenticationTitle.module.css";
import z from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { useLoginMutation } from "../../../services/auth.api";
import useAuthStorage from "../../../hooks/useAuthStorage";
import useNav from "../../../hooks/useNav";
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
type LogonFormValues = z.infer<typeof LoginSchema>;
export default function Login() {
  const form = useForm<LogonFormValues>({
    validate: zodResolver(LoginSchema),
  });
  const [login] = useLoginMutation();
  const { addToken, addRefreshToken } = useAuthStorage();
  const navigate = useNav();
  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{" "}
        <Anchor size="sm" component="button">
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form
          onSubmit={form.onSubmit(
            (values) => {
              login(values).then(async (res) => {
                if (res.data?.access_token) {
                  await addToken(res.data?.access_token);
                  await addRefreshToken(res.data?.refresh_token);
                  await navigate("dashboard.index");
                }
              });
            },
            (errors) => {
              console.error(errors);
            }
          )}
        >
          <TextInput
            label="Email"
            placeholder="you@mantine.dev"
            required
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps("password")}
          />
          <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" />
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl" type="submit">
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

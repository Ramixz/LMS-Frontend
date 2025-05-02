import { isRouteErrorResponse, useRouteError, Link } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  Code,
  Button,
  Stack,
  Group,
} from "@mantine/core";

const ErrorBoundary = () => {
  const error = useRouteError();

  const isRouteError = isRouteErrorResponse(error);

  return (
    <Container size="sm" style={{ textAlign: "center", marginTop: "10%" }}>
      <Stack align="center" gap="lg">
        <Title order={1}>Something went wrong</Title>

        {isRouteError ? (
          <div>
            <Title order={2}>Error {error.status}</Title>
            <Text size="lg">{error.statusText}</Text>
            {error.data && (
              <Code block style={{ marginTop: "1rem" }}>
                {JSON.stringify(error.data, null, 2)}
              </Code>
            )}
          </div>
        ) : (
          <div>
            <Text size="lg">Unexpected error occurred.</Text>
            <Code style={{ marginTop: "1rem" }}>
              <>
                {error instanceof Error && "message" in error
                  ? `${error.message}`
                  : "No error details available."}
              </>
            </Code>
          </div>
        )}

        <Group align="center" gap="md">
          <Button component={Link} to="/" variant="filled">
            Go back to Home
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reload the page
          </Button>
        </Group>
      </Stack>
    </Container>
  );
};

export default ErrorBoundary;
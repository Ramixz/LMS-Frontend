import { RouterProvider } from "react-router-dom";
import "@mantine/core/styles.css"; //import Mantine V7 styles needed by MRT
import "@mantine/dates/styles.css"; //if using mantine date picker features
import "mantine-react-table/styles.css"; //import MRT styles
import '@mantine/notifications/styles.css';
import router from "./router";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from '@mantine/notifications';
import Theme from "./components/Theme";
import { useSelfRolesQuery } from "./services/roles.api";

export default function App() {
  useSelfRolesQuery()
  return (
    <Theme>
      <ModalsProvider>
        <Notifications position="top-center" />
          <RouterProvider router={router()} />
      </ModalsProvider>
    </Theme>
  );
}

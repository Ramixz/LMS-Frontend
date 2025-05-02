import {
  Button,
  createTheme,
  FileInput,
  MantineProvider,
  MantineProviderProps,
  Paper,
  Textarea,
  PasswordInput,
  TextInput,
  MultiSelect,
  NumberInput,
  ActionIcon,
  Tabs,
  TagsInput,
  Select,
  Fieldset,
  TableTh,
  Autocomplete,
  TabsPanel,
  Menu,
  Card,
} from "@mantine/core";
import { DateInput, DatePickerInput } from "@mantine/dates";
import classes from "./Theme.module.css";
import { colors } from "../../lib/constants/theme-colors";

const theme = createTheme({
  colors,
  defaultGradient: {
    deg: 81,
    from: colors.primary[9],
    to: colors.primary[6],
  },
  shadows: {
    md: "1px 1px 3px rgba(0, 0, 0, .25)",
    xl: "5px 5px 3px rgba(0, 0, 0, .25)",
  },
  primaryColor: "primary",
  primaryShade: 7,
  fontFamily: `"Montserrat", sans-serif`,
  // defaultRadius: "sm",
  headings: {
    sizes: {
      h1: { fontSize: "46px" },
      h2: { fontSize: "40px" },
      h3: { fontSize: "36px" },
      h4: { fontSize: "32px" },
      h5: { fontSize: "28px" },
      h6: { fontSize: "28px" },
    },
  },

  components: {
    Button: Button.extend({
      defaultProps: {
        variant: "gradient",
        radius: "sm",
      },
      styles: (theme, props) => {

        return {
          root: {
            color: props.variant == "transparent" ? theme.colors.surfaceGrey[7] : "primary"
          }
        }
      }
    }),
    TextInput: TextInput.extend({
      defaultProps: {
        radius: "sm",
      },
    }),
    Select: Select.extend({
      defaultProps: {
        radius: "sm",
        checkIconPosition:"right",
        withScrollArea:true
      },
      styles: {
        section: { marginRight: "20px", width: 30 },
      },
    }),
    TagsInput: TagsInput.extend({
      defaultProps: {
        radius: "sm",
      },
      styles: {
        section: { marginRight: "20px", width: 30 },
      },
    }),
    Autocomplete: Autocomplete.extend({
      defaultProps: {
        radius: "sm",
      },
      styles: {
        section: { marginRight: "20px", width: 30 },
      },
    }),

    Textarea: Textarea.extend({
      defaultProps: {
        radius: "sm",
        autosize: true,
      },
    }),
    FileInput: FileInput.extend({
      defaultProps: {
        radius: "sm",
      },
    }),
    PasswordInput: PasswordInput.extend({
      defaultProps: {
        radius: "sm",
      },
    }),
    Paper: Paper.extend({
      defaultProps: {
        radius: "md",
      },
    }),
    MultiSelect: MultiSelect.extend({
      defaultProps: {
        radius: "sm",
      },
    }),
    NumberInput: NumberInput.extend({
      defaultProps: {
        radius: "sm",
        onInputCapture: (e) => {
          if (Number.isNaN(Number(e.currentTarget.value))) {
            e.preventDefault();
          }
        },
      },
    }),
    DateInput: DateInput.extend({
      defaultProps: {
        radius: "sm",
        clearable: true,
      },
    }),
    DatePickerInput: DatePickerInput.extend({
      defaultProps: {
        radius: "sm",
        clearable: true,
      },
    }),
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        styles(theme, props, ctx) {
          return (
            {
              icon: {
                c: props.variant === "subtle" ? "surfaceGrey.7" : "inherit",
              }
            }
          )
        },
        radius: "sm",
      },
    }),
    Tabs: Tabs.extend({
      defaultProps: {
        mih: "100%",
        mah: "100%",
        h: "100%",
      },
      classNames: {
        tab: classes.tab,
        list: classes.list,
      },
    }),
    TabsPanel: TabsPanel.extend({
      defaultProps: {
        mih: "100%",
        mah: "100%",
        h: "100%",
      },
    }),
    TableTh: TableTh.extend({
      defaultProps: {
        bg: "primary.0",
      },
    }),
    Fieldset: Fieldset.extend({
      defaultProps: {
        radius: "sm",
      },
      classNames: classes,
    }),
    Card: Card.extend({
      defaultProps: {
        radius: "lg"
      }
    }),
    Menu: Menu.extend({
      defaultProps: {
        styles(theme) {
          return {
            item: {
              color: theme.colors.surfaceGrey[8]
            }
          }
        },
      }
    }),
  },
});

function Theme(props: MantineProviderProps) {
  return <MantineProvider theme={theme} {...props} />;
}

export default Theme;

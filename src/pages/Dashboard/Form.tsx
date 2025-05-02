import { Button, Group, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";

export interface DashboardFormValues {
  name: string;
  description: string;
}

export interface DashboardFormProps {
  dashboard?: DashboardFormValues;
  onSubmit: (values: DashboardFormValues) => void;
  isEditing?: boolean;
}

const DashboardForm: React.FC<DashboardFormProps> = ({ dashboard, onSubmit, isEditing = false }) => {
  const form = useForm<DashboardFormValues>({
    initialValues: {
      name: dashboard?.name || "",
      description: dashboard?.description || "",
    },
    validate: {
      name: (value) => (value ? null : "Name is required"),
      description: (value) => (value ? null : "Description is required"),
    },
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <TextInput
        label="Name"
        placeholder="Enter name here..."
        {...form.getInputProps("name")}
        mb="md"
        required
      />
      <Textarea
        label="Description"
        placeholder="Enter description here..."
        {...form.getInputProps("description")}
        required
        mt="lg"
      />
      <Group justify="flex-start" mt="md" gap="sm">
        <Button type="submit" radius="sm" disabled={isEditing ? !form.isDirty() : false}>
          {isEditing ? "Save Changes" : "Create Dashboard"}
        </Button>
        <Button variant="outline" radius="sm" onClick={() => modals.closeAll()}>
          Cancel
        </Button>
      </Group>
    </form>
  );
};

export default DashboardForm;

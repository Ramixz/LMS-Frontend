import { Button, Grid, Group, TextInput, MultiSelect } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import { z } from "zod";
import { UserFormValues } from "../../../types/user.type";

const UserFormSchema = z.object({
  firstName: z.string().regex(/^[A-Za-z]+$/, 'First name must contain only letters'),
  lastName: z.string().regex(/^[A-Za-z]+$/, 'Last name must contain only letters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Minimum 8 characters').optional().or(z.literal('')),
  assignedRole: z.array(z.string()).nonempty('Please select at least one role')
});


interface UserFormProps {
  user?: any;
  onSubmit: (values: UserFormValues) => void;
  roleOptions: { value: string; label: string }[];
  isEditing?: boolean;
}

export function UserForm({ user, onSubmit, roleOptions, isEditing = false }: UserFormProps) {
  const form = useForm<UserFormValues>({
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      assignedRole: user?.assignedRole,
      password: ''
    },
    validate: zodResolver(UserFormSchema)
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Grid gutter="md">
        <Grid.Col span={6}>
          <TextInput
            label="First Name"
            placeholder="Enter first name"
            {...form.getInputProps('firstName')}
            required
            mb="md"
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Last Name"
            placeholder="Enter last name"
            {...form.getInputProps('lastName')}
            required
            mb="md"
          />
        </Grid.Col>
      </Grid>

      <TextInput
        label="Email"
        placeholder="Enter email"
        {...form.getInputProps('email')}
        required
        mb="md"
        disabled={isEditing}
      />

      {!isEditing && (
        <TextInput
          label="Password"
          type="password"
          placeholder="Enter password"
          {...form.getInputProps('password')}
          required
          mb="md"
        />
      )}

      <MultiSelect
        label="Assign Roles"
        placeholder="Select roles"
        data={roleOptions}
        {...form.getInputProps('assignedRole')}
        required
        mb="lg"
        withScrollArea
        checkIconPosition="right"
        searchable
      />

      <Group justify="flex-start" mt="md" gap="sm">
        <Button 
          type="submit" 
          disabled={isEditing && !form.isDirty()}
        >
          Save
        </Button>
        <Button variant="outline" onClick={() => modals.closeAll()}>
          Cancel
        </Button>
      </Group>
    </form>
  );
}



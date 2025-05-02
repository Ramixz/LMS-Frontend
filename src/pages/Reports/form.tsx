// LeadForm.tsx
import { Button, Grid, Group, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import { z } from "zod";

const LeadFormSchema = z.object({
  aadhaar_no: z.string().length(12, 'Must be 12 digits').regex(/^\d+$/, 'Must be only digits'),
  pan_no: z.string().regex(/^[A-Z]{5}\d{4}[A-Z]$/, 'Invalid PAN format'),
  last_name: z.string().min(1, 'Last name is required'),
  address: z.string().optional(),
  email: z.string().email('Invalid email'),
  contact: z.string().min(10, 'Invalid contact number')
});

interface LeadFormProps {
  lead?: any;
  onSubmit: (values: any) => void;
  isEditing?: boolean;
}

export function LeadForm({ lead, onSubmit, isEditing = false }: LeadFormProps) {
  const form = useForm({
    initialValues: {
      aadhaar_no: lead?.aadhaar_no || '',
      pan_no: lead?.pan_no || '',
      last_name: lead?.last_name || '',
      address: lead?.address || '',
      email: lead?.email || '',
      contact: lead?.contact || ''
    },
    validate: zodResolver(LeadFormSchema)
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Grid gutter="md">
        <Grid.Col span={6}>
          <TextInput
            label="Aadhaar Number"
            placeholder="Enter 12-digit Aadhaar"
            {...form.getInputProps('aadhaar_no')}
            required
            mb="md"
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="PAN Number"
            placeholder="Enter PAN number"
            {...form.getInputProps('pan_no')}
            required
            mb="md"
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Last Name"
            placeholder="Enter last name"
            {...form.getInputProps('last_name')}
            required
            mb="md"
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Contact Number"
            placeholder="Enter contact number"
            {...form.getInputProps('contact')}
            required
            mb="md"
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <TextInput
            label="Email"
            placeholder="Enter email"
            {...form.getInputProps('email')}
            required
            mb="md"
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <TextInput
            label="Address"
            placeholder="Enter address"
            {...form.getInputProps('address')}
            mb="md"
          />
        </Grid.Col>
      </Grid>

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
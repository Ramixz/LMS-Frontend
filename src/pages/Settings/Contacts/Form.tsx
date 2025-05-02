import { Button, Grid, Group, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import { ContactFormProps, ContactFormValues } from "../../../types/contact.type";
import { z } from "zod";
const ContactFormSchema = z.object({
    firstName: z.string().regex(/^[A-Za-z]+$/, 'First name must contain only letters'),
    lastName: z.string().regex(/^[A-Za-z]+$/, 'Last name must contain only letters'),
    phone: z.string().refine((value) => /^\d{10}$/.test(value.replace(/\D/g, '')), {
        message: 'Phone number must be 10 digits'
    }),
    email: z.string().email('Invalid email address')
});

const ContactForm: React.FC<ContactFormProps> = ({ 
    contact, 
    onSubmit, 
    isEditing = false 
}) => {
    const form = useForm<ContactFormValues>({
        initialValues: {
            firstName: contact.firstName ?? "",
            lastName: contact.lastName ?? "",
            phone: contact.phone ?? "",
            email: contact.email ?? ""
        },
        validate: zodResolver(ContactFormSchema)
    });

    return (
        <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
            <Grid gutter="md">
                <Grid.Col span={6}>
                    <TextInput
                        label="First Name"
                        placeholder="Enter first name..."
                        {...form.getInputProps("firstName")}
                        required
                        mb="md"
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <TextInput
                        label="Last Name"
                        placeholder="Enter last name..."
                        {...form.getInputProps("lastName")}
                        required
                        mb="md"
                    />
                </Grid.Col>
            </Grid>
            <TextInput
                label="Phone No."
                placeholder="Enter phone no..."
                {...form.getInputProps("phone")}
                required
                mb="md"
            />
            <TextInput
                label="Email Address"
                placeholder="Enter email..."
                {...form.getInputProps("email")}
                required
                mb="lg"
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
};

export default ContactForm
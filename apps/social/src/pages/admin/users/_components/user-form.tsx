import { UserDto, userSchema } from '@nexsoft-admin/models';
import { t } from '@lingui/core/macro';
import { Form, FormGenerator, type FieldConfig } from '@nexsoft-admin/ui';
import { toast } from 'sonner';

interface Props {
  user?: UserDto;
  loading?: boolean;
}

function UserForm({ user, loading }: Props) {
  if (!user) return <div>Empty</div>;

  const fieldConfigs: FieldConfig[] = [
    {
      name: 'username',
      label: t`Username`,
      placeholder: t`Enter your username`,
      orientation: 'vertical',
    },
    {
      name: 'name',
      label: t`Name`,
      placeholder: t`Enter your name`,
      orientation: 'vertical',
    },
  ];

  return (
    <Form
      schema={userSchema}
      defaultValues={{
        username: '',
      }}
      fieldConfigs={fieldConfigs}
      onSubmit={(data) => {
        console.log('Form submitted:', data);
        toast.success('Form submitted!');
      }}
    >
      <FormGenerator schema={userSchema} fieldConfigs={fieldConfigs} />
    </Form>
  );
}

export { UserForm };

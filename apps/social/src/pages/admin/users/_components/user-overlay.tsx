import { OverlayItem } from '@/types/overlay.type';
import { Overlay } from '@/components/overlay';
import { Form, FormGenerator, type FieldConfig } from '@nexsoft-admin/ui';
import { useUser } from '@/services/user';
import { toast } from 'sonner';
import { t } from '@lingui/core/macro';
import { updateUserSchema } from '@nexsoft-admin/models';
import { useMemo } from 'react';

function UserOverlay({ isTop, mode, props, ...rest }: OverlayItem & { isTop: boolean }) {
  const { user, loading, error } = useUser({ id: props?.id });

  const schema = useMemo(() => {
    if (mode === 'update') return updateUserSchema;
    else return updateUserSchema;
  }, [mode]);

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
    <Overlay isTop={isTop} mode={mode} {...rest}>
      {error && <div>{error.message}</div>}
      <Form
        schema={schema}
        resetValues={user}
        fieldConfigs={fieldConfigs}
        onSubmit={(data) => {
          console.log('Form submitted:', data);
          toast.success('Form submitted!');
        }}
      >
        <FormGenerator loading={loading} schema={schema} fieldConfigs={fieldConfigs} />
      </Form>
    </Overlay>
  );
}

export { UserOverlay };

import { OverlayItem } from '@/types/overlay.type';
import { Overlay } from '@/components/overlay';
import { Form, FormGenerator, type FieldConfig } from '@nexsoft-admin/ui';
import { useUser, useUpdateUser } from '@/services/user';
import { useProfile } from '@/services/profile';
import { toast } from 'sonner';
import { t } from '@lingui/core/macro';
import { createUserSchema, updateUserSchema } from '@nexsoft-admin/models';
import { useMemo } from 'react';

function UserOverlay({ isTop, mode, props, ...rest }: OverlayItem & { isTop: boolean }) {
  const shouldFetchUser = (mode === 'update' || mode === 'duplicate') && Boolean(props?.id);
  const { user, loading, error } = useUser(
    { id: props?.id || '' },
    {
      enabled: shouldFetchUser,
    },
  );
  const { updateUser } = useUpdateUser();
  const { profile } = useProfile();

  const schema = useMemo(() => {
    if (mode === 'create') return createUserSchema;
    return updateUserSchema;
  }, [mode]);

  const fieldConfigs: FieldConfig[] = useMemo(
    () => [
      {
        name: 'Username',
        label: t`Username`,
        placeholder: t`Enter your username`,
        orientation: 'vertical',
        required: mode === 'create',
        disabled: mode === 'update',
      },
      {
        name: 'Name',
        label: t`Name`,
        placeholder: t`Enter your name`,
        orientation: 'vertical',
        required: mode === 'create',
      },
      {
        name: 'Bio',
        label: t`Bio`,
        placeholder: t`Enter your bio`,
        orientation: 'vertical',
        type: 'textarea',
      },
    ],
    [mode],
  );

  const resetValues = useMemo(() => {
    if (!user) return undefined;
    return {
      Username: user.Username,
      Name: user.Name,
      Bio: user.Bio ?? '',
    };
  }, [user]);

  const canRenderForm = mode === 'create' || (shouldFetchUser && user !== undefined);

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      if (mode === 'update' && props?.id && profile) {
        await updateUser({
          id: props.id as string,
          data: {
            user_id: props.id as string,
            name: data.Name as string,
            admin_id: String(profile.id),
          },
        });
      }

      if (rest.onSubmit) {
        await rest.onSubmit(mode);
      }

      toast.success(
        mode === 'create'
          ? t`User created successfully`
          : mode === 'duplicate'
            ? t`User duplicated successfully`
            : t`User updated successfully`,
      );
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(t`Failed to ${mode === 'create' ? 'create' : mode === 'duplicate' ? 'duplicate' : 'update'} user`);
      throw error;
    }
  };

  return (
    <Overlay isTop={isTop} mode={mode} {...rest}>
      {error && (
        <div className='text-destructive border-destructive/50 bg-destructive/10 mb-4 rounded-md border p-3 text-sm'>
          {error.message}
        </div>
      )}
      {canRenderForm ? (
        <Form
          schema={schema}
          resetValues={mode === 'create' ? undefined : resetValues}
          fieldConfigs={fieldConfigs}
          onSubmit={handleSubmit}
        >
          <FormGenerator loading={shouldFetchUser && loading} schema={schema} fieldConfigs={fieldConfigs} />
        </Form>
      ) : (
        <div className='flex items-center justify-center py-8'>
          <div className='text-muted-foreground text-center'>
            <div className='mb-2'>Loading user data...</div>
          </div>
        </div>
      )}
    </Overlay>
  );
}

export { UserOverlay };

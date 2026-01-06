import { OverlayItem } from '@/types/overlay.type';
import { Overlay } from '@/components/overlay';
import { Form, FormGenerator, type FieldConfig } from '@nexsoft-admin/ui';
import { useUser } from '@/services/user';
import { toast } from 'sonner';
import { t } from '@lingui/core/macro';
import { createUserSchema, updateUserSchema } from '@nexsoft-admin/models';
import { useMemo } from 'react';

function UserOverlay({ isTop, mode, props, ...rest }: OverlayItem & { isTop: boolean }) {
  // Delete mode is handled by Overlay component, no need to fetch user data
  const shouldFetchUser = (mode === 'update' || mode === 'duplicate') && Boolean(props?.id);
  const { user, loading, error } = useUser(
    { id: props?.id || '' },
    {
      enabled: shouldFetchUser,
    },
  );

  const schema = useMemo(() => {
    if (mode === 'create') return createUserSchema;
    if (mode === 'update' || mode === 'duplicate') return updateUserSchema;
    return updateUserSchema;
  }, [mode]);

  const fieldConfigs: FieldConfig[] = useMemo(
    () => [
      {
        name: 'username',
        label: t`Username`,
        placeholder: t`Enter your username`,
        orientation: 'vertical',
        required: mode === 'create',
      },
      {
        name: 'name',
        label: t`Name`,
        placeholder: t`Enter your name`,
        orientation: 'vertical',
        required: mode === 'create',
      },
      {
        name: 'bio',
        label: t`Bio`,
        placeholder: t`Enter your bio`,
        orientation: 'vertical',
        type: 'textarea',
      },
      {
        name: 'location',
        label: t`Location`,
        placeholder: t`Enter your location`,
        orientation: 'vertical',
      },
      {
        name: 'website_url',
        label: t`Website URL`,
        placeholder: t`https://example.com`,
        orientation: 'vertical',
        type: 'url',
      },
      {
        name: 'thumbnail_url',
        label: t`Thumbnail URL`,
        placeholder: t`https://example.com/thumbnail.jpg`,
        orientation: 'vertical',
        type: 'url',
      },
      {
        name: 'avatar_url',
        label: t`Avatar URL`,
        placeholder: t`https://example.com/avatar.jpg`,
        orientation: 'vertical',
        type: 'url',
      },
      {
        name: 'banner_url',
        label: t`Banner URL`,
        placeholder: t`https://example.com/banner.jpg`,
        orientation: 'vertical',
        type: 'url',
      },
    ],
    [mode],
  );

  // Delete mode is handled by Overlay component (AlertDialog), children won't be rendered
  // For create mode, form can render immediately
  // For update/duplicate, wait for user data to load
  const canRenderForm = mode === 'create' || (shouldFetchUser && user !== undefined);

  const handleSubmit = async (data: unknown) => {
    try {
      console.log('Form submitted:', data);

      // Call parent onSubmit if provided (this will trigger overlay's handleSubmit)
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
      throw error; // Re-throw to prevent overlay from closing
    }
  };

  // Overlay component handles delete mode with AlertDialog
  // Children are only rendered for create/update/duplicate modes
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
          resetValues={mode === 'create' ? undefined : user}
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

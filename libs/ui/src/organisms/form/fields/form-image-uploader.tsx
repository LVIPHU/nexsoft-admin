'use client';

import { useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';
import { ImageUploader, type ImageUploaderProps } from '../../../organisms/image-uploader/image-uploader';
import { FormField } from '../form-field';
import { FormFieldSkeleton } from '../form-field-skeleton';
import type { FieldConfig } from '../generator/field-config';
import { cn } from '@nexsoft-admin/utils';

type FormImageUploaderProps<T extends FieldValues> = {
  name: FieldPath<T>;
  config?: FieldConfig;
  loading?: boolean;
  className?: string;
} & Omit<ImageUploaderProps, 'onImageCropped' | 'className'>;

function FormImageUploader<T extends FieldValues>({
  name,
  config,
  loading = false,
  className,
  aspectRatio,
  maxSize,
  acceptedFileTypes,
  ...imageUploaderProps
}: FormImageUploaderProps<T>) {
  const { control } = useFormContext<T>();

  if (loading) {
    return <FormFieldSkeleton type='text' orientation={config?.orientation} />;
  }

  return (
    <FormField
      name={name}
      control={control}
      label={config?.label}
      description={config?.description}
      orientation={config?.orientation}
      disabled={config?.disabled}
      required={config?.required}
      className={className}
    >
      {({ value, onChange, onBlur, error, disabled }) => {
        const handleImageCropped = (blob: Blob) => {
          // Convert Blob to File for better form handling
          const file = new File([blob], `image-${Date.now()}.png`, {
            type: blob.type || 'image/png',
            lastModified: Date.now(),
          });
          onChange(file);
          onBlur();
        };

        // Type-safe conversion: form value can be string (URL), File, or null
        const imageValue: string | File | null | undefined =
          value === null || value === undefined
            ? null
            : typeof value === 'string' || value instanceof File
              ? value
              : null;

        return (
          <div data-slot='form-image-uploader-wrapper' className={cn('w-full', className)}>
            <ImageUploader
              value={imageValue}
              aspectRatio={aspectRatio}
              maxSize={maxSize}
              acceptedFileTypes={acceptedFileTypes}
              onImageCropped={handleImageCropped}
              className={disabled ? 'pointer-events-none opacity-50' : undefined}
              {...imageUploaderProps}
            />
            {error && (
              <p className='text-destructive mt-2 text-sm' role='alert' aria-live='polite'>
                {error}
              </p>
            )}
          </div>
        );
      }}
    </FormField>
  );
}

export { FormImageUploader };
export type { FormImageUploaderProps };

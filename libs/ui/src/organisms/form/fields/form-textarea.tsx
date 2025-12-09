'use client';

import * as React from 'react';
import { useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';
import { Textarea } from '../../../atoms/textarea/textarea';
import { FormField } from '../form-field';
import { FormFieldSkeleton } from '../form-field-skeleton';
import type { FieldConfig } from '../generator/field-config';

type FormTextareaProps<T extends FieldValues> = {
  name: FieldPath<T>;
  config?: FieldConfig;
  loading?: boolean;
  className?: string;
} & Omit<React.ComponentProps<typeof Textarea>, 'value' | 'onChange' | 'onBlur' | 'name'>;

function FormTextarea<T extends FieldValues>({
  name,
  config,
  loading = false,
  className,
  ...textareaProps
}: FormTextareaProps<T>) {
  const { control } = useFormContext<T>();

  if (loading) {
    return <FormFieldSkeleton type='textarea' orientation={config?.orientation} />;
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
      {({ value, onChange, onBlur, error, disabled }) => (
        <Textarea
          id={name}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          placeholder={config?.placeholder}
          className={className}
          {...textareaProps}
        />
      )}
    </FormField>
  );
}

export { FormTextarea };
export type { FormTextareaProps };

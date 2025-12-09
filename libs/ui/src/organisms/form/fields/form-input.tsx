'use client';

import * as React from 'react';
import { useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';
import { Input } from '../../../atoms/input/input';
import { FormField } from '../form-field';
import { FormFieldSkeleton } from '../form-field-skeleton';
import type { FieldConfig } from '../generator/field-config';

type FormInputProps<T extends FieldValues> = {
  name: FieldPath<T>;
  config?: FieldConfig;
  loading?: boolean;
  className?: string;
} & Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange' | 'onBlur' | 'name'>;

function FormInput<T extends FieldValues>({
  name,
  config,
  loading = false,
  className,
  type = 'text',
  ...inputProps
}: FormInputProps<T>) {
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
      {({ value, onChange, onBlur, error, disabled }) => (
        <Input
          id={name}
          type={type}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          placeholder={config?.placeholder}
          className={className}
          {...inputProps}
        />
      )}
    </FormField>
  );
}

export { FormInput };
export type { FormInputProps };

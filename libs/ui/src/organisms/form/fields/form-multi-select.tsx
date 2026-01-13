'use client';

import { useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';
import { MultiSelect, type MultiSelectOption } from '../../../organisms/multi-select/multi-select';
import { FormField } from '../form-field';
import { FormFieldSkeleton } from '../form-field-skeleton';
import type { FieldConfig, FieldOption } from '../generator/field-config';

type FormMultiSelectProps<T extends FieldValues> = {
  name: FieldPath<T>;
  config?: FieldConfig;
  loading?: boolean;
  className?: string;
  options?: FieldOption[];
};

function FormMultiSelect<T extends FieldValues>({
  name,
  config,
  loading = false,
  className,
  options = config?.options || [],
}: FormMultiSelectProps<T>) {
  const { control } = useFormContext<T>();

  if (loading) {
    return <FormFieldSkeleton type='select' orientation={config?.orientation} />;
  }

  // Convert FieldOption[] to MultiSelectOption[]
  const multiSelectOptions: MultiSelectOption[] = options.map((option) => ({
    label: option.label,
    value: String(option.value),
    disabled: option.disabled,
  }));

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
        // Ensure value is always an array
        const selectedValues = Array.isArray(value) ? (value as string[]) : value ? [String(value)] : [];

        const handleValueChange = (newValues: string[]) => {
          onChange(newValues);
          onBlur();
        };

        return (
          <div data-slot='form-multi-select-wrapper' className='w-full'>
            <MultiSelect
              options={multiSelectOptions}
              onValueChange={handleValueChange}
              defaultValue={selectedValues}
              placeholder={config?.placeholder || 'Select options'}
              maxCount={config?.maxCount ?? 3}
              searchable={config?.searchable ?? true}
              hideSelectAll={config?.hideSelectAll ?? false}
              singleLine={config?.singleLine ?? false}
              closeOnSelect={config?.closeOnSelect ?? false}
              disabled={disabled}
              className={disabled ? 'pointer-events-none opacity-50' : undefined}
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

export { FormMultiSelect };
export type { FormMultiSelectProps };

'use client'

import { useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import {
  NativeSelect,
  NativeSelectOption,
} from '../../../atoms/native-select/native-select'
import { FormField } from '../form-field'
import { FormFieldSkeleton } from '../form-field-skeleton'
import type { FieldConfig, FieldOption } from '../generator/field-config'

type FormNativeSelectProps<T extends FieldValues> = {
  name: FieldPath<T>
  config?: FieldConfig
  loading?: boolean
  className?: string
  options?: FieldOption[]
}

function FormNativeSelect<T extends FieldValues>({
  name,
  config,
  loading = false,
  className,
  options = config?.options || [],
}: FormNativeSelectProps<T>) {
  const { control } = useFormContext<T>()

  if (loading) {
    return <FormFieldSkeleton type="native-select" orientation={config?.orientation} />
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
        <NativeSelect
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          className={className}
        >
          {config?.placeholder && (
            <NativeSelectOption value="" disabled>
              {config.placeholder}
            </NativeSelectOption>
          )}
          {options.map((option) => (
            <NativeSelectOption
              key={String(option.value)}
              value={String(option.value)}
              disabled={option.disabled}
            >
              {option.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      )}
    </FormField>
  )
}

export { FormNativeSelect }
export type { FormNativeSelectProps }


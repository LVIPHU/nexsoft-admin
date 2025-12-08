'use client'

import { useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../organisms/select/select'
import { FormField } from '../form-field'
import { FormFieldSkeleton } from '../form-field-skeleton'
import type { FieldConfig, FieldOption } from '../generator/field-config'

type FormSelectProps<T extends FieldValues> = {
  name: FieldPath<T>
  config?: FieldConfig
  loading?: boolean
  className?: string
  options?: FieldOption[]
}

function FormSelect<T extends FieldValues>({
  name,
  config,
  loading = false,
  className,
  options = config?.options || [],
}: FormSelectProps<T>) {
  const { control } = useFormContext<T>()

  if (loading) {
    return <FormFieldSkeleton type="select" orientation={config?.orientation} />
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
        <Select
          value={value as string}
          onValueChange={(val) => onChange(val)}
          onOpenChange={(open) => {
            if (!open) onBlur()
          }}
          disabled={disabled}
        >
          <SelectTrigger
            aria-invalid={error ? 'true' : 'false'}
            className={className}
          >
            <SelectValue placeholder={config?.placeholder || 'Select an option'} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem
                key={String(option.value)}
                value={String(option.value)}
                disabled={option.disabled}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormField>
  )
}

export { FormSelect }
export type { FormSelectProps }


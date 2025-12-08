'use client'

import { useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import { RadioGroup, RadioGroupItem } from '../../../atoms/radio-group/radio-group'
import { FormField } from '../form-field'
import { FormFieldSkeleton } from '../form-field-skeleton'
import type { FieldConfig, FieldOption } from '../generator/field-config'

type FormRadioGroupProps<T extends FieldValues> = {
  name: FieldPath<T>
  config?: FieldConfig
  loading?: boolean
  className?: string
  options?: FieldOption[]
}

function FormRadioGroup<T extends FieldValues>({
  name,
  config,
  loading = false,
  className,
  options = config?.options || [],
}: FormRadioGroupProps<T>) {
  const { control } = useFormContext<T>()

  if (loading) {
    return <FormFieldSkeleton type="radio-group" orientation={config?.orientation} />
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
        <RadioGroup
          id={name}
          value={value as string}
          onValueChange={(val) => onChange(val)}
          onBlur={onBlur}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          className={className}
        >
          {options.map((option) => (
            <div key={String(option.value)} className="flex items-center gap-2">
              <RadioGroupItem
                value={String(option.value)}
                id={`${name}-${option.value}`}
                disabled={disabled || option.disabled}
              />
              <label
                htmlFor={`${name}-${option.value}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {option.label}
              </label>
            </div>
          ))}
        </RadioGroup>
      )}
    </FormField>
  )
}

export { FormRadioGroup }
export type { FormRadioGroupProps }


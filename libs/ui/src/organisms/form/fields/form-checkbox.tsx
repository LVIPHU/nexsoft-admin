'use client'

import { useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import { Checkbox } from '../../../atoms/checkbox/checkbox'
import { FormField } from '../form-field'
import { FormFieldSkeleton } from '../form-field-skeleton'
import type { FieldConfig, FieldOption } from '../generator/field-config'

type FormCheckboxProps<T extends FieldValues> = {
  name: FieldPath<T>
  config?: FieldConfig
  loading?: boolean
  className?: string
  options?: FieldOption[] // For checkbox group
}

function FormCheckbox<T extends FieldValues>({
  name,
  config,
  loading = false,
  className,
  options,
}: FormCheckboxProps<T>) {
  const { control } = useFormContext<T>()

  if (loading) {
    return <FormFieldSkeleton type="checkbox" orientation={config?.orientation} />
  }

  // Single checkbox
  if (!options || options.length === 0) {
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
          <div className="flex items-center gap-2">
            <Checkbox
              id={name}
              checked={value as boolean}
              onCheckedChange={(checked) => onChange(checked)}
              onBlur={onBlur}
              disabled={disabled}
              aria-invalid={error ? 'true' : 'false'}
              className={className}
            />
            {config?.label && (
              <label
                htmlFor={name}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {config.label}
              </label>
            )}
          </div>
        )}
      </FormField>
    )
  }

  // Checkbox group
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
        const selectedValues = (value as (string | number | boolean)[]) || []

        const handleChange = (optionValue: string | number | boolean, checked: boolean) => {
          if (checked) {
            onChange([...selectedValues, optionValue])
          } else {
            onChange(selectedValues.filter((v) => v !== optionValue))
          }
        }

        return (
          <div className="flex flex-col gap-2">
            {options.map((option) => (
              <div key={String(option.value)} className="flex items-center gap-2">
                <Checkbox
                  id={name}
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={(checked) => handleChange(option.value, checked as boolean)}
                  onBlur={onBlur}
                  disabled={disabled || option.disabled}
                  aria-invalid={error ? 'true' : 'false'}
                />
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        )
      }}
    </FormField>
  )
}

export { FormCheckbox }
export type { FormCheckboxProps }


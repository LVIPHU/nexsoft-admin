'use client'

import { useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import { Switch } from '../../../atoms/switch/switch'
import { FormField } from '../form-field'
import { FormFieldSkeleton } from '../form-field-skeleton'
import type { FieldConfig } from '../generator/field-config'

type FormSwitchProps<T extends FieldValues> = {
  name: FieldPath<T>
  config?: FieldConfig
  loading?: boolean
  className?: string
}

function FormSwitch<T extends FieldValues>({
  name,
  config,
  loading = false,
  className,
}: FormSwitchProps<T>) {
  const { control } = useFormContext<T>()

  if (loading) {
    return <FormFieldSkeleton type="switch" orientation={config?.orientation} />
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
        <div className="flex items-center gap-2">
          <Switch
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

export { FormSwitch }
export type { FormSwitchProps }


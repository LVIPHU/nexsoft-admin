'use client'

import * as React from 'react'
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import { cn } from '@nexsoft-admin/utils'
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldContent,
} from '../../molecules/field/field'
import type { FieldOrientation } from './generator/field-config'

type FormFieldProps<T extends FieldValues> = {
  name: FieldPath<T>
  control: Control<T>
  label?: string
  description?: string
  orientation?: FieldOrientation
  className?: string
  disabled?: boolean
  required?: boolean
  children: (field: {
    value: unknown
    onChange: (value: unknown) => void
    onBlur: () => void
    error?: string
    disabled?: boolean
  }) => React.ReactNode
}

function FormField<T extends FieldValues>({
  name,
  control,
  label,
  description,
  orientation = 'vertical',
  className,
  disabled,
  required,
  children,
}: FormFieldProps<T>) {
  const {
    field,
    fieldState: { error, invalid },
  } = useController({
    name,
    control,
    disabled,
  })

  const fieldProps = {
    value: field.value,
    onChange: field.onChange,
    onBlur: field.onBlur,
    error: error?.message,
    disabled: disabled || field.disabled,
  }

  return (
    <Field
      orientation={orientation}
      className={cn(className)}
      data-invalid={invalid}
      data-disabled={disabled}
    >
      {label && (
        <FieldLabel htmlFor={name}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </FieldLabel>
      )}
      <FieldContent>
        {description && <FieldDescription>{description}</FieldDescription>}
        {children(fieldProps)}
        {error && <FieldError>{error.message}</FieldError>}
      </FieldContent>
    </Field>
  )
}

export { FormField }
export type { FormFieldProps }


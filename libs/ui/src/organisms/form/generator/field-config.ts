import type { ControllerRenderProps } from 'react-hook-form'
import type { ReactNode } from 'react'

export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'select'
  | 'native-select'
  | 'checkbox'
  | 'radio-group'
  | 'switch'
  | 'date'
  | 'date-range'

export type FieldOrientation = 'horizontal' | 'vertical'

export type FieldOption = {
  label: string
  value: string | number | boolean
  disabled?: boolean
}

export type FieldConfig = {
  name: string
  type?: FieldType
  label?: string
  description?: string
  placeholder?: string
  options?: FieldOption[]
  orientation?: FieldOrientation
  cols?: 1 | 2
  disabled?: boolean
  hidden?: boolean
  required?: boolean
  className?: string
  render?: (field: ControllerRenderProps) => ReactNode
}

export type FormLayoutConfig = {
  cols?: 1 | 2
  gapCols?: string // Tailwind gap class (e.g., 'gap-4', 'gap-x-6')
  gapRows?: string // Tailwind gap class (e.g., 'gap-4', 'gap-y-6')
  defaultOrientation?: FieldOrientation
}

export type FormChangeInfo<T> = {
  changedFields: Array<{
    name: keyof T
    value: unknown
    previousValue?: unknown
  }>
  formValues: Partial<T>
  isDirty: boolean
}


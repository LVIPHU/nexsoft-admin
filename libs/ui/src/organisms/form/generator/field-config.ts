import type { ControllerRenderProps } from 'react-hook-form';
import type { ReactNode } from 'react';

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
  | 'image-uploader';

export type FieldOrientation = 'horizontal' | 'vertical';

export type FieldOption = {
  label: string;
  value: string | number | boolean;
  disabled?: boolean;
};

export type FieldConfig = {
  name: string;
  type?: FieldType;
  label?: string;
  description?: string;
  placeholder?: string;
  options?: FieldOption[];
  orientation?: FieldOrientation;
  disabled?: boolean;
  hidden?: boolean;
  required?: boolean;
  className?: string;
  render?: (field: ControllerRenderProps) => ReactNode;
  // Image uploader specific props
  aspectRatio?: number;
  maxSize?: number;
  acceptedFileTypes?: string[];
} & Record<string, unknown>;

export type FormChangeInfo<T> = {
  changedFields: Array<{
    name: keyof T;
    value: unknown;
    previousValue?: unknown;
  }>;
  formValues: Partial<T>;
  isDirty: boolean;
};

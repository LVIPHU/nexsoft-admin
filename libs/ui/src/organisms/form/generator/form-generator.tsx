'use client';

import * as React from 'react';
import { z } from 'zod';
import type { FieldPath } from 'react-hook-form';
import { FormInput } from '../fields/form-input';
import { FormTextarea } from '../fields/form-textarea';
import { FormSelect } from '../fields/form-select';
import { FormNativeSelect } from '../fields/form-native-select';
import { FormCheckbox } from '../fields/form-checkbox';
import { FormRadioGroup } from '../fields/form-radio-group';
import { FormSwitch } from '../fields/form-switch';
import type { FieldConfig } from './field-config';
import { FieldGroup } from '../../../molecules';
import { cn } from '@nexsoft-admin/utils';

// Type for Zod string validation checks
type ZodStringCheck = {
  kind?: string;
};

type FormGeneratorProps<T extends z.ZodType> = {
  schema: T;
  fieldConfigs?: FieldConfig[];
  className?: string;
  as?: React.ElementType;
} & Omit<React.ComponentPropsWithoutRef<'div'>, 'className' | 'as'> &
  Record<string, unknown>;

// Helper function to infer field type from Zod schema
function inferFieldType(schema: z.ZodTypeAny, customConfig?: FieldConfig): FieldConfig['type'] {
  // If custom type is provided, use it
  if (customConfig?.type) {
    return customConfig.type;
  }

  // Try to infer from schema
  if (schema instanceof z.ZodString) {
    const checks = schema._def.checks as ZodStringCheck[] | undefined;
    if (checks?.some((check) => check.kind === 'email')) {
      return 'email';
    }
    if (checks?.some((check) => check.kind === 'url')) {
      return 'url';
    }
    return 'text';
  }

  if (schema instanceof z.ZodNumber) {
    return 'number';
  }

  if (schema instanceof z.ZodBoolean) {
    return 'switch';
  }

  if (schema instanceof z.ZodEnum) {
    return 'select';
  }

  if (schema instanceof z.ZodArray) {
    return 'checkbox';
  }

  if (schema instanceof z.ZodDate) {
    return 'date';
  }

  // Default to text
  return 'text';
}

// Helper function to get options from enum schema
function getEnumOptions(schema: z.ZodTypeAny): Array<{ label: string; value: string }> {
  if (schema instanceof z.ZodEnum) {
    const enumDef = schema._def as unknown as { values: readonly [string, ...string[]] };
    return enumDef.values.map((value: string) => ({
      label: value,
      value,
    }));
  }
  return [];
}

function FormGenerator<T extends z.ZodType>({
  schema,
  fieldConfigs = [],
  className,
  as: Component = FieldGroup,
  ...props
}: FormGeneratorProps<T>) {
  // Get schema shape if it's an object
  const schemaShape = schema instanceof z.ZodObject ? schema.shape : {};

  // Create field configs map for quick lookup
  const configMap = new Map(fieldConfigs.map((config) => [config.name, config]));

  // Generate fields from schema
  const fields = Object.entries(schemaShape)
    .map(([fieldName, fieldSchema]) => {
      const customConfig = configMap.get(fieldName);
      const fieldType = inferFieldType(fieldSchema as z.ZodTypeAny, customConfig);
      const config: FieldConfig = {
        name: fieldName,
        type: fieldType,
        label: customConfig?.label || fieldName,
        description: customConfig?.description,
        placeholder: customConfig?.placeholder,
        options:
          customConfig?.options ||
          (fieldType === 'select' || fieldType === 'radio-group'
            ? getEnumOptions(fieldSchema as z.ZodTypeAny)
            : undefined),
        orientation: customConfig?.orientation || 'vertical',
        disabled: customConfig?.disabled,
        hidden: customConfig?.hidden,
        required: customConfig?.required,
        className: customConfig?.className,
        ...customConfig,
      };

      // Skip hidden fields
      if (config.hidden) {
        return null;
      }

      // Render appropriate field component
      const renderField = () => {
        // Type assertion needed because fieldName is dynamically generated from schema
        // At runtime, fieldName is guaranteed to be a valid field path
        const commonProps = {
          name: fieldName as unknown as FieldPath<z.infer<T> & Record<string, unknown>>,
          config,
        };

        switch (fieldType) {
          case 'textarea':
            return <FormTextarea key={fieldName} {...commonProps} />;
          case 'select':
            return <FormSelect key={fieldName} {...commonProps} />;
          case 'native-select':
            return <FormNativeSelect key={fieldName} {...commonProps} />;
          case 'checkbox':
            return <FormCheckbox key={fieldName} {...commonProps} options={config.options} />;
          case 'radio-group':
            return <FormRadioGroup key={fieldName} {...commonProps} />;
          case 'switch':
            return <FormSwitch key={fieldName} {...commonProps} />;
          case 'email':
            return <FormInput key={fieldName} {...commonProps} type='email' />;
          case 'password':
            return <FormInput key={fieldName} {...commonProps} type='password' />;
          case 'number':
            return <FormInput key={fieldName} {...commonProps} type='number' />;
          case 'tel':
            return <FormInput key={fieldName} {...commonProps} type='tel' />;
          case 'url':
            return <FormInput key={fieldName} {...commonProps} type='url' />;
          default:
            return <FormInput key={fieldName} {...commonProps} type='text' />;
        }
      };

      return renderField();
    })
    .filter(Boolean);

  return (
    <Component className={cn(className)} {...props}>
      {fields}
    </Component>
  );
}

export { FormGenerator };
export type { FormGeneratorProps };

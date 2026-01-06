'use client';

import * as React from 'react';
import { useForm, FormProvider, type UseFormProps, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@nexsoft-admin/utils';
import type { FormChangeInfo, FieldConfig } from './generator/field-config';

/**
 * Props for the Form component.
 *
 * @template T - The Zod schema type that defines the form structure
 *
 * @property {T} schema - Zod schema for form validation
 * @property {Partial<z.infer<T>>} [defaultValues] - Initial default values for form fields. All fields from schema will be initialized with empty strings if not provided.
 * @property {Partial<z.infer<T>>} [resetValues] - Values to reset the form to. When provided, form will reset to these values. Undefined values will be replaced with defaultValues or empty strings to prevent uncontrolled input warnings.
 * @property {FieldConfig[]} [fieldConfigs] - Configuration for form fields (labels, placeholders, etc.)
 * @property {(data: z.infer<T>) => void | Promise<void>} onSubmit - Callback function called when form is submitted with valid data
 * @property {boolean} [resetAfterSubmit=false] - Whether to reset form to defaultValues after successful submission
 * @property {(changeInfo: FormChangeInfo<z.infer<T>>) => void} [onFormChange] - Callback function called when form values change
 * @property {number} [onFormChangeDebounce=0] - Debounce delay in milliseconds for onFormChange callback
 * @property {string} [className] - Additional CSS classes for the form element
 * @property {React.ReactNode} [children] - Form content (typically FormGenerator component)
 */
type FormProps<T extends z.ZodType<any, any, any>> = {
  schema: T;
  defaultValues?: Partial<z.infer<T>>;
  resetValues?: Partial<z.infer<T>>;
  fieldConfigs?: FieldConfig[];
  onSubmit: (data: z.infer<T>) => void | Promise<void>;
  resetAfterSubmit?: boolean;
  onFormChange?: (changeInfo: FormChangeInfo<z.infer<T>>) => void;
  onFormChangeDebounce?: number;
  className?: string;
  children?: React.ReactNode;
} & Omit<UseFormProps<z.infer<T> & FieldValues>, 'resolver' | 'defaultValues'>;

/**
 * Form component with Zod validation and React Hook Form integration.
 *
 * This component provides a fully controlled form with automatic validation,
 * change detection, and safe handling of undefined values to prevent React
 * uncontrolled/controlled input warnings.
 *
 * @template T - The Zod schema type that defines the form structure
 *
 * @param {FormProps<T>} props - Form component props
 * @param {T} props.schema - Zod schema for validation
 * @param {Partial<z.infer<T>>} [props.defaultValues] - Initial form values
 * @param {Partial<z.infer<T>>} [props.resetValues] - Values to reset form to (typically from async data)
 * @param {FieldConfig[]} [props.fieldConfigs] - Field configurations
 * @param {(data: z.infer<T>) => void | Promise<void>} props.onSubmit - Submit handler
 * @param {boolean} [props.resetAfterSubmit=false] - Reset form after submit
 * @param {(changeInfo: FormChangeInfo<z.infer<T>>) => void} [props.onFormChange] - Change handler
 * @param {number} [props.onFormChangeDebounce=0] - Debounce delay for change handler
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} [props.children] - Form content
 *
 * @returns {JSX.Element} Form element with FormProvider context
 *
 * @example
 * ```tsx
 * const schema = z.object({
 *   username: z.string().min(3),
 *   email: z.string().email(),
 * });
 *
 * <Form
 *   schema={schema}
 *   defaultValues={{ username: '', email: '' }}
 *   resetValues={userData} // From async query
 *   onSubmit={async (data) => {
 *     await updateUser(data);
 *   }}
 * >
 *   <FormGenerator schema={schema} fieldConfigs={fieldConfigs} />
 * </Form>
 * ```
 */
function Form<T extends z.ZodType<any, any, any>>({
  schema,
  defaultValues,
  resetValues,
  fieldConfigs,
  onSubmit,
  resetAfterSubmit = false,
  onFormChange,
  onFormChangeDebounce = 0,
  className,
  children,
  ...formOptions
}: FormProps<T>) {
  /**
   * Creates safe default values for all form fields.
   *
   * This ensures:
   * - All fields from schema have default values (empty strings)
   * - No undefined values exist (prevents uncontrolled input warnings)
   * - User-provided defaultValues are merged and take precedence
   *
   * @returns {Partial<z.infer<T>>} Safe default values object with no undefined values
   */
  const safeDefaultValues = React.useMemo(() => {
    const schemaShape = schema instanceof z.ZodObject ? schema.shape : {};
    const schemaKeys = Object.keys(schemaShape);

    const baseDefaults: Record<string, unknown> = {};
    for (const key of schemaKeys) {
      baseDefaults[key] = '';
    }

    if (defaultValues) {
      Object.assign(baseDefaults, defaultValues);
    }

    return Object.fromEntries(
      Object.entries(baseDefaults).map(([key, value]) => [key, value === undefined ? '' : value]),
    ) as Partial<z.infer<T>>;
  }, [defaultValues, schema]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema) as any,
    defaultValues: safeDefaultValues as any,
    ...formOptions,
  });

  const previousValuesRef = React.useRef<Partial<z.infer<T>>>(defaultValues || {});
  const debounceTimerRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
  const isInitialMountRef = React.useRef(true);

  /**
   * Handles form change detection and calls onFormChange callback.
   *
   * Watches all form values and detects changes, then calls onFormChange
   * with information about changed fields. Supports debouncing to reduce
   * callback frequency.
   *
   * @effect
   * - Subscribes to form value changes
   * - Skips initial mount to avoid false change detection
   * - Debounces callback if onFormChangeDebounce > 0
   * - Cleans up subscription and timer on unmount
   */
  React.useEffect(() => {
    if (!onFormChange) return;

    const subscription = form.watch((currentValues, { name, type }) => {
      // Skip initial mount to avoid triggering on first render
      if (isInitialMountRef.current) {
        isInitialMountRef.current = false;
        previousValuesRef.current = (currentValues as Partial<z.infer<T>>) || {};
        return;
      }

      const previousValues = previousValuesRef.current;

      // Find changed fields
      const changedFields: FormChangeInfo<z.infer<T>>['changedFields'] = [];

      const allKeys = new Set([...Object.keys(currentValues || {}), ...Object.keys(previousValues || {})]);

      for (const key of allKeys) {
        const currentValue = currentValues?.[key as keyof typeof currentValues];
        const previousValue = previousValues?.[key as keyof typeof previousValues];

        if (currentValue !== previousValue) {
          changedFields.push({
            name: key as keyof z.infer<T>,
            value: currentValue,
            previousValue,
          });
        }
      }

      // Check if form is dirty
      const isDirty = Object.keys(form.formState.dirtyFields).length > 0;

      // Create change info
      const changeInfo: FormChangeInfo<z.infer<T>> = {
        changedFields,
        formValues: (currentValues as Partial<z.infer<T>>) || {},
        isDirty,
      };

      // Debounce callback if needed
      if (onFormChangeDebounce > 0) {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
          onFormChange(changeInfo);
        }, onFormChangeDebounce);
      } else {
        onFormChange(changeInfo);
      }

      // Update previous values
      previousValuesRef.current = (currentValues as Partial<z.infer<T>>) || {};
    });

    return () => {
      subscription.unsubscribe();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [form, onFormChange, onFormChangeDebounce]);

  /**
   * Handles form reset when resetValues prop changes.
   *
   * This effect resets the form to new values when resetValues changes
   * (typically when async data loads). It ensures:
   * - Only resets when resetValues has actual values
   * - Replaces undefined values with defaults to prevent uncontrolled input warnings
   * - Uses keepDefaultValues option to maintain form state consistency
   *
   * @effect
   * - Watches resetValues prop changes
   * - Creates safe reset values (no undefined)
   * - Resets form with keepDefaultValues: true
   *
   * @see {@link https://react-hook-form.com/docs/useform/reset} React Hook Form reset documentation
   */
  React.useEffect(() => {
    if (!resetValues || Object.keys(resetValues).length === 0) return;

    const safeResetValues = Object.fromEntries(
      Object.entries(resetValues).map(([key, value]) => {
        if (value === undefined) {
          const defaultValue = safeDefaultValues?.[key as keyof typeof safeDefaultValues];
          return [key, defaultValue !== undefined ? defaultValue : ''];
        }
        return [key, value];
      }),
    ) as z.infer<T> & FieldValues;

    form.reset(safeResetValues, { keepDefaultValues: true });
  }, [form, resetValues, safeDefaultValues]);

  /**
   * Handles form submission with validation.
   *
   * Validates form data against schema, then calls onSubmit callback.
   * If resetAfterSubmit is enabled, resets form to defaultValues after
   * successful submission (only if onSubmit doesn't throw).
   *
   * @param {z.infer<T>} data - Validated form data
   * @returns {Promise<void>} Promise that resolves after submission
   */
  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data as z.infer<T>);

    // Reset form after successful submit if enabled
    // If onSubmit throws, this won't execute
    if (resetAfterSubmit) {
      form.reset(defaultValues as z.infer<T> & FieldValues);
      previousValuesRef.current = defaultValues || {};
    }
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className={cn(className)} noValidate>
        {children}
      </form>
    </FormProvider>
  );
}

export { Form };
export type { FormProps };

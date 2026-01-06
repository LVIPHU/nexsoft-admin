'use client';

import * as React from 'react';
import { useForm, FormProvider, type UseFormProps, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { cn } from '@nexsoft-admin/utils';
import type { FormChangeInfo, FieldConfig } from './generator/field-config';

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
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema) as any,
    defaultValues: defaultValues as any,
    ...formOptions,
  });

  const previousValuesRef = React.useRef<Partial<z.infer<T>>>(defaultValues || {});
  const debounceTimerRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
  const isInitialMountRef = React.useRef(true);

  // Handle form change detection using subscription
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

  // Handle form reset value
  React.useEffect(() => {
    if (!resetValues) return;
    form.reset(resetValues as z.infer<T> & FieldValues);
  }, [form, resetValues]);

  // Handle form submit
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

'use client';

import * as React from 'react';
import { useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';
import { Input } from '../../../atoms/input/input';
import { FormField } from '../form-field';
import { FormFieldSkeleton } from '../form-field-skeleton';
import type { FieldConfig } from '../generator/field-config';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '../../../molecules';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../molecules/tooltip/tooltip';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

type FormPasswordProps<T extends FieldValues> = {
  name: FieldPath<T>;
  config?: FieldConfig;
  loading?: boolean;
  className?: string;
  textShowPassword?: string;
  textHidePassword?: string;
} & Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange' | 'onBlur' | 'name'>;

function FormPassword<T extends FieldValues>({
  name,
  config,
  loading = false,
  className,
  textHidePassword = 'Hide password',
  textShowPassword = 'Show password',
  ...inputProps
}: FormPasswordProps<T>) {
  const { control } = useFormContext<T>();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const togglePasswordVisibility = React.useCallback(() => {
    setShowPassword((prevState) => !prevState);
  }, []);

  if (loading) {
    return <FormFieldSkeleton type='text' orientation={config?.orientation} />;
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
        <InputGroup>
          <InputGroupInput
            id={name}
            type={showPassword ? 'text' : 'password'}
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            placeholder={config?.placeholder}
            className={className}
            {...inputProps}
          />
          <InputGroupAddon align='inline-end'>
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton
                  variant='ghost'
                  aria-label={showPassword ? textHidePassword : textShowPassword}
                  size='icon-xs'
                  onClick={togglePasswordVisibility}
                  type='button'
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>
                <p>{showPassword ? textHidePassword : textShowPassword}</p>
              </TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
      )}
    </FormField>
  );
}

export { FormPassword };
export type { FormPasswordProps };

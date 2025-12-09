import * as React from 'react';
import { cn } from '@nexsoft-admin/utils';
import { FieldSet, FieldLegend, FieldGroup, FieldDescription } from '../../../molecules/field/field';

type FormGroupProps = {
  legend?: string;
  legendVariant?: 'legend' | 'label';
  className?: string;
  children: React.ReactNode;
  description?: string;
};

function FormGroup({ legend, legendVariant = 'legend', className, children, description }: FormGroupProps) {
  return (
    <FieldGroup className={cn(className)}>
      <FieldSet>
        {legend && <FieldLegend variant={legendVariant}>{legend}</FieldLegend>}
        {description && <FieldDescription>{description}</FieldDescription>}
        {children}
      </FieldSet>
    </FieldGroup>
  );
}

export { FormGroup };
export type { FormGroupProps };

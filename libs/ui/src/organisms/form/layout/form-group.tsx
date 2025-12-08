import * as React from 'react'
import { cn } from '@nexsoft-admin/utils'
import { FieldSet, FieldLegend } from '../../../molecules/field/field'

type FormGroupProps = {
  legend?: string
  legendVariant?: 'legend' | 'label'
  className?: string
  children: React.ReactNode
}

function FormGroup({
  legend,
  legendVariant = 'legend',
  className,
  children,
}: FormGroupProps) {
  return (
    <FieldSet className={cn(className)}>
      {legend && <FieldLegend variant={legendVariant}>{legend}</FieldLegend>}
      {children}
    </FieldSet>
  )
}

export { FormGroup }
export type { FormGroupProps }


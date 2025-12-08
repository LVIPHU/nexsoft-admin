import * as React from 'react'
import { cn } from '@nexsoft-admin/utils'

type FormGridProps = {
  cols?: 1 | 2
  gapCols?: string
  gapRows?: string
  className?: string
  children: React.ReactNode
}

function FormGrid({
  cols = 1,
  gapCols = 'gap-x-4',
  gapRows = 'gap-y-4',
  className,
  children,
}: FormGridProps) {
  const gridCols = cols === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'

  return (
    <div
      className={cn(
        'grid w-full',
        gridCols,
        gapCols,
        gapRows,
        className
      )}
    >
      {children}
    </div>
  )
}

export { FormGrid }
export type { FormGridProps }


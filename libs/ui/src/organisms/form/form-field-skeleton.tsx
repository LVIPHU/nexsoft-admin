import { Skeleton } from '../../atoms/skeleton/skeleton'
import { cn } from '@nexsoft-admin/utils'
import type { FieldType, FieldOrientation } from './generator/field-config'

type FormFieldSkeletonProps = {
  type?: FieldType
  orientation?: FieldOrientation
  className?: string
  showLabel?: boolean
}

function FormFieldSkeleton({
  type = 'text',
  orientation = 'vertical',
  className,
  showLabel = true,
}: FormFieldSkeletonProps) {
  const getSkeletonHeight = () => {
    switch (type) {
      case 'textarea':
        return 'h-24'
      case 'select':
      case 'native-select':
        return 'h-9'
      case 'checkbox':
      case 'switch':
        return 'h-4'
      default:
        return 'h-9'
    }
  }

  return (
    <div
      className={cn(
        'flex w-full gap-3',
        orientation === 'vertical' ? 'flex-col' : 'flex-row items-center',
        className
      )}
    >
      {showLabel && (
        <Skeleton className={cn('h-4 w-24', orientation === 'horizontal' && 'flex-auto')} />
      )}
      <div className={cn('flex-1', orientation === 'horizontal' && 'flex-auto')}>
        <Skeleton className={cn(getSkeletonHeight(), 'w-full')} />
      </div>
    </div>
  )
}

export { FormFieldSkeleton }
export type { FormFieldSkeletonProps }


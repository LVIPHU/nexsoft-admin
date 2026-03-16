import { Badge } from '@nexsoft-admin/ui/badge';

function ContentTypeBadge({ type }: { type: string }) {
  return (
    <Badge variant='outline' className='font-normal'>
      {type}
    </Badge>
  );
}

function ViolationStatusBadge({ status }: { status: string }) {
  const variants: Record<string, { label: string; className: string }> = {
    PENDING: {
      label: 'Pending',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    BYPASS: {
      label: 'Approved',
      className: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400',
    },
    BAN: { label: 'Banned', className: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400' },
  };

  const { label, className } = variants[status] ?? { label: status, className: '' };

  return (
    <Badge variant='outline' className={className}>
      {label}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const variants: Record<string, { label: string; className: string }> = {
    VERY_HIGH: {
      label: 'Very High',
      className: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400',
    },
    HIGH: {
      label: 'High',
      className: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400',
    },
    MEDIUM: {
      label: 'Medium',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    LOW: {
      label: 'Low',
      className: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
    },
  };

  const { label, className } = variants[priority] ?? { label: priority, className: '' };

  return (
    <Badge variant='outline' className={className}>
      {label}
    </Badge>
  );
}

function ReportCountBadge({ count }: { count: number }) {
  const className =
    count >= 10
      ? 'bg-red-500 text-white border-red-600'
      : count >= 5
        ? 'bg-orange-400 text-white border-orange-500'
        : 'bg-zinc-200 text-zinc-700 border-zinc-300 dark:bg-zinc-700 dark:text-zinc-200';

  return (
    <Badge variant='outline' className={className}>
      {count}
    </Badge>
  );
}

export { ContentTypeBadge, ViolationStatusBadge, PriorityBadge, ReportCountBadge };

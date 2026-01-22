import { cn, formatNumber } from '@nexsoft-admin/utils';
import { IconsMap } from '@/icons/map';
import { Icon } from '@/components/Icon';

interface SectionCardProps {
  title: string;
  value: number;
  description?: string;
  icon?: keyof typeof IconsMap;
  addonEnd?: React.ReactNode;
  addonStart?: React.ReactNode;
  classNameIcon?: string;
}

function SectionCard({ title, value, description, icon, addonStart, addonEnd, classNameIcon }: SectionCardProps) {
  return (
    <div data-slot='card' className='flex items-center gap-4 p-6'>
      {icon && <Icon name={icon} className={cn('size-14', classNameIcon)} />}
      <div className='flex flex-col gap-4'>
        <p className='truncate text-sm font-medium uppercase'>{title}</p>
        <p className='truncate text-2xl font-semibold'>
          {addonStart}
          {formatNumber(value)}
          {addonEnd}
        </p>
        {description && <p className='text-xs font-medium text-zinc-400'>description</p>}
      </div>
    </div>
  );
}

export { SectionCard };

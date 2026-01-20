import { Avatar, AvatarFallback, AvatarImage } from '@nexsoft-admin/ui';
import { formatNumber } from '@nexsoft-admin/utils';

interface SectionCardProps {
  title: string;
  value: number;
  description?: string;
  logo?: string;
  addonEnd?: React.ReactNode;
  addonStart?: React.ReactNode;
}

function SectionCard({ title, value, description, logo, addonStart, addonEnd }: SectionCardProps) {
  return (
    <div className='flex items-center gap-4'>
      {logo && (
        <Avatar className='size-14'>
          <AvatarImage src={logo} alt={title} />
          <AvatarFallback>{title}</AvatarFallback>
        </Avatar>
      )}
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

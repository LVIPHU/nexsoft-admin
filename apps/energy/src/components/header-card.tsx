import { Icon } from '@/components/Icon';
import { IconsMap } from '@/icons/map';
import { Tooltip, TooltipContent, TooltipTrigger } from '@nexsoft-admin/ui/tooltip';
import { CircleQuestionMarkIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/date-range-picker';

interface HeaderCardProps {
  title: string;
  icon?: keyof typeof IconsMap;
  tooltip?: React.ReactNode;
  selectedDateRanger?: DateRange;
  onSelectDateRanger?: (range: DateRange | undefined) => void;
}

function HeaderCard({ title, icon, tooltip, selectedDateRanger, onSelectDateRanger }: HeaderCardProps) {
  return (
    <div className='flex justify-between'>
      <div className='flex items-center gap-3'>
        {icon && (
          <div className='flex size-12 items-center justify-center rounded-md bg-white dark:bg-black'>
            <Icon name={icon} className='size-8' />
          </div>
        )}
        <p className='truncate text-lg font-semibold'>{title}</p>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger>
              <CircleQuestionMarkIcon className='size-4' />
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        )}
      </div>
      {selectedDateRanger && onSelectDateRanger && (
        <DateRangePicker selected={selectedDateRanger} onSelect={onSelectDateRanger} />
      )}
    </div>
  );
}

export { HeaderCard };

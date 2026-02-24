import { Popover, PopoverTrigger, PopoverContent } from '@nexsoft-admin/ui/popover';
import { Button } from '@nexsoft-admin/ui/button';
import { Calendar } from '@nexsoft-admin/ui/calendar';
import { ChevronsUpDownIcon, FunnelIcon } from 'lucide-react';
import { type DateRange } from 'react-day-picker';
import * as React from 'react';
import dayjs from 'dayjs';

interface DateRangePickerProps {
  selected?: DateRange;
  defaultSelected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
  /** Max selectable date (default: end of yesterday - API requires date earlier than today) */
  maxDate?: Date;
}

function DateRangePicker({
  defaultSelected = { from: new Date(), to: new Date() },
  selected,
  onSelect,
  maxDate: maxDateProp,
}: DateRangePickerProps) {
  const maxDate = maxDateProp ?? dayjs().subtract(1, 'day').endOf('day').toDate();
  const [range, setRange] = React.useState<DateRange | undefined>(defaultSelected);

  function handleSelect(nextRange: DateRange | undefined) {
    setRange(nextRange);
    onSelect?.(nextRange);
  }

  const displayRange = selected ?? range;

  return (
    <div className='w-full max-w-3xs space-y-2'>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='outline' id='dates' className='w-full justify-between font-normal'>
            <div className='flex items-center gap-1'>
              <FunnelIcon />
              {displayRange?.from && displayRange?.to
                ? `${dayjs(displayRange.from).format('MMM D, YYYY')} - ${dayjs(displayRange.to).format('MMM D, YYYY')}`
                : 'Pick a date'}
            </div>
            <ChevronsUpDownIcon />
          </Button>
        </PopoverTrigger>

        <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
          <Calendar
            mode='range'
            captionLayout='dropdown'
            selected={displayRange}
            onSelect={handleSelect}
            disabled={{ after: maxDate }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export { DateRangePicker };

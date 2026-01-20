import { SectionCard } from '@/pages/admin/_components/section-card';
import { DateRangePicker } from '@/components/date-range-picker';

function DashboardPage() {
  return (
    <div>
      <DateRangePicker />
      <SectionCard
        title={'TOTAL TOKEN VALUE RECEIVED'}
        value={2023874.11}
        description={'sadasdasd'}
        logo={'https://github.com/shadcn.png'}
        addonStart={'$'}
      />
    </div>
  );
}

export { DashboardPage };

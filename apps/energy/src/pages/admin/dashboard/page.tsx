import { SectionCard } from '@/components/section-card';
import { DateRangePicker } from '@/components/date-range-picker';
import { HeaderCard } from '@/components/header-card';

function DashboardPage() {
  return (
    <div>
      <DateRangePicker />
      <SectionCard
        title={'TOTAL TOKEN VALUE RECEIVED'}
        value={2023874.11}
        description={'sadasdasd'}
        icon='PieChartRadiant'
        addonStart={'$'}
      />
      <HeaderCard title={'Overall Statistics'} icon={'PieChartRadiant'} tooltip={'tooltip'} />
    </div>
  );
}

export { DashboardPage };

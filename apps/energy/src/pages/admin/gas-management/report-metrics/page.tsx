import { ResourceSummary } from './_components/resource-summary';
import { OverallStatistics } from './_components/overall-statistics';
import { ProfitOverview } from './_components/profit-overview';
import { Statistics } from '@/pages/admin/gas-management/report-metrics/_components/statistics';
import { TopPerformers } from '@/pages/admin/gas-management/report-metrics/_components/top-performers';

function ReportMetricsPage() {
  return (
    <div className='grid grid-cols-1 gap-4 @5xl/main:grid-cols-3'>
      <OverallStatistics />
      <ResourceSummary className={'@5xl/main:col-span-2'} />
      <ProfitOverview />
      <Statistics className={'@5xl/main:col-span-2'} />
      <TopPerformers className={'@5xl/main:col-span-3'} />
    </div>
  );
}

export { ReportMetricsPage };

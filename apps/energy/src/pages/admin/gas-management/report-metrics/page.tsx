import { ResourceSummary } from './_components/resource-summary';
import { OverallStatistics } from './_components/overall-statistics';
import { ProfitOverview } from './_components/profit-overview';
import { Statistics } from '@/pages/admin/gas-management/report-metrics/_components/statistics';

function ReportMetricsPage() {
  return (
    <div className='grid grid-cols-1 gap-4 @5xl/main:grid-cols-3'>
      <OverallStatistics />
      <ResourceSummary className={'@5xl/main:col-span-2'} />
      <ProfitOverview />
      <Statistics className={'@5xl/main:col-span-2'} />
    </div>
  );
}

export { ReportMetricsPage };

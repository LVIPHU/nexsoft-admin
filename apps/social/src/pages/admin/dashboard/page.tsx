import { SectionCards } from './_components/section-cards';
import { ChartAreaInteractive } from './_components/chart-area-interactive';

function DashboardPage() {
  return (
    <div className='@container/main flex flex-col gap-4 md:gap-6'>
      <SectionCards />
      <ChartAreaInteractive />
      {/*<DataTable data={data} />*/}
    </div>
  );
}

export { DashboardPage };

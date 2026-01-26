import { Overview } from './_components/overview';
import { ActivityHistory } from './_components/activity-history';

function ActivityHistoryPage() {
  return (
    <div className='grid gap-4'>
      <Overview />
      <ActivityHistory />
    </div>
  );
}

export { ActivityHistoryPage };

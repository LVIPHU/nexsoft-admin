import { StatsOverview } from './_components/stats-overview';
import { ContentModerationTabs } from './_components/content-moderation-tabs';

function ContentModerationPage() {
  return (
    <div className='grid gap-4'>
      <StatsOverview />
      <ContentModerationTabs />
    </div>
  );
}

export { ContentModerationPage };

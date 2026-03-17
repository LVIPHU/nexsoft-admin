import { Card, CardHeader, CardContent, CardTitle } from '@nexsoft-admin/ui/card';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import { formatNumber } from '@nexsoft-admin/utils';

interface QuickStatsCardProps {
  metrics?: Record<string, number>;
}

function QuickStatsCard({ metrics }: QuickStatsCardProps) {
  if (!metrics || Object.keys(metrics).length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>{i18n._(msg`Quick Stats`)}</CardTitle>
      </CardHeader>
      <CardContent className='grid grid-cols-3 gap-x-4 gap-y-3'>
        {Object.entries(metrics).map(([key, value]) => (
          <div key={key} className='flex flex-col gap-0.5'>
            <p className='text-muted-foreground truncate text-xs capitalize'>{key.replace(/_/g, ' ')}</p>
            <p className='text-sm font-semibold'>{formatNumber(value)}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export { QuickStatsCard };

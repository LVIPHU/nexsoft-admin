import { Badge } from '@nexsoft-admin/ui/badge';
import { Card, CardHeader, CardContent, CardTitle } from '@nexsoft-admin/ui/card';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import type { ViolationFullDto } from '@nexsoft-admin/models';
import { ViolationStatusBadge, PriorityBadge, ReportCountBadge } from '../../_components/violation-badges';

interface ViolationInfoCardProps {
  violation: ViolationFullDto;
}

function ViolationInfoCard({ violation }: ViolationInfoCardProps) {
  const typeSummary = (violation.total_by_violation_type ?? []).filter((v) => v.total > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>{i18n._(msg`Report Summary`)}</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-3'>
        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground text-sm'>{i18n._(msg`Status`)}</span>
          <ViolationStatusBadge status={violation.violation_status} />
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground text-sm'>{i18n._(msg`Priority`)}</span>
          <PriorityBadge priority={violation.priority} />
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-muted-foreground text-sm'>{i18n._(msg`Reports`)}</span>
          <ReportCountBadge count={violation.number_of_violations} />
        </div>
        {typeSummary.length > 0 && (
          <div className='border-t pt-3'>
            <p className='text-muted-foreground mb-2 text-xs uppercase'>{i18n._(msg`Violation Types`)}</p>
            <div className='flex flex-col gap-1'>
              {typeSummary.map((v) => (
                <div key={v.violation_type} className='flex items-center justify-between'>
                  <span className='text-sm'>{v.violation_type.replace(/_/g, ' ')}</span>
                  <Badge variant='secondary'>{v.total}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { ViolationInfoCard };

import { Badge } from '@nexsoft-admin/ui/badge';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@nexsoft-admin/ui/card';
import { AlertTriangle } from 'lucide-react';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import type { ViolationFullDto } from '@nexsoft-admin/models';
import { VIOLATION_TOPIC } from '@/constants/violation.constant';

const VIOLATION_LABELS: Record<string, string> = {
  [VIOLATION_TOPIC.HATE_SPEECH_OR_DISCRIMINATION]: 'Hate Speech',
  [VIOLATION_TOPIC.HARASSMENT_OR_BULLYING]: 'Abuse & Harassment',
  [VIOLATION_TOPIC.VIOLENCE_OR_HARMFUL_CONTENT]: 'Violent Speech',
  [VIOLATION_TOPIC.SPAM_OR_SCAM]: 'Spam or Scam',
  [VIOLATION_TOPIC.NUDITY_OR_SEXUAL_CONTENT]: 'Nudity / Sexual Content',
};

const VIOLATION_DESCRIPTIONS: Record<string, string> = {
  [VIOLATION_TOPIC.HATE_SPEECH_OR_DISCRIMINATION]: 'Slurs, stereotypes, dehumanization, hateful symbols or topics',
  [VIOLATION_TOPIC.HARASSMENT_OR_BULLYING]: 'Insults, unwanted harassment, or coordinated harassment campaigns',
  [VIOLATION_TOPIC.VIOLENCE_OR_HARMFUL_CONTENT]: 'Explicit threats, calls for harm, or glorification of violence',
  [VIOLATION_TOPIC.SPAM_OR_SCAM]: 'Repetitive content, fake accounts, or deceptive links',
  [VIOLATION_TOPIC.NUDITY_OR_SEXUAL_CONTENT]: 'Explicit or implicit sexual content, nudity',
};

interface ViolationInfoCardProps {
  violation: ViolationFullDto;
}

function ViolationInfoCard({ violation }: ViolationInfoCardProps) {
  const typeSummary = [...(violation.total_by_violation_type ?? [])]
    .filter((v) => v.total > 0)
    .sort((a, b) => b.total - a.total);

  const highest = typeSummary[0] ?? null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>{i18n._(msg`Report Summary`)}</CardTitle>
        <CardDescription>
          {i18n._(msg`Total`)} {violation.number_of_violations} {i18n._(msg`reports`)}
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-3'>
        {highest && (
          <div className='flex items-center gap-2 rounded-md border border-orange-200 bg-orange-50/50 px-3 py-2 dark:border-orange-800 dark:bg-orange-950/30'>
            <AlertTriangle className='size-3.5 shrink-0 text-orange-500' />
            <div className='min-w-0 flex-1'>
              <p className='text-xs font-medium text-orange-700 dark:text-orange-300'>
                {i18n._(msg`Highest report type`)}
              </p>
              <p className='truncate text-xs text-orange-600 dark:text-orange-400'>
                {VIOLATION_LABELS[highest.violation_type] ?? highest.violation_type.replace(/_/g, ' ')}
              </p>
            </div>
            <span className='shrink-0 text-sm font-bold text-orange-700 dark:text-orange-300'>{highest.total}</span>
          </div>
        )}

        {typeSummary.length > 0 && (
          <div className='flex flex-col gap-2'>
            {typeSummary.map((v) => {
              const isHighSeverity = v.total > 5;
              const containerClass = isHighSeverity
                ? 'border border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-50'
                : 'border border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50';
              const badgeClass = isHighSeverity
                ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
              const label = VIOLATION_LABELS[v.violation_type] ?? v.violation_type.replace(/_/g, ' ');
              const description = VIOLATION_DESCRIPTIONS[v.violation_type];
              return (
                <div key={v.violation_type} className={`rounded-md px-3 py-2 ${containerClass}`}>
                  <div className='flex items-center justify-between gap-2'>
                    <p className='text-sm font-medium'>{label}</p>
                    <Badge className={`shrink-0 border-0 text-xs ${badgeClass}`}>{v.total}</Badge>
                  </div>
                  {description && <p className='mt-0.5 text-xs opacity-75'>{description}</p>}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { ViolationInfoCard };

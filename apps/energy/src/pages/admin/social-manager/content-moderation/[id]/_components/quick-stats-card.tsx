import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@nexsoft-admin/ui/card';
import { Eye, Heart, MessageCircle, Flag, Quote, Bookmark, Share2, BarChart2 } from 'lucide-react';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import { formatNumber } from '@nexsoft-admin/utils';
import type { LucideIcon } from 'lucide-react';

const METRIC_ICONS: Record<string, LucideIcon> = {
  views: Eye,
  likes: Heart,
  replies: MessageCircle,
  reports: Flag,
  quotes: Quote,
  bookmarks: Bookmark,
  shares: Share2,
};

const METRIC_LABELS: Record<string, string> = {
  views: 'Views',
  likes: 'Likes',
  replies: 'Replies',
  reports: 'Reports',
  quotes: 'Quotes',
  bookmarks: 'Bookmarks',
  shares: 'Shares',
};

interface QuickStatsCardProps {
  metrics?: Record<string, number>;
}

function QuickStatsCard({ metrics }: QuickStatsCardProps) {
  if (!metrics || Object.keys(metrics).length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>{i18n._(msg`Quick Stats`)}</CardTitle>
        <CardDescription>{i18n._(msg`Recent engagement snapshot`)}</CardDescription>
      </CardHeader>
      <CardContent className='grid grid-cols-3 gap-x-4 gap-y-4'>
        {Object.entries(metrics).map(([key, value]) => {
          const Icon = METRIC_ICONS[key] ?? BarChart2;
          const label = METRIC_LABELS[key] ?? key.replace(/_/g, ' ');
          return (
            <div key={key} className='flex flex-col gap-1'>
              <div className='flex items-center gap-1.5'>
                <Icon className='text-muted-foreground size-3.5' />
                <span className='text-muted-foreground truncate text-xs capitalize'>{label}</span>
              </div>
              <p className='text-base font-semibold tabular-nums'>{formatNumber(value)}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export { QuickStatsCard };

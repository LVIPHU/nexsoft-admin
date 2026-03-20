import { Badge } from '@nexsoft-admin/ui/badge';
import { Card, CardHeader, CardContent } from '@nexsoft-admin/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@nexsoft-admin/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@nexsoft-admin/ui/carousel';
import { AlertTriangle } from 'lucide-react';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import type { ViolationFullDto, ViolationDetailContentDto, ViolationUserDto } from '@nexsoft-admin/models';
import { ViolationStatusBadge } from '../../_components/violation-badges';

interface ContentCardProps {
  violation: ViolationFullDto;
  content?: ViolationDetailContentDto;
  user?: ViolationUserDto;
}

function formatDate(iso?: string) {
  if (!iso) return null;
  return new Date(iso).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getHighestViolationType(violation: ViolationFullDto): string | null {
  const types = violation.total_by_violation_type ?? [];
  if (types.length === 0) return null;
  const sorted = [...types].sort((a, b) => b.total - a.total);
  return sorted[0].violation_type.replace(/_/g, ' & ').replace(/Or/g, 'or');
}

function ContentCard({ violation, content, user }: ContentCardProps) {
  const hashtags = violation.hashtags ?? content?.hashtags ?? [];
  const files = (content?.files ?? []).filter((f) => f.mime_type?.startsWith('image') && f.name);
  const createdAt = formatDate(violation.content_created_at ?? content?.created_at);
  const updatedAt = formatDate(violation.content_updated_at ?? content?.updated_at);
  const highestType = getHighestViolationType(violation);

  return (
    <Card className='h-full'>
      <CardHeader className='gap-3 pb-3'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex items-center gap-3'>
            <Avatar className='size-10 shrink-0'>
              <AvatarImage src={user?.thumbnail_url ?? undefined} alt={user?.name} />
              <AvatarFallback>{(user?.name ?? 'U').charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className='text-sm leading-tight font-semibold'>{user?.name ?? i18n._(msg`Unknown`)}</p>
              <p className='text-muted-foreground text-xs'>@{user?.username ?? '—'}</p>
            </div>
          </div>
          <ViolationStatusBadge status={violation.violation_status} />
        </div>

        <div className='flex flex-wrap gap-x-4 gap-y-1 text-xs'>
          {createdAt && (
            <span className='text-muted-foreground'>
              <span className='text-foreground font-medium'>{i18n._(msg`Created`)}: </span>
              {createdAt}
            </span>
          )}
          {updatedAt && (
            <span className='text-muted-foreground'>
              <span className='text-foreground font-medium'>{i18n._(msg`Updated`)}: </span>
              {updatedAt}
            </span>
          )}
        </div>

        {highestType && (
          <div className='flex items-center gap-1.5 text-xs'>
            <AlertTriangle className='size-3.5 text-orange-500' />
            <span className='text-muted-foreground'>{i18n._(msg`Highest report type`)}:</span>
            <span className='font-medium text-orange-600 dark:text-orange-400'>{highestType}</span>
          </div>
        )}

        {hashtags.length > 0 && (
          <div className='flex flex-wrap gap-1'>
            <Badge variant='outline' className='text-xs'>
              {i18n._(msg`All`)}
            </Badge>
            {hashtags.map((tag) => (
              <Badge key={tag} variant='outline' className='text-xs'>
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className='flex flex-col gap-4'>
        <p className='text-sm leading-relaxed whitespace-pre-wrap'>{violation.content}</p>

        {files.length > 0 && (
          <div className='relative'>
            <Carousel className='w-full'>
              <CarouselContent>
                {files.map((file, idx) => (
                  <CarouselItem key={idx}>
                    <img src={file.name} alt={`media-${idx}`} className='max-h-72 w-full rounded-lg object-cover' />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {files.length > 1 && (
                <>
                  <CarouselPrevious className='left-2' />
                  <CarouselNext className='right-2' />
                </>
              )}
            </Carousel>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { ContentCard };

import { Badge } from '@nexsoft-admin/ui/badge';
import { Card, CardHeader, CardContent, CardTitle } from '@nexsoft-admin/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@nexsoft-admin/ui/avatar';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import type { ViolationFullDto, ViolationDetailContentDto, ViolationUserDto } from '@nexsoft-admin/models';
import { ContentTypeBadge, ViolationStatusBadge } from '../../_components/violation-badges';

interface ContentCardProps {
  violation: ViolationFullDto;
  content?: ViolationDetailContentDto;
  user?: ViolationUserDto;
}

function ContentCard({ violation, content, user }: ContentCardProps) {
  const hashtags = violation.hashtags ?? content?.hashtags ?? [];
  const files = (content?.files ?? []).filter((f) => f.mime_type?.startsWith('image') && f.name);
  const createdAt = violation.content_created_at ?? content?.created_at;

  return (
    <Card>
      <CardHeader>
        <div className='flex items-start justify-between gap-2'>
          <div className='flex items-center gap-2'>
            <ContentTypeBadge type={violation.content_type} />
            <CardTitle className='text-base'>{i18n._(msg`Content`)}</CardTitle>
          </div>
          {violation.violation_status === 'PENDING' && (
            <ViolationStatusBadge status={violation.violation_status} />
          )}
        </div>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        {user && (
          <div className='flex items-center gap-3'>
            <Avatar className='size-9'>
              <AvatarImage src={user.thumbnail_url ?? undefined} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className='text-sm font-medium leading-none'>{user.name}</p>
              <p className='text-muted-foreground text-xs'>@{user.username}</p>
            </div>
            {createdAt && (
              <p className='text-muted-foreground ml-auto text-xs'>
                {new Date(createdAt).toLocaleString()}
              </p>
            )}
          </div>
        )}

        <p className='text-sm leading-relaxed whitespace-pre-wrap'>{violation.content}</p>

        {files.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {files.map((file, idx) => (
              <img
                key={idx}
                src={file.name}
                alt={file.name}
                className='max-h-56 rounded-lg object-cover'
              />
            ))}
          </div>
        )}

        {hashtags.length > 0 && (
          <div className='flex flex-wrap gap-1'>
            {hashtags.map((tag) => (
              <Badge key={tag} variant='secondary'>
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { ContentCard };

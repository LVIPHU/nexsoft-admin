import { Button } from '@nexsoft-admin/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@nexsoft-admin/ui/card';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';

interface ViolationActionsCardProps {
  onBan: () => void;
  onBypass: () => void;
  banning: boolean;
  bypassing: boolean;
  pendingAction: 'ban' | 'bypass' | null;
}

function ViolationActionsCard({ onBan, onBypass, banning, bypassing, pendingAction }: ViolationActionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>{i18n._(msg`Actions`)}</CardTitle>
        <CardDescription>{i18n._(msg`Take action on this content`)}</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
        <Button
          variant='outline'
          className='w-full border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700'
          onClick={onBypass}
          disabled={banning || bypassing}
        >
          {pendingAction === 'bypass' ? i18n._(msg`Approving...`) : i18n._(msg`Approve (Not a violation)`)}
        </Button>
        <Button
          variant='outline'
          className='w-full border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700'
          onClick={onBan}
          disabled={banning || bypassing}
        >
          {pendingAction === 'ban' ? i18n._(msg`Banning...`) : i18n._(msg`Ban (Confirm violation)`)}
        </Button>
      </CardContent>
    </Card>
  );
}

export { ViolationActionsCard };

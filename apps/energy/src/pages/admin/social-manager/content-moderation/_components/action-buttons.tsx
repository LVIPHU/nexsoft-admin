import { useState } from 'react';
import { useNavigate } from 'react-router';
import { EyeIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { Button } from '@nexsoft-admin/ui/button';
import { useBanContent, useBypassContent } from '@/services/content-moderation';
import { VIOLATION_STATUS } from '@/constants/violation.constant';
interface ActionButtonsProps {
  id: number;
  status: string;
}

function ActionButtons({ id, status }: ActionButtonsProps) {
  const navigate = useNavigate();
  const { banContent, loading: banning } = useBanContent();
  const { bypassContent, loading: bypassing } = useBypassContent();
  const [pendingAction, setPendingAction] = useState<'ban' | 'bypass' | null>(null);

  const handleBan = async () => {
    setPendingAction('ban');
    try {
      await banContent(id);
    } finally {
      setPendingAction(null);
    }
  };

  const handleBypass = async () => {
    setPendingAction('bypass');
    try {
      await bypassContent(id);
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <div className='flex items-center gap-1'>
      <Button
        variant='ghost'
        size='icon'
        className='size-8'
        onClick={() => navigate(`/social-manager/content-moderation/${id}`)}
      >
        <EyeIcon className='size-4' />
        <span className='sr-only'>View</span>
      </Button>
      {status === VIOLATION_STATUS.PENDING && (
        <>
          <Button
            variant='ghost'
            size='icon'
            className='size-8 text-green-600 hover:text-green-700'
            onClick={handleBypass}
            disabled={banning || bypassing}
          >
            <CheckCircleIcon className='size-4' />
            <span className='sr-only'>Approve</span>
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className='size-8 text-red-600 hover:text-red-700'
            onClick={handleBan}
            disabled={banning || bypassing}
          >
            <XCircleIcon className='size-4' />
            <span className='sr-only'>Ban</span>
          </Button>
        </>
      )}
    </div>
  );
}

export { ActionButtons };

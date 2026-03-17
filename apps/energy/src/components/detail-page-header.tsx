import { useNavigate } from 'react-router';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@nexsoft-admin/ui/button';

interface DetailPageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

function DetailPageHeader({ title, subtitle, onBack }: DetailPageHeaderProps) {
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate(-1));

  return (
    <div className='flex items-center gap-3'>
      <Button variant='ghost' size='icon' onClick={handleBack}>
        <ArrowLeftIcon className='size-4' />
      </Button>
      <div>
        <h1 className='text-xl font-semibold'>{title}</h1>
        {subtitle && <p className='text-muted-foreground text-sm'>{subtitle}</p>}
      </div>
    </div>
  );
}

export { DetailPageHeader };

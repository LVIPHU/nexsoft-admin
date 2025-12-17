import { cn } from '@nexsoft-admin/utils';

type Props = {
  size?: number;
  className?: string;
};

const Logo = ({ size = 32, className }: Props) => {
  return <img src={'/logo.svg'} width={size} height={size} alt='TBChat' className={cn('rounded-sm', className)} />;
};

export { Logo };

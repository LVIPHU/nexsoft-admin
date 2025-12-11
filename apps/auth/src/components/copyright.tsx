import { cn } from '@nexsoft-admin/utils';

type Props = {
  className?: string;
};

function Copyright({ className }: Props) {
  const currentYear = new Date().getFullYear();
  const version = process.env.version ?? '1.0.0';

  return (
    <p className={cn('flex items-center justify-center text-xs opacity-40', className)}>
      TBC Admin v{version} © {currentYear} • Nexsoft
    </p>
  );
}

export { Copyright };

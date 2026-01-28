import { cn } from '@nexsoft-admin/utils';

export function LightRaysBackground({ className }: { className?: string }) {
  return (
    <div
      className={cn([
        'absolute inset-0',
        'bg-cover bg-center',
        'bg-[url("/light-rays.svg")]',
        className,
      ])}
    />
  )
}

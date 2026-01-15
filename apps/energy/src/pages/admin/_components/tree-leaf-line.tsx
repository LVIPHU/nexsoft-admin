import { cn } from '@nexsoft-admin/utils';

interface TreeLeafLineProps {
  isLast?: boolean;
}

function TreeLeafLine({ isLast }: TreeLeafLineProps) {
  return (
    <span
      className={cn(
        'relative w-10 flex-none self-stretch text-center select-none',
        'before:pointer-events-none before:absolute before:top-0 before:left-0 before:size-10',
      )}
    >
      <span
        className={cn(
          'relative z-10 block h-full w-full',
          "before:absolute before:-start-px before:end-4.5 before:top-0 before:-bottom-1 before:border-e-2 before:border-gray-500 before:content-['']",
          "after:absolute after:h-5 after:w-4 after:rounded-bl-md after:border-s-2 after:border-b-2 after:border-gray-500 after:content-['']",
          isLast && 'before:-top-1.5 before:h-5',
        )}
      />
    </span>
  );
}

export { TreeLeafLine };

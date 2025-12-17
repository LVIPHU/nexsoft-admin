import { motion } from 'framer-motion';
import { cn } from '@nexsoft-admin/utils';

interface ActiveIndicatorProps {
  className?: string;
}

export default function ActiveIndicator({ className }: ActiveIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn('bg-primary shadow-info size-1.5 animate-pulse rounded-full shadow-[0_0_12px]', className)}
    />
  );
}

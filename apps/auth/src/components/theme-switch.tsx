'use client';
import { msg } from '@lingui/macro';
import { CloudSunIcon, MoonIcon, SunIcon } from 'lucide-react';
import { Button } from '@nexsoft-admin/ui';
import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useLingui } from '@lingui/react';
import { useTheme } from 'next-themes';

type Props = {
  size?: number;
  className?: string;
};

export const ThemeSwitch = ({ size = 20, className }: Props) => {
  const { i18n } = useLingui();
  const { theme, setTheme } = useTheme();

  const toggleTheme = {
    light: 'dark',
    system: 'light',
    dark: 'system',
  };

  const validThemes = ['light', 'dark', 'system'] as const;
  const currentTheme = validThemes.includes(theme as (typeof validThemes)[number])
    ? (theme as (typeof validThemes)[number])
    : 'light';

  const variants: Variants = useMemo(() => {
    return {
      light: { x: 0 },
      system: { x: size * -1 },
      dark: { x: size * -2 },
    };
  }, [size]);

  return (
    <Button
      size='icon'
      variant='ghost'
      className={className}
      aria-label={i18n._(msg`Change Theme`)}
      onClick={() => setTheme(toggleTheme[currentTheme])}
    >
      <div className='overflow-hidden' style={{ width: size, height: size }}>
        <motion.div animate={theme} variants={variants} className='flex gap-1 pt-0.5 pl-0.5'>
          <SunIcon size={size} className='shrink-0' aria-label={i18n._(msg`Switch to Light Mode`)} />
          <CloudSunIcon size={size} className='shrink-0' aria-label={i18n._(msg`Use System Theme`)} />
          <MoonIcon size={size} className='shrink-0' aria-label={i18n._(msg`Switch to Dark Mode`)} />
        </motion.div>
      </div>
    </Button>
  );
};

import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

import { DEFAULT_THEME } from '@/constants/app.constant';
import { useMediaQuery, useLocalStorage } from '@nexsoft-admin/hooks';

const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

type Theme = 'light' | 'system' | 'dark';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: Dispatch<SetStateAction<Theme>>;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = 'theme',
  ...props
}: ThemeProviderProps) {
  const isDarkOS = useMediaQuery(COLOR_SCHEME_QUERY);
  const [isDarkMode, setDarkMode] = useState<boolean>(isDarkOS);
  const [theme, setTheme] = useLocalStorage<Theme>(storageKey, defaultTheme);

  useLayoutEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('disable-transitions');
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      root.classList.add(isDarkOS ? 'dark' : 'light');
    } else {
      root.classList.add(theme);
    }
    requestAnimationFrame(() => {
      root.classList.remove('disable-transitions');
    });
  }, [theme, isDarkOS]);

  useEffect(() => {
    switch (theme) {
      case 'light': {
        setDarkMode(false);
        break;
      }
      case 'system': {
        setDarkMode(isDarkOS);
        break;
      }
      case 'dark': {
        setDarkMode(true);
        break;
      }
    }
  }, [theme, isDarkOS]);

  function toggleTheme() {
    const toggleDict: Record<Theme, Theme> = {
      light: 'system',
      system: 'dark',
      dark: 'light',
    };

    setTheme((prevMode) => toggleDict[prevMode]);
  }

  const value = {
    theme,
    setTheme,
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

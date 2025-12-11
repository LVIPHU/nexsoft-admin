/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/libs/ui',
  plugins: [
    react(),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(import.meta.dirname, 'tsconfig.lib.json'),
    }),
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
  // Configuration for building your library.
  // See: https://vite.dev/guide/build.html#library-mode
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      // Multiple entry points - each component is a separate entry
      entry: {
        // Main export (backward compatibility)
        index: 'src/index.ts',
        // Atoms (22 components)
        alert: 'src/atoms/alert/index.ts',
        'aspect-ratio': 'src/atoms/aspect-ratio/index.ts',
        avatar: 'src/atoms/avatar/index.ts',
        badge: 'src/atoms/badge/index.ts',
        button: 'src/atoms/button/index.ts',
        checkbox: 'src/atoms/checkbox/index.ts',
        empty: 'src/atoms/empty/index.ts',
        flex: 'src/atoms/flex/index.ts',
        grid: 'src/atoms/grid/index.ts',
        input: 'src/atoms/input/index.ts',
        kbd: 'src/atoms/kbd/index.ts',
        label: 'src/atoms/label/index.ts',
        'native-select': 'src/atoms/native-select/index.ts',
        progress: 'src/atoms/progress/index.ts',
        'radio-group': 'src/atoms/radio-group/index.ts',
        separator: 'src/atoms/separator/index.ts',
        skeleton: 'src/atoms/skeleton/index.ts',
        slider: 'src/atoms/slider/index.ts',
        spinner: 'src/atoms/spinner/index.ts',
        switch: 'src/atoms/switch/index.ts',
        textarea: 'src/atoms/textarea/index.ts',
        toggle: 'src/atoms/toggle/index.ts',
        // Molecules (8 components)
        'alert-dialog': 'src/molecules/alert-dialog/index.ts',
        breadcrumb: 'src/molecules/breadcrumb/index.ts',
        'button-group': 'src/molecules/button-group/index.ts',
        field: 'src/molecules/field/index.ts',
        'input-group': 'src/molecules/input-group/index.ts',
        item: 'src/molecules/item/index.ts',
        pagination: 'src/molecules/pagination/index.ts',
        'toggle-group': 'src/molecules/toggle-group/index.ts',
        // Organisms (24 components)
        accordion: 'src/organisms/accordion/index.ts',
        calendar: 'src/organisms/calendar/index.ts',
        card: 'src/organisms/card/index.ts',
        carousel: 'src/organisms/carousel/index.ts',
        chart: 'src/organisms/chart/index.ts',
        collapsible: 'src/organisms/collapsible/index.ts',
        command: 'src/organisms/command/index.ts',
        'context-menu': 'src/organisms/context-menu/index.ts',
        dialog: 'src/organisms/dialog/index.ts',
        drawer: 'src/organisms/drawer/index.ts',
        'dropdown-menu': 'src/organisms/dropdown-menu/index.ts',
        'input-otp': 'src/organisms/input-otp/index.ts',
        menubar: 'src/organisms/menubar/index.ts',
        'navigation-menu': 'src/organisms/navigation-menu/index.ts',
        popover: 'src/organisms/popover/index.ts',
        resizable: 'src/organisms/resizable/index.ts',
        'scroll-area': 'src/organisms/scroll-area/index.ts',
        select: 'src/organisms/select/index.ts',
        sheet: 'src/organisms/sheet/index.ts',
        sidebar: 'src/organisms/sidebar/index.ts',
        sonner: 'src/organisms/sonner/index.ts',
        table: 'src/organisms/table/index.ts',
        tabs: 'src/organisms/tabs/index.ts',
        tooltip: 'src/organisms/tooltip/index.ts',
        form: 'src/organisms/form/index.ts',
      },
      formats: ['es' as const],
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: [
        'react',
        'react-dom',
        'react-hook-form',
        'react/jsx-runtime',
        /^@hookform\/resolvers/,
        // Radix UI packages
        /^@radix-ui\/.*/,
        // Heavy dependencies
        'recharts',
        'lucide-react',
        'cmdk',
        'embla-carousel-react',
        'framer-motion',
        'react-day-picker',
        'react-resizable-panels',
        'sonner',
        'vaul',
        'zod',
        'input-otp',
        'date-fns',
        'next-themes',
        // Utility packages (should be externalized)
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
        // Utils from workspace
        '@nexsoft-admin/utils',
        '@nexsoft-admin/hooks',
      ],
    },
  },
  test: {
    name: 'ui',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}));

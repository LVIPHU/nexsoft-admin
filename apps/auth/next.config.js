//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');
const { version } = require('./package.json');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
  // Configure Turbopack to handle .po files
  // Note: SWC plugin is disabled due to compatibility issues
  env: {
    version: version,
  },
  turbopack: {
    rules: {
      '*.po': {
        loaders: ['@lingui/loader'],
        as: '*.js',
      },
    },
  },
  webpack: (config) => {
    // Add Lingui loader for .po files (fallback for webpack mode)
    config.module.rules.push({
      test: /\.po$/,
      use: {
        loader: '@lingui/loader',
      },
    });

    return config;
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);

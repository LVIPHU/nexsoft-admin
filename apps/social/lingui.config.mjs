import baseConfig from '../../lingui.config.mjs'

/** @type {import('@lingui/conf').LinguiConfig} */
export default {
  ...baseConfig,
  catalogs: [
    {
      path: 'src/locales/{locale}/messages',
      include: ['src/'],
    },
  ],
}



import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('@lingui/conf').LinguiConfig} */
export default {
  format: 'po',
  sourceLocale: 'en',
  fallbackLocales: { default: 'en' },
  locales: ['en', 'vi', 'zh-Hans', 'zh-Hant'],
  catalogs: [
    {
      path: path.join(__dirname, 'src/locales/{locale}/messages'),
      include: [path.join(__dirname, 'src')],
    },
  ],
}



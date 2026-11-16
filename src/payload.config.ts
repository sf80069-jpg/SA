import path from 'path'
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { es as adminLanguage } from '@payloadcms/translations/languages/es'
import { fileURLToPath } from 'url'
import { Admins } from './collections/Admins'
import { Media } from './collections/Media'
import { Folders } from './collections/Folders'
import { Tags } from './collections/Tags'
import { Users } from './collections/Users'
import { Publications } from './collections/Publications'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Admins.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  db: sqliteAdapter({
    client: {
      url: 'file:./payload.db',
    },
    transactionOptions: {},
  }),
  i18n: {
    fallbackLanguage: 'es',
    supportedLanguages: { es: adminLanguage },
  },
  collections: [Admins, Users, Publications, Media, Folders, Tags],
  secret: process.env.PAYLOAD_SECRET || 'local-dev-secret-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  localization: {
    locales: [{ code: 'en', label: 'English' }],
    fallback: true,
    defaultLocale: 'en',
  },
  plugins: [mcpPlugin({})],
})

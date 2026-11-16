import config from '@payload-config'
import { cookies } from 'next/headers'
import { getPayload } from 'payload'

const APP_SESSION_COOKIE = 'app-session'

export function createAppAuth(appUserCollection: 'users') {
  const setSession = async (token: string) => {
    const cookieStore = await cookies()
    cookieStore.set(APP_SESSION_COOKIE, token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 14,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
  }

  return {
    async currentUser() {
      const token = (await cookies()).get(APP_SESSION_COOKIE)?.value
      if (!token) return null

      const payload = await getPayload({ config })
      const authHeaders = new Headers({ Authorization: `JWT ${token}` })
      const { user } = await payload.auth({ headers: authHeaders })
      if (!user || user.collection !== appUserCollection) return null
      return user
    },

    async login(email: string, password: string) {
      const payload = await getPayload({ config })
      const result = await payload.login({
        collection: appUserCollection,
        overrideAccess: false,
        data: { email, password },
      })
      if (!result.token || !result.user) throw new Error('INVALID_CREDENTIALS')
      await setSession(result.token)
      return result.user
    },

    async logout() {
      (await cookies()).delete(APP_SESSION_COOKIE)
    },

    setSession,
  }
}

export const appAuth = createAppAuth('users')

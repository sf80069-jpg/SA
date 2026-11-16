import SearchAnimalClient from '@/components/SearchAnimalClient'

export const dynamic = 'force-static'

export function generateStaticParams() {
  return [
    'inicio',
    'login',
    'kyc',
    'register',
    'register-institution',
    'lost',
    'found',
    'about',
    'support',
    'location',
    'profile',
    'shelter-dashboard',
    'publication/luna',
    'publication/copo',
    'publication/max',
    'shelter/amigos-del-alma',
  ].map((route) => ({ path: route.split('/') }))
}

export default function FrontendRoutePage() {
  return <SearchAnimalClient />
}

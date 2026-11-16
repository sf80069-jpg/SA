'use client'

import dynamic from 'next/dynamic'

const SearchAnimalApp = dynamic(() => import('@/legacy/App'), {
  loading: () => (
    <div className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground">
      Cargando Search Animal…
    </div>
  ),
  ssr: false,
})

export default function SearchAnimalClient() {
  return <SearchAnimalApp />
}

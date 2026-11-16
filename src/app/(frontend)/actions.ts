'use server'

import { cookies } from 'next/headers'
import { promises as fs } from 'node:fs'
import path from 'node:path'

type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string> }

type UserRecord = {
  id: string
  email: string
  password: string
  username: string
  avatar: string
  role?: 'user' | 'institution'
  institutionName?: string
  address?: string
  phone?: string
}

type PublicationRecord = {
  id: string
  ownerId: string
  createdAt: string
  type: 'lost' | 'found'
  name: string
  species: string
  breed?: string
  size: string
  gender?: string
  characteristics?: string
  comments?: string
  hiddenClue?: string
  radius: number
  zoneName?: string
  locationX?: number
  locationY?: number
  photo?: string
  status: 'active'
}

type Store = {
  users: UserRecord[]
  publications: PublicationRecord[]
}

type PublicationInput = {
  type: 'lost' | 'found'
  name?: string
  species: string
  breed?: string
  size: string
  gender?: string
  characteristics?: string
  comments?: string
  hiddenClue?: string
  radius: number
  zoneName?: string
  locationX?: number
  locationY?: number
  photo?: string
}

const SESSION_COOKIE = 'app-session'
const avatars = ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🐨', '🦁', '🐯', '🐮', '🐸', '🐺'] as const
const filePath = path.join(process.cwd(), 'data', 'app-store.json')

const cleanText = (value: unknown, maxLength: number) =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : ''

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const normalizeImageDataUrl = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined

  const trimmed = value.trim()
  if (!trimmed.startsWith('data:image/')) return undefined
  if (trimmed.length > 2_000_000) return undefined

  return trimmed
}

const ensureStore = async (): Promise<Store> => {
  await fs.mkdir(path.dirname(filePath), { recursive: true })

  try {
    const content = await fs.readFile(filePath, 'utf8')
    const parsed = JSON.parse(content) as Partial<Store>
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      publications: Array.isArray(parsed.publications) ? parsed.publications : [],
    }
  } catch {
    const defaultStore: Store = { users: [], publications: [] }
    await fs.writeFile(filePath, JSON.stringify(defaultStore, null, 2), 'utf8')
    return defaultStore
  }
}

const saveStore = async (store: Store) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(store, null, 2), 'utf8')
}

const setSessionCookie = async (userId: string) => {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 14,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
}

const getCurrentUser = async (): Promise<UserRecord | null> => {
  const cookieStore = await cookies()
  const userId = cookieStore.get(SESSION_COOKIE)?.value
  if (!userId) return null

  const store = await ensureStore()
  return store.users.find((user) => user.id === userId) ?? null
}

export async function getSessionAction() {
  const user = await getCurrentUser()
  if (!user) return null

  return {
    avatar: user.avatar,
    email: user.email,
    id: user.id,
    institutionName: user.institutionName,
    role: user.role ?? 'user',
    username: user.username,
  }
}

export async function loginAction(input: {
  email: string
  password: string
}): Promise<ActionResult<Awaited<ReturnType<typeof getSessionAction>>>> {
  const email = cleanText(input.email, 200).toLowerCase()
  const password = typeof input.password === 'string' ? input.password : ''

  if (!emailPattern.test(email) || !password) {
    return { ok: false, error: 'Ingresá un correo y una contraseña válidos.' }
  }

  const store = await ensureStore()
  const user = store.users.find(
    (entry) => entry.email.toLowerCase() === email && entry.password === password,
  )

  if (!user) {
    return { ok: false, error: 'El correo o la contraseña no son correctos.' }
  }

  await setSessionCookie(user.id)
  return {
    ok: true,
    data: {
      avatar: user.avatar,
      email: user.email,
      id: user.id,
      institutionName: user.institutionName,
      role: user.role ?? 'user',
      username: user.username,
    },
  }
}

export async function registerAction(input: {
  avatar: string
  email: string
  password: string
  username: string
}): Promise<ActionResult<Awaited<ReturnType<typeof getSessionAction>>>> {
  const email = cleanText(input.email, 200).toLowerCase()
  const username = cleanText(input.username, 40)
  const password = typeof input.password === 'string' ? input.password : ''
  const avatar = avatars.includes(input.avatar as (typeof avatars)[number])
    ? (input.avatar as (typeof avatars)[number])
    : '🐶'

  const fieldErrors: Record<string, string> = {}

  if (!emailPattern.test(email)) fieldErrors.email = 'Ingresá un correo válido.'
  if (username.length < 3) fieldErrors.username = 'Usá al menos 3 caracteres.'
  if (password.length < 8) fieldErrors.password = 'Usá al menos 8 caracteres.'
  if (Object.keys(fieldErrors).length) {
    return { ok: false, error: 'Revisá los datos indicados.', fieldErrors }
  }

  const store = await ensureStore()
  const exists = store.users.some(
    (user) => user.email.toLowerCase() === email || user.username.toLowerCase() === username.toLowerCase(),
  )

  if (exists) {
    return { ok: false, error: 'Ya existe un usuario con ese correo o nombre.' }
  }

  const user: UserRecord = {
    avatar,
    email,
    id: crypto.randomUUID(),
    password,
    role: 'user',
    username,
  }

  store.users.push(user)
  await saveStore(store)
  await setSessionCookie(user.id)

  return {
    ok: true,
    data: {
      avatar: user.avatar,
      email: user.email,
      id: user.id,
      institutionName: user.institutionName,
      role: user.role ?? 'user',
      username: user.username,
    },
  }
}

export async function registerInstitutionAction(input: {
  institutionName: string
  address: string
  phone: string
  email: string
  password: string
}): Promise<ActionResult<Awaited<ReturnType<typeof getSessionAction>>>> {
  const institutionName = cleanText(input.institutionName, 80)
  const address = cleanText(input.address, 150)
  const phone = cleanText(input.phone, 40)
  const email = cleanText(input.email, 200).toLowerCase()
  const password = typeof input.password === 'string' ? input.password : ''

  const fieldErrors: Record<string, string> = {}

  if (institutionName.length < 3) fieldErrors.institutionName = 'Ingresá el nombre del refugio.'
  if (address.length < 5) fieldErrors.address = 'Ingresá una dirección válida.'
  if (phone.length < 7) fieldErrors.phone = 'Ingresá un teléfono válido.'
  if (!emailPattern.test(email)) fieldErrors.email = 'Ingresá un correo válido.'
  if (password.length < 8) fieldErrors.password = 'Usá al menos 8 caracteres.'

  if (Object.keys(fieldErrors).length) {
    return { ok: false, error: 'Revisá los datos del refugio.', fieldErrors }
  }

  const store = await ensureStore()
  const normalizedUsername = institutionName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .join('-') || 'refugio-institucional'

  const exists = store.users.some(
    (user) => user.email.toLowerCase() === email || user.username.toLowerCase() === normalizedUsername.toLowerCase(),
  )

  if (exists) {
    return { ok: false, error: 'Ya existe una institución con ese correo o nombre.' }
  }

  const user: UserRecord = {
    address,
    avatar: '🏠',
    email,
    id: crypto.randomUUID(),
    institutionName,
    password,
    phone,
    role: 'institution',
    username: normalizedUsername,
  }

  store.users.push(user)
  await saveStore(store)
  await setSessionCookie(user.id)

  return {
    ok: true,
    data: {
      avatar: user.avatar,
      email: user.email,
      id: user.id,
      institutionName: user.institutionName,
      role: user.role ?? 'user',
      username: user.username,
    },
  }
}

export async function logoutAction(): Promise<ActionResult> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  return { ok: true, data: undefined }
}

export async function createPublicationAction(
  input: PublicationInput,
): Promise<ActionResult<{ id: string }>> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'Iniciá sesión para publicar tu búsqueda.' }

  const type = input.type === 'found' ? 'found' : 'lost'
  const species = cleanText(input.species, 60)
  const size = cleanText(input.size, 60)
  const name = cleanText(input.name, 80) || (type === 'found' ? 'Sin nombre' : '')
  const radius = Number(input.radius)
  const zoneName = cleanText(input.zoneName, 120) || 'Zona sin especificar'
  const locationX = Number(input.locationX)
  const locationY = Number(input.locationY)
  const photo = normalizeImageDataUrl(input.photo)
  const fieldErrors: Record<string, string> = {}

  if (!name) fieldErrors.name = 'Ingresá el nombre de la mascota.'
  if (!species) fieldErrors.species = 'Seleccioná una especie.'
  if (!size) fieldErrors.size = 'Seleccioná un tamaño.'
  if (!Number.isFinite(radius) || radius < 1 || radius > 20) {
    fieldErrors.radius = 'El radio debe estar entre 1 y 20 km.'
  }
  if (!Number.isFinite(locationX) || !Number.isFinite(locationY)) {
    fieldErrors.location = 'Seleccioná una ubicación en el mapa.'
  }
  if (Object.keys(fieldErrors).length) {
    return { ok: false, error: 'Revisá los campos obligatorios.', fieldErrors }
  }

  const store = await ensureStore()
  const publication: PublicationRecord = {
    breed: cleanText(input.breed, 80) || undefined,
    characteristics: cleanText(input.characteristics, 1000) || undefined,
    comments: cleanText(input.comments, 1000) || undefined,
    createdAt: new Date().toISOString(),
    gender: cleanText(input.gender, 30) || undefined,
    hiddenClue: cleanText(input.hiddenClue, 300) || undefined,
    id: crypto.randomUUID(),
    locationX: Math.min(100, Math.max(0, Number(locationX || 50))),
    locationY: Math.min(100, Math.max(0, Number(locationY || 50))),
    name,
    ownerId: user.id,
    photo,
    radius,
    size,
    species,
    status: 'active',
    type,
    zoneName,
  }

  store.publications.push(publication)
  await saveStore(store)

  return { ok: true, data: { id: publication.id } }
}

export async function updatePublicationAction(
  publicationId: string,
  input: PublicationInput,
): Promise<ActionResult<{ id: string }>> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, error: 'Iniciá sesión para editar tu publicación.' }

  const store = await ensureStore()
  const publication = store.publications.find(
    (entry) => entry.id === publicationId && entry.ownerId === user.id,
  )

  if (!publication) {
    return { ok: false, error: 'No encontré la publicación para editar.' }
  }

  const type = input.type === 'found' ? 'found' : 'lost'
  const species = cleanText(input.species, 60)
  const size = cleanText(input.size, 60)
  const name = cleanText(input.name, 80) || (type === 'found' ? 'Sin nombre' : '')
  const radius = Number(input.radius)
  const zoneName = cleanText(input.zoneName, 120) || 'Zona sin especificar'
  const locationX = Number(input.locationX)
  const locationY = Number(input.locationY)
  const photo = normalizeImageDataUrl(input.photo) ?? publication.photo

  if (!name) return { ok: false, error: 'Ingresá el nombre de la mascota.' }
  if (!species) return { ok: false, error: 'Seleccioná una especie.' }
  if (!size) return { ok: false, error: 'Seleccioná un tamaño.' }
  if (!Number.isFinite(radius) || radius < 1 || radius > 20) {
    return { ok: false, error: 'El radio debe estar entre 1 y 20 km.' }
  }
  if (!Number.isFinite(locationX) || !Number.isFinite(locationY)) {
    return { ok: false, error: 'Seleccioná una ubicación en el mapa.' }
  }

  publication.breed = cleanText(input.breed, 80) || undefined
  publication.characteristics = cleanText(input.characteristics, 1000) || undefined
  publication.comments = cleanText(input.comments, 1000) || undefined
  publication.gender = cleanText(input.gender, 30) || undefined
  publication.hiddenClue = cleanText(input.hiddenClue, 300) || undefined
  publication.locationX = Math.min(100, Math.max(0, Number(locationX || 50)))
  publication.locationY = Math.min(100, Math.max(0, Number(locationY || 50)))
  publication.name = name
  publication.photo = photo
  publication.radius = radius
  publication.size = size
  publication.species = species
  publication.type = type
  publication.zoneName = zoneName

  await saveStore(store)

  return { ok: true, data: { id: publication.id } }
}

export async function getMyPublicationsAction() {
  const user = await getCurrentUser()
  if (!user) return { ok: false as const, error: 'Iniciá sesión para ver tu actividad.' }

  const store = await ensureStore()
  const data = store.publications
    .filter((publication) => publication.ownerId === user.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((publication) => ({
      createdAt: publication.createdAt,
      id: publication.id,
      locationX: publication.locationX,
      locationY: publication.locationY,
      name: publication.name,
      photo: publication.photo,
      species: publication.species,
      status: publication.status,
      type: publication.type,
      zoneName: publication.zoneName,
    }))

  return { ok: true as const, data }
}

export async function getRecentPublicationsAction() {
  const store = await ensureStore()
  const data = store.publications
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6)
    .map((publication) => ({
      createdAt: publication.createdAt,
      id: publication.id,
      locationX: publication.locationX,
      locationY: publication.locationY,
      name: publication.name,
      ownerId: publication.ownerId,
      photo: publication.photo,
      species: publication.species,
      status: publication.status,
      type: publication.type,
      zoneName: publication.zoneName,
    }))

  return { ok: true as const, data }
}

export async function getMapPublicationsAction() {
  const store = await ensureStore()
  const data = store.publications
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .filter((publication) => {
      const zoneName = publication.zoneName?.trim() ?? ''
      return (
        zoneName.length > 0 &&
        zoneName.toLowerCase() !== 'zona sin especificar' &&
        zoneName.toLowerCase() !== 'zona no especificada'
      )
    })
    .map((publication) => ({
      breed: publication.breed,
      createdAt: publication.createdAt,
      gender: publication.gender,
      id: publication.id,
      locationX: publication.locationX ?? 50,
      locationY: publication.locationY ?? 50,
      name: publication.name,
      photo: publication.photo,
      size: publication.size,
      species: publication.species,
      type: publication.type,
      zoneName: publication.zoneName || 'Zona no especificada',
    }))

  return { ok: true as const, data }
}

export async function getPublicationByIdAction(publicationId: string) {
  const store = await ensureStore()
  const publication = store.publications.find((entry) => entry.id === publicationId)

  if (!publication) {
    return { ok: false as const, error: 'No encontramos esa publicación.' }
  }

  const owner = store.users.find((user) => user.id === publication.ownerId)

  return {
    ok: true as const,
    data: {
      breed: publication.breed || 'No especificada',
      characteristics: publication.characteristics || 'Sin detalles adicionales.',
      contact: owner?.username || 'Contacto',
      createdAt: publication.createdAt,
      description: publication.characteristics || publication.comments || 'Sin detalles adicionales.',
      gender: publication.gender || 'No especificado',
      id: publication.id,
      img: publication.photo || '',
      locationX: publication.locationX ?? 0,
      locationY: publication.locationY ?? 0,
      name: publication.name,
      ownerId: publication.ownerId,
      photo: publication.photo,
      radius: publication.radius,
      size: publication.size || 'No especificado',
      species: publication.species,
      type: publication.type,
      zoneName: publication.zoneName || 'Zona no especificada',
    },
  }
}

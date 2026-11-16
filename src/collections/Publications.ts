import type { Access, CollectionBeforeValidateHook, CollectionConfig, FieldAccess } from 'payload'

const isAdmin = (user: { collection?: string } | null | undefined) =>
  user?.collection === 'admins'

const isAppUser = (user: { collection?: string } | null | undefined) =>
  user?.collection === 'users'

const ownerID = (owner: unknown) => {
  if (typeof owner === 'string' || typeof owner === 'number') return String(owner)
  if (owner && typeof owner === 'object' && 'id' in owner) {
    return String((owner as { id: string | number }).id)
  }
  return null
}

const ownPublications: Access = ({ req }) => {
  if (isAdmin(req.user)) return true
  const user = req.user
  if (!isAppUser(user) || !user) return false
  return { owner: { equals: user.id } }
}

const ownPrivateField: FieldAccess = ({ req, doc }) =>
  isAdmin(req.user) ||
  (isAppUser(req.user) && ownerID(doc?.owner) === String(req.user?.id))

const assignOwner: CollectionBeforeValidateHook = ({ data, operation, req }) => {
  if (operation === 'create' && isAppUser(req.user)) {
    return { ...data, owner: req.user?.id }
  }
  return data
}

export const Publications: CollectionConfig = {
  slug: 'publications',
  admin: {
    group: 'Search Animal',
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'species', 'status', 'createdAt'],
  },
  access: {
    create: ({ req }) => isAdmin(req.user) || isAppUser(req.user),
    delete: ownPublications,
    read: ownPublications,
    update: ownPublications,
  },
  hooks: {
    beforeValidate: [assignOwner],
  },
  fields: [
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      access: {
        create: ({ req }) => isAdmin(req.user) || isAppUser(req.user),
        update: ({ req }) => isAdmin(req.user),
      },
      admin: { position: 'sidebar' },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Perdido', value: 'lost' },
        { label: 'Encontrado', value: 'found' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'name', type: 'text', required: true },
    { name: 'species', type: 'text', required: true },
    { name: 'breed', type: 'text' },
    { name: 'size', type: 'text', required: true },
    { name: 'gender', type: 'text' },
    { name: 'characteristics', type: 'textarea' },
    { name: 'comments', type: 'textarea' },
    {
      name: 'locationLabel',
      type: 'text',
      defaultValue: 'Buenos Aires, Argentina',
    },
    {
      name: 'radius',
      type: 'number',
      required: true,
      min: 1,
      max: 20,
    },
    {
      name: 'hiddenClue',
      type: 'text',
      access: {
        read: ownPrivateField,
        update: ownPrivateField,
      },
      admin: {
        description: 'Dato privado para verificar al posible dueño. Nunca se muestra públicamente.',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      required: true,
      options: [
        { label: 'Activo', value: 'active' },
        { label: 'Resuelto', value: 'resolved' },
      ],
      access: {
        create: ({ req }) => isAdmin(req.user),
      },
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
  versions: false,
}

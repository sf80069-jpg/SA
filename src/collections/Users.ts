import type { Access, CollectionConfig } from 'payload'

const isAppUser = (user: { collection?: string } | null | undefined) =>
  user?.collection === 'users'

const ownProfile: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  const user = req.user
  if (!isAppUser(user) || !user) return false
  return { id: { equals: user.id } }
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: {
    create: () => true,
    delete: () => false,
    read: ownProfile,
    update: ownProfile,
  },
  admin: {
    hidden: true,
    useAsTitle: 'username',
  },
  fields: [
    {
      name: 'username',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'avatar',
      type: 'select',
      defaultValue: '🐶',
      options: ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🐨', '🦁', '🐯', '🐮', '🐸', '🐺'],
    },
  ],
  versions: false,
}

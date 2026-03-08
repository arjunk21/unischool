export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const { handlers } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({ where: { email: credentials.email as string } })
        if (!user?.passwordHash) return null
        const ok = await bcrypt.compare(credentials.password as string, user.passwordHash)
        if (!ok) return null
        return { id: user.id, email: user.email, name: user.name, role: user.role }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = user.id; token.role = (user as any).role }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id   = token.id
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
})

export const { GET, POST } = handlers

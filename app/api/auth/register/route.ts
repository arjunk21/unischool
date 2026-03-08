export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const Schema = z.object({
  name:     z.string().min(2),
  email:    z.string().email(),
  password: z.string().min(8),
  phone:    z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const data = Schema.parse(await req.json())
    const exists = await db.user.findUnique({ where: { email: data.email } })
    if (exists) return NextResponse.json({ error: 'Email already registered' }, { status: 409 })

    const passwordHash = await bcrypt.hash(data.password, 12)
    await db.user.create({ data: { name: data.name, email: data.email, phone: data.phone, passwordHash } })
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.errors }, { status: 400 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

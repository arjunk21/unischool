import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { emailClaimReceived } from '@/lib/email'
import { z } from 'zod'

const Schema = z.object({
  schoolId:      z.string().min(1),
  representName: z.string().min(2),
  designation:   z.string().min(2),
  officialEmail: z.string().email(),
  phone:         z.string().min(10),
  message:       z.string().max(500).optional(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Login required' }, { status: 401 })

  try {
    const body = await req.json()
    const data = Schema.parse(body)

    const school = await db.school.findUnique({ where: { id: data.schoolId }, select: { name: true, isClaimed: true } })
    if (!school) return NextResponse.json({ error: 'School not found' }, { status: 404 })
    if (school.isClaimed) return NextResponse.json({ error: 'This school profile is already claimed' }, { status: 409 })

    const existing = await db.claimRequest.findFirst({
      where: { schoolId: data.schoolId, status: 'PENDING' },
    })
    if (existing) return NextResponse.json({ error: 'A claim request for this school is already pending' }, { status: 409 })

    await db.claimRequest.create({
      data: { ...data, userId: (session.user as any).id },
    })

    emailClaimReceived({ toEmail: data.officialEmail, name: data.representName, schoolName: school.name }).catch(console.error)

    return NextResponse.json({ success: true })
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.errors }, { status: 400 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

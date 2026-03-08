export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'PLATFORM_ADMIN')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { claimId, schoolId, userId, action } = await req.json()

  if (action === 'approve') {
    await db.$transaction([
      db.claimRequest.update({ where: { id: claimId }, data: { status: 'APPROVED' } }),
      db.school.update({ where: { id: schoolId }, data: { isClaimed: true, isVerified: true } }),
      db.user.update({ where: { id: userId }, data: { role: 'SCHOOL_ADMIN' } }),
      db.schoolAdmin.upsert({
        where: { userId },
        update: { schoolId },
        create: { userId, schoolId },
      }),
    ])
  } else {
    await db.claimRequest.update({ where: { id: claimId }, data: { status: 'REJECTED' } })
  }

  return NextResponse.json({ success: true })
}

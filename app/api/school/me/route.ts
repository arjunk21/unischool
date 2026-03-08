import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = await db.schoolAdmin.findUnique({
    where: { userId: (session.user as any).id },
    include: { school: true },
  })
  if (!admin) return NextResponse.json({ error: 'Not a school admin' }, { status: 403 })
  return NextResponse.json(admin.school)
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = await db.schoolAdmin.findUnique({
    where: { userId: (session.user as any).id },
  })
  if (!admin) return NextResponse.json({ error: 'Not a school admin' }, { status: 403 })

  const body = await req.json()

  // Only allow updating safe fields
  const allowed = ['name','description','phone','email','website','feeMin','feeMax','established','medium','gradesFrom','gradesTo','hasLibrary','hasScienceLab','hasComputerLab','hasSports','hasTransport','hasHostel','hasCanteen','hasMedical','hasCCTV','hasSmartClass']
  const data: any = {}
  for (const k of allowed) {
    if (body[k] !== undefined) data[k] = body[k]
  }

  const school = await db.school.update({ where: { id: admin.schoolId }, data })
  return NextResponse.json(school)
}

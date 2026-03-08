import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const s        = req.nextUrl.searchParams
  const q        = s.get('q')       || ''
  const city     = s.get('city')    || ''
  const state    = s.get('state')   || ''
  const board    = s.get('board')   || ''
  const type     = s.get('type')    || ''
  const hostel   = s.get('hostel')  === 'true'
  const verified = s.get('verified') === 'true'
  const sort     = s.get('sort')    || 'name'
  const page     = Math.max(1, parseInt(s.get('page') || '1'))
  const take     = 12

  const where: any = { isActive: true }

  if (q) where.OR = [
    { name:     { contains: q, mode: 'insensitive' } },
    { locality: { contains: q, mode: 'insensitive' } },
    { city:     { contains: q, mode: 'insensitive' } },
    { address:  { contains: q, mode: 'insensitive' } },
  ]
  if (city)     where.city  = { contains: city,  mode: 'insensitive' }
  if (state)    where.state = { contains: state, mode: 'insensitive' }
  if (board)    where.boards    = { has: board }
  if (type)     where.type      = type
  if (hostel)   where.hasHostel = true
  if (verified) where.isVerified = true

  const orderBy: any =
    sort === 'newest'   ? { createdAt: 'desc' } :
    sort === 'fee_asc'  ? { feeMin: 'asc'  }    :
    sort === 'fee_desc' ? { feeMax: 'desc' }     :
    { name: 'asc' }

  const [data, total] = await Promise.all([
    db.school.findMany({
      where, orderBy, skip: (page - 1) * take, take,
      select: {
        id: true, slug: true, name: true, city: true, state: true,
        type: true, boards: true, isClaimed: true, isVerified: true,
        feeMin: true, feeMax: true, logoUrl: true, coverUrl: true,
        hasHostel: true, hasTransport: true, isFeatured: true,
      },
    }),
    db.school.count({ where }),
  ])

  return NextResponse.json({ data, total, page, totalPages: Math.ceil(total / take) })
}

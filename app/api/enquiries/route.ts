export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { emailEnquiryToSchool, emailEnquiryConfirm } from '@/lib/email'
import { z } from 'zod'

const Schema = z.object({
  schoolId:    z.string().min(1),
  parentName:  z.string().min(2),
  parentEmail: z.string().email(),
  parentPhone: z.string().optional(),
  studentName: z.string().min(2),
  grade:       z.string().min(1),
  session:     z.string().min(1),
  message:     z.string().max(1000).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const data = Schema.parse(await req.json())
    const school = await db.school.findUnique({
      where: { id: data.schoolId },
      select: { name: true, email: true, isActive: true },
    })
    if (!school?.isActive) return NextResponse.json({ error: 'School not found' }, { status: 404 })

    const enquiry = await db.enquiry.create({ data })

    // fire and forget emails
    const jobs = [emailEnquiryConfirm({ parentEmail: data.parentEmail, parentName: data.parentName, schoolName: school.name })]
    if (school.email) jobs.push(emailEnquiryToSchool({ schoolEmail: school.email, schoolName: school.name, parentName: data.parentName, parentEmail: data.parentEmail, parentPhone: data.parentPhone, studentName: data.studentName, grade: data.grade, message: data.message }))
    Promise.all(jobs)
      .then(() => db.enquiry.update({ where: { id: enquiry.id }, data: { emailedAt: new Date() } }))
      .catch(console.error)

    return NextResponse.json({ success: true })
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.errors }, { status: 400 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

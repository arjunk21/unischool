export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { emailEnquiryToSchool, emailEnquiryConfirmToParent } from '@/lib/email'
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
    const body = await req.json()
    const data = Schema.parse(body)

    const school = await db.school.findUnique({
      where: { id: data.schoolId },
      select: { id: true, name: true, email: true, isActive: true },
    })
    if (!school?.isActive) return NextResponse.json({ error: 'School not found' }, { status: 404 })

    const enquiry = await db.enquiry.create({
      data: {
        schoolId:    data.schoolId,
        parentName:  data.parentName,
        parentEmail: data.parentEmail,
        parentPhone: data.parentPhone,
        studentName: data.studentName,
        grade:       data.grade,
        session:     data.session,
        message:     data.message,
      },
    })

    // Send emails (non-blocking)
    const promises = [
      emailEnquiryConfirmToParent({ parentEmail: data.parentEmail, parentName: data.parentName, schoolName: school.name, studentName: data.studentName }),
    ]
    if (school.email) {
      promises.push(emailEnquiryToSchool({ schoolEmail: school.email, schoolName: school.name, parentName: data.parentName, parentEmail: data.parentEmail, parentPhone: data.parentPhone, studentName: data.studentName, grade: data.grade, message: data.message }))
    }

    Promise.all(promises).then(() =>
      db.enquiry.update({ where: { id: enquiry.id }, data: { emailedAt: new Date() } })
    ).catch(console.error)

    return NextResponse.json({ success: true })
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: 'Invalid data', details: e.errors }, { status: 400 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

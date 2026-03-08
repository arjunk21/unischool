export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/prisma'
import { Mail, Phone, User, Clock } from 'lucide-react'

export const metadata = { title: 'Enquiries — School Dashboard' }

export default async function SchoolEnquiriesPage() {
  const session = await getSession()
  if (!session?.user) redirect('/login')

  const admin = await db.schoolAdmin.findUnique({
    where: { userId: (session.user as any).id },
    include: { school: true },
  })
  if (!admin) redirect('/')

  const enquiries = await db.enquiry.findMany({
    where: { schoolId: admin.schoolId },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

  const total   = enquiries.length
  const newCount = enquiries.filter(e => e.status === 'NEW').length
  const thisMonth = enquiries.filter(e => new Date(e.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">{admin.school.name}</h1>
        <p className="text-gray-500 text-sm mt-1">Admission Enquiries</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[['Total',total,'text-brand'],['New',newCount,'text-accent'],['This Month',thisMonth,'text-teal']].map(([l,v,c])=>(
          <div key={String(l)} className="card p-5 text-center">
            <div className={`text-3xl font-extrabold ${c}`}>{v}</div>
            <div className="text-xs text-gray-500 mt-1">{l}</div>
          </div>
        ))}
      </div>

      {enquiries.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">
          <Mail className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No enquiries yet</p>
          <p className="text-sm mt-1">They'll appear here when parents submit the enquiry form on your school page.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {enquiries.map(e => (
            <div key={e.id} className={`card p-5 border-l-4 ${e.status==='NEW'?'border-l-accent':'border-l-gray-200'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">{e.studentName}</span>
                    <span className="badge-blue">{e.grade}</span>
                    <span className="badge-gray">{e.session}</span>
                    {e.status==='NEW' && <span className="badge-orange">New</span>}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{e.parentName}</span>
                    <a href={`mailto:${e.parentEmail}`} className="flex items-center gap-1 hover:text-brand"><Mail className="w-3.5 h-3.5" />{e.parentEmail}</a>
                    {e.parentPhone && <a href={`tel:${e.parentPhone}`} className="flex items-center gap-1 hover:text-brand"><Phone className="w-3.5 h-3.5" />{e.parentPhone}</a>}
                  </div>
                  {e.message && <p className="text-sm text-gray-500 mt-2 bg-gray-50 rounded-lg px-3 py-2">{e.message}</p>}
                </div>
                <div className="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(e.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

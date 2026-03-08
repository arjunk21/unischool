export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/prisma'
import { Mail, Phone, User, Clock, TrendingUp } from 'lucide-react'

export const metadata = { title: 'Admin — Enquiries' }

export default async function AdminEnquiriesPage() {
  const session = await getSession()
  if (!session?.user || (session.user as any).role !== 'PLATFORM_ADMIN') redirect('/')

  const enquiries = await db.enquiry.findMany({
    orderBy: { createdAt: 'desc' },
    take: 500,
    include: {
      school: { select: { name: true, city: true, state: true, slug: true } }
    }
  })

  const today = new Date(); today.setHours(0,0,0,0)
  const weekAgo = new Date(Date.now() - 7*24*60*60*1000)
  const monthAgo = new Date(Date.now() - 30*24*60*60*1000)

  const todayCount = enquiries.filter(e => new Date(e.createdAt) >= today).length
  const weekCount = enquiries.filter(e => new Date(e.createdAt) >= weekAgo).length
  const monthCount = enquiries.filter(e => new Date(e.createdAt) >= monthAgo).length

  // Top schools by enquiry count
  const schoolCounts: Record<string, { name: string; city: string; count: number }> = {}
  enquiries.forEach(e => {
    if (!schoolCounts[e.schoolId]) schoolCounts[e.schoolId] = { name: e.school.name, city: e.school.city, count: 0 }
    schoolCounts[e.schoolId].count++
  })
  const topSchools = Object.values(schoolCounts).sort((a,b) => b.count - a.count).slice(0, 5)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">All Enquiries</h1>
      <p className="text-gray-500 text-sm mb-8">Every admission enquiry submitted across all schools.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[['Total',enquiries.length,'text-brand'],['Today',todayCount,'text-accent'],['This Week',weekCount,'text-teal'],['This Month',monthCount,'text-purple-600']].map(([l,v,c])=>(
          <div key={String(l)} className="card p-5 text-center">
            <div className={`text-3xl font-extrabold ${c}`}>{v}</div>
            <div className="text-xs text-gray-500 mt-1">{l}</div>
          </div>
        ))}
      </div>

      {topSchools.length > 0 && (
        <div className="card p-5 mb-8">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-accent" /> Top Schools by Enquiries</h2>
          <div className="space-y-2">
            {topSchools.map((s,i)=>(
              <div key={s.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center">{i+1}</div>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{s.name}</div>
                    <div className="text-xs text-gray-500">{s.city}</div>
                  </div>
                </div>
                <div className="font-bold text-brand">{s.count} enquiries</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {enquiries.map(e => (
          <div key={e.id} className={`card p-5 border-l-4 ${e.status==='NEW'?'border-l-accent':'border-l-gray-200'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold text-gray-900">{e.studentName}</span>
                  <span className="badge-blue">{e.grade}</span>
                  <span className="badge-gray">{e.session}</span>
                  {e.status==='NEW' && <span className="badge-orange">New</span>}
                  <span className="text-xs text-gray-400">→ {e.school.name}, {e.school.city}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{e.parentName}</span>
                  <a href={`mailto:${e.parentEmail}`} className="flex items-center gap-1 hover:text-brand"><Mail className="w-3.5 h-3.5" />{e.parentEmail}</a>
                  {e.parentPhone && <a href={`tel:${e.parentPhone}`} className="flex items-center gap-1 hover:text-brand"><Phone className="w-3.5 h-3.5" />{e.parentPhone}</a>}
                </div>
                {e.message && <p className="text-sm text-gray-500 mt-2 bg-gray-50 rounded-lg px-3 py-2">{e.message}</p>}
              </div>
              <div className="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1 shrink-0">
                <Clock className="w-3 h-3" />
                {new Date(e.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
              </div>
            </div>
          </div>
        ))}
        {enquiries.length === 0 && (
          <div className="card p-12 text-center text-gray-400">
            <Mail className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No enquiries yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

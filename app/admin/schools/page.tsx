import { auth } from '@/lib/auth'
import { db } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ClaimActions } from './claim-actions'

export const metadata = { title: 'Admin — Claim Requests' }

export default async function AdminClaimsPage() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'PLATFORM_ADMIN') redirect('/')

  const claims = await db.claimRequest.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      school: { select: { id: true, name: true, city: true, state: true, isClaimed: true } },
      user:   { select: { name: true, email: true } },
    },
  })

  const byStatus = {
    PENDING:  claims.filter(c => c.status === 'PENDING'),
    APPROVED: claims.filter(c => c.status === 'APPROVED'),
    REJECTED: claims.filter(c => c.status === 'REJECTED'),
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Admin — Claim Requests</h1>
      <p className="text-gray-500 text-sm mb-8">Approve or reject school claim requests.</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[['Pending', byStatus.PENDING.length,'text-accent'],['Approved', byStatus.APPROVED.length,'text-teal'],['Rejected', byStatus.REJECTED.length,'text-red-500']].map(([l,v,c])=>(
          <div key={String(l)} className="card p-4 text-center">
            <div className={`text-2xl font-extrabold ${c}`}>{v}</div>
            <div className="text-xs text-gray-500 mt-1">{l}</div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {claims.map(c => (
          <div key={c.id} className={`card p-5 border-l-4 ${c.status==='PENDING'?'border-l-accent':c.status==='APPROVED'?'border-l-teal':'border-l-red-400'}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900">{c.school.name}</span>
                  <span className="text-xs text-gray-400">{c.school.city}, {c.school.state}</span>
                  <span className={`badge ${c.status==='PENDING'?'badge-orange':c.status==='APPROVED'?'badge-green':'bg-red-50 text-red-600'}`}>{c.status}</span>
                </div>
                <div className="text-sm text-gray-600 space-y-0.5">
                  <p><span className="font-medium">Claimant:</span> {c.representName} — {c.designation}</p>
                  <p><span className="font-medium">Registered user:</span> {c.user.name} ({c.user.email})</p>
                  <p><span className="font-medium">Official email:</span> {c.officialEmail} | {c.phone}</p>
                  {c.message && <p className="text-gray-500 italic mt-1">"{c.message}"</p>}
                  <p className="text-xs text-gray-400 mt-1">{new Date(c.createdAt).toLocaleString('en-IN')}</p>
                </div>
              </div>
              {c.status === 'PENDING' && <ClaimActions claimId={c.id} schoolId={c.schoolId} userId={c.userId} />}
            </div>
          </div>
        ))}
        {claims.length === 0 && <div className="card p-10 text-center text-gray-400">No claim requests yet.</div>}
      </div>
    </div>
  )
}

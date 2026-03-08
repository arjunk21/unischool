'use client'
import { useState } from 'react'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function ClaimActions({ claimId, schoolId, userId }: { claimId: string; schoolId: string; userId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<'approve'|'reject'|null>(null)

  const act = async (action: 'approve' | 'reject') => {
    setLoading(action)
    await fetch('/api/admin/claims', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claimId, schoolId, userId, action }),
    })
    setLoading(null)
    router.refresh()
  }

  return (
    <div className="flex gap-2 shrink-0">
      <button onClick={() => act('approve')} disabled={!!loading} className="btn bg-teal text-white hover:opacity-90 px-4 py-2 text-sm">
        {loading==='approve' ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Approve</>}
      </button>
      <button onClick={() => act('reject')} disabled={!!loading} className="btn bg-red-500 text-white hover:opacity-90 px-4 py-2 text-sm">
        {loading==='reject' ? <Loader2 className="w-4 h-4 animate-spin" /> : <><XCircle className="w-4 h-4" /> Reject</>}
      </button>
    </div>
  )
}

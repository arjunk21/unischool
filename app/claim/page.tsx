'use client'
import { Suspense } from 'react'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Building2, Search } from 'lucide-react'

function ClaimForm() {
  const { data: session, status } = useSession()
  const sp = useSearchParams()
  const router = useRouter()
  const schoolId = sp.get('school') || ''
  const schoolName = sp.get('name') || ''
  const schoolSlug = sp.get('slug') || ''

  const claimUrl = `/claim?school=${schoolId}&name=${encodeURIComponent(schoolName)}&slug=${schoolSlug}`

  const [searchQ, setSearchQ] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedSchool, setSelectedSchool] = useState(schoolId ? { id: schoolId, name: schoolName, slug: schoolSlug } : null)
  const [searching, setSearching] = useState(false)
  const [form, setForm] = useState({ representName:'', designation:'', officialEmail:'', phone:'', message:'' })
  const [success, setSuccess] = useState(false)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => setForm(f=>({...f,[k]:e.target.value}))

  const searchSchools = async () => {
    if (!searchQ.trim()) return
    setSearching(true)
    const res = await fetch(`/api/schools?q=${encodeURIComponent(searchQ)}&page=1`)
    const data = await res.json()
    setSearchResults(data.data || [])
    setSearching(false)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setLoading(true)
    const res = await fetch('/api/claim', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ schoolId: selectedSchool?.id, ...form })
    })
    const j = await res.json()
    setLoading(false)
    if (!res.ok) {
      const msg = Array.isArray(j.error) ? j.error[0]?.message || 'Validation failed' : j.error || 'Failed'
      setErr(msg); return
    }
    setSuccess(true)
  }

  if (success) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <CheckCircle2 className="w-16 h-16 text-teal mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
      <p className="text-gray-500 mb-2">We'll verify and respond within 2–3 business days.</p>
      {schoolSlug && <p className="text-sm text-gray-400 mb-6">You claimed: <strong>{selectedSchool?.name}</strong></p>}
      <Link href={schoolSlug ? `/schools/${schoolSlug}` : '/'} className="btn-primary">Back to School Page</Link>
    </div>
  )

  if (status === 'loading') return (
    <div className="flex items-center justify-center min-h-screen text-gray-400">Loading…</div>
  )

  if (!session) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <Building2 className="w-12 h-12 text-brand mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
      <p className="text-gray-500 mb-6">Please login or register to claim a school profile.</p>
      <div className="flex gap-3 justify-center">
        <Link href={`/login?redirect=${encodeURIComponent(claimUrl)}`} className="btn-outline">Sign In</Link>
        <Link href={`/register?redirect=${encodeURIComponent(claimUrl)}`} className="btn-primary">Register Free</Link>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Claim Your School Profile</h1>
      <p className="text-gray-500 text-sm mb-8">Our team will verify and approve within 2–3 business days.</p>

      {!selectedSchool ? (
        <div className="card p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Search for your school</h2>
          <div className="flex gap-2">
            <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&searchSchools()} placeholder="Type school name…" className="input flex-1" />
            <button onClick={searchSchools} disabled={searching} className="btn-primary"><Search className="w-4 h-4" />{searching?'…':'Search'}</button>
          </div>
          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              {searchResults.map(s=>(
                <button key={s.id} onClick={()=>setSelectedSchool(s)}
                  className="w-full text-left p-3 rounded-xl border border-gray-200 hover:border-brand hover:bg-brand-pale transition-colors">
                  <div className="font-semibold text-gray-900 text-sm">{s.name}</div>
                  <div className="text-xs text-gray-500">{s.city}, {s.state}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-brand-pale border border-brand/20 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Claiming profile for</p>
            <p className="font-bold text-brand">{selectedSchool.name}</p>
          </div>
          <button onClick={()=>setSelectedSchool(null)} className="text-xs text-gray-400 hover:text-red-500">Change</button>
        </div>
      )}

      {selectedSchool && (
        <div className="card p-6">
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="label">Your Full Name *</label><input value={form.representName} onChange={set('representName')} className="input" required /></div>
              <div><label className="label">Designation *</label><input value={form.designation} onChange={set('designation')} className="input" placeholder="Principal / Director" required /></div>
              <div><label className="label">Official School Email *</label><input value={form.officialEmail} onChange={set('officialEmail')} type="email" className="input" required /></div>
              <div><label className="label">Phone *</label><input value={form.phone} onChange={set('phone')} type="tel" className="input" required minLength={10} /></div>
            </div>
            <div><label className="label">Message (optional)</label><textarea value={form.message} onChange={set('message')} className="input h-24 resize-none" /></div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
              You may be asked to email a copy of your school's affiliation certificate for verification.
            </div>
            {err && <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{err}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Submitting…' : 'Submit Claim Request'}</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default function ClaimPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-gray-400">Loading…</div>}>
      <ClaimForm />
    </Suspense>
  )
}

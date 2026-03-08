'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { CheckCircle2, Building2 } from 'lucide-react'

export default function ClaimPage() {
  const { data: session } = useSession()
  const sp = useSearchParams()
  const schoolId   = sp.get('school') || ''
  const schoolName = sp.get('name')   || ''

  const [form, setForm] = useState({ schoolId, representName:'', designation:'', officialEmail:'', phone:'', message:'' })
  const [success, setSuccess] = useState(false)
  const [err,     setErr]     = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => setForm(f=>({...f,[k]:e.target.value}))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setLoading(true)
    const res = await fetch('/api/claim', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
    const j   = await res.json()
    setLoading(false)
    if (!res.ok) { setErr(j.error || 'Failed'); return }
    setSuccess(true)
  }

  if (success) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <CheckCircle2 className="w-16 h-16 text-teal mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted</h2>
      <p className="text-gray-500 mb-6">We'll review your documents and respond within 2–3 business days.</p>
      <Link href="/" className="btn-primary">Back to Home</Link>
    </div>
  )

  if (!session) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <Building2 className="w-12 h-12 text-brand mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
      <p className="text-gray-500 mb-6">Please login to claim a school profile.</p>
      <Link href="/login" className="btn-primary">Sign In</Link>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Claim Your School Profile</h1>
      {schoolName && <p className="text-brand font-semibold mb-1">{schoolName}</p>}
      <p className="text-gray-500 text-sm mb-8">Our team will verify and approve within 2–3 business days.</p>
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
    </div>
  )
}

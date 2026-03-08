'use client'
import { useState } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'

const GRADES   = ['Nursery','KG','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11 Science','Grade 11 Commerce','Grade 11 Arts','Grade 12 Science','Grade 12 Commerce','Grade 12 Arts']
const SESSIONS = ['2025–26','2026–27','2027–28']

export function EnquiryForm({ schoolId, schoolName }: { schoolId: string; schoolName: string }) {
  const [form, setForm] = useState({ parentName:'', parentEmail:'', parentPhone:'', studentName:'', grade:GRADES[0], session:SESSIONS[0], message:'' })
  const [sent,    setSent]    = useState(false)
  const [err,     setErr]     = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => setForm(f=>({...f,[k]:e.target.value}))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setLoading(true)
    const res = await fetch('/api/enquiries', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ schoolId, ...form }) })
    setLoading(false)
    if (res.ok) setSent(true)
    else { const j = await res.json(); setErr(j.error || 'Failed. Please try again.') }
  }

  if (sent) return (
    <div className="card p-6 text-center">
      <CheckCircle2 className="w-12 h-12 text-teal mx-auto mb-3" />
      <h3 className="font-bold text-gray-900 mb-1">Enquiry Sent!</h3>
      <p className="text-sm text-gray-500"><strong>{schoolName}</strong> will contact you within 2–3 business days.</p>
    </div>
  )

  return (
    <div className="card p-5">
      <h3 className="font-bold text-gray-900 mb-1">Send Admission Enquiry</h3>
      <p className="text-xs text-gray-500 mb-4">Free. Goes directly to {schoolName}.</p>
      <form onSubmit={submit} className="space-y-3">
        <div><label className="label">Parent Name *</label><input value={form.parentName} onChange={set('parentName')} className="input" required minLength={2} /></div>
        <div><label className="label">Email *</label><input value={form.parentEmail} onChange={set('parentEmail')} type="email" className="input" required /></div>
        <div><label className="label">Phone</label><input value={form.parentPhone} onChange={set('parentPhone')} className="input" placeholder="+91 98765 43210" /></div>
        <div><label className="label">Student Name *</label><input value={form.studentName} onChange={set('studentName')} className="input" required /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">Grade *</label>
            <select value={form.grade} onChange={set('grade')} className="input">
              {GRADES.map(g=><option key={g}>{g}</option>)}
            </select>
          </div>
          <div><label className="label">Session *</label>
            <select value={form.session} onChange={set('session')} className="input">
              {SESSIONS.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div><label className="label">Message</label><textarea value={form.message} onChange={set('message')} className="input resize-none h-20" /></div>
        {err && <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{err}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Sending…' : <><Send className="w-4 h-4" /> Send Enquiry</>}
        </button>
        <p className="text-xs text-gray-400 text-center">Your details are shared only with this school.</p>
      </form>
    </div>
  )
}

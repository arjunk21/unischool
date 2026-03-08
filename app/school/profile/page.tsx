'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Save, Loader2 } from 'lucide-react'

export default function SchoolProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [school, setSchool] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [err,    setErr]    = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated') {
      fetch('/api/school/me').then(r => r.json()).then(d => {
        if (d.error) router.push('/')
        else setSchool(d)
      })
    }
  }, [status])

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setSchool((s: any) => ({ ...s, [k]: e.target.value }))

  const toggleFacility = (k: string) => setSchool((s: any) => ({ ...s, [k]: !s[k] }))

  const save = async () => {
    setSaving(true); setErr('')
    const res = await fetch('/api/school/me', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(school) })
    setSaving(false)
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000) }
    else { const j = await res.json(); setErr(j.error || 'Save failed') }
  }

  if (!school) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-brand" /></div>

  const FACILITIES = [['hasLibrary','Library'],['hasScienceLab','Science Lab'],['hasComputerLab','Computer Lab'],['hasSports','Sports'],['hasTransport','Transport'],['hasHostel','Hostel'],['hasCanteen','Canteen'],['hasMedical','Medical Room'],['hasCCTV','CCTV'],['hasSmartClass','Smart Class']]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Edit School Profile</h1>
          <p className="text-gray-500 text-sm mt-1">{school.name}</p>
        </div>
        <button onClick={save} disabled={saving} className="btn-primary">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" />{saved ? 'Saved!' : 'Save Changes'}</>}
        </button>
      </div>

      {err && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mb-6">{err}</p>}

      <div className="space-y-6">
        {/* Basic info */}
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Basic Information</h2>
          <div>
            <label className="label">School Name</label>
            <input value={school.name || ''} onChange={update('name')} className="input" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea value={school.description || ''} onChange={update('description')} className="input h-28 resize-none" placeholder="About your school…" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Year Established</label>
              <input value={school.established || ''} onChange={update('established')} type="number" className="input" />
            </div>
            <div>
              <label className="label">Medium of Instruction</label>
              <select value={school.medium || 'ENGLISH'} onChange={update('medium')} className="input">
                {['ENGLISH','HINDI','BILINGUAL','REGIONAL'].map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Grades From</label>
              <input value={school.gradesFrom || ''} onChange={update('gradesFrom')} className="input" placeholder="KG / 1" />
            </div>
            <div>
              <label className="label">Grades To</label>
              <input value={school.gradesTo || ''} onChange={update('gradesTo')} className="input" placeholder="10 / 12" />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Contact Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Phone</label>
              <input value={school.phone || ''} onChange={update('phone')} className="input" />
            </div>
            <div>
              <label className="label">Email</label>
              <input value={school.email || ''} onChange={update('email')} type="email" className="input" />
            </div>
            <div className="col-span-2">
              <label className="label">Website</label>
              <input value={school.website || ''} onChange={update('website')} className="input" placeholder="https://yourschool.edu.in" />
            </div>
          </div>
        </div>

        {/* Fees */}
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Annual Fees (₹)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Minimum Fees</label>
              <input value={school.feeMin || ''} onChange={update('feeMin')} type="number" className="input" placeholder="60000" />
            </div>
            <div>
              <label className="label">Maximum Fees</label>
              <input value={school.feeMax || ''} onChange={update('feeMax')} type="number" className="input" placeholder="120000" />
            </div>
          </div>
        </div>

        {/* Facilities */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-4">Facilities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FACILITIES.map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                <input type="checkbox" checked={school[key] || false} onChange={() => toggleFacility(key)} className="w-4 h-4 accent-brand" />
                {label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

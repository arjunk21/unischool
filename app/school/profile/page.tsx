'use client'
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Save, Upload, X, Image as ImageIcon } from 'lucide-react'

export default function SchoolProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [school, setSchool] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [err, setErr] = useState('')
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const coverRef = useRef<HTMLInputElement>(null)
  const logoRef = useRef<HTMLInputElement>(null)
  const photoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated') {
      fetch('/api/school/me').then(r=>r.json()).then(d=>{ if (d.error) router.push('/'); else setSchool(d) })
    }
  }, [status])

  const uploadFile = async (file: File, path: string): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('path', path)
    const res = await fetch('/api/school/upload', { method: 'POST', body: formData })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Upload failed')
    return data.url
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploadingCover(true)
    try {
      const url = await uploadFile(file, `schools/${school.id}/cover-${Date.now()}`)
      setSchool((s: any) => ({ ...s, coverUrl: url }))
    } catch (err) { setErr('Cover upload failed') }
    setUploadingCover(false)
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploadingLogo(true)
    try {
      const url = await uploadFile(file, `schools/${school.id}/logo-${Date.now()}`)
      setSchool((s: any) => ({ ...s, logoUrl: url }))
    } catch (err) { setErr('Logo upload failed') }
    setUploadingLogo(false)
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files?.length) return
    setUploadingPhoto(true)
    try {
      const urls = await Promise.all(
        Array.from(files).map(f => uploadFile(f, `schools/${school.id}/photos/${Date.now()}-${f.name}`))
      )
      setSchool((s: any) => ({ ...s, photos: [...(s.photos || []), ...urls] }))
    } catch (err) { setErr('Photo upload failed') }
    setUploadingPhoto(false)
  }

  const removePhoto = (url: string) => {
    setSchool((s: any) => ({ ...s, photos: s.photos.filter((p: string) => p !== url) }))
  }

  const toggle = (k: string) => setSchool((s: any) => ({ ...s, [k]: !s[k] }))
  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => setSchool((s: any) => ({ ...s, [k]: e.target.value }))

  const save = async () => {
    setSaving(true); setErr('')
    const res = await fetch('/api/school/me', { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(school) })
    setSaving(false)
    if (res.ok) { setSaved(true); setTimeout(()=>setSaved(false),3000) }
    else { const j = await res.json(); setErr(j.error||'Save failed') }
  }

  if (!school) return <div className="flex items-center justify-center min-h-screen text-gray-400">Loading…</div>

  const FAC = [['hasLibrary','Library'],['hasScienceLab','Science Lab'],['hasComputerLab','Computer Lab'],['hasSports','Sports'],['hasTransport','Transport'],['hasHostel','Hostel'],['hasCanteen','Canteen'],['hasMedical','Medical Room'],['hasCCTV','CCTV'],['hasSmartClass','Smart Class']]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-extrabold text-gray-900">Edit Profile</h1><p className="text-gray-500 text-sm">{school.name}</p></div>
        <button onClick={save} disabled={saving} className="btn-primary">
          <Save className="w-4 h-4" />{saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>
      {err && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mb-6">{err}</p>}

      {/* Cover Image */}
      <div className="card overflow-hidden mb-6">
        <div className="relative h-48 bg-gradient-to-br from-brand-pale to-blue-50">
          {school.coverUrl
            ? <img src={school.coverUrl} alt="" className="w-full h-full object-cover" />
            : <div className="flex items-center justify-center h-full text-gray-300"><ImageIcon className="w-12 h-12" /></div>
          }
          <button onClick={()=>coverRef.current?.click()} disabled={uploadingCover}
            className="absolute bottom-3 right-3 btn bg-white text-gray-700 hover:bg-gray-50 px-3 py-1.5 text-xs shadow-md">
            <Upload className="w-3.5 h-3.5" />{uploadingCover ? 'Uploading…' : 'Change Cover'}
          </button>
          <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
        </div>
        <div className="p-4 flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-xl bg-gray-100 border-2 border-white shadow overflow-hidden flex items-center justify-center shrink-0">
            {school.logoUrl
              ? <img src={school.logoUrl} alt="" className="w-full h-full object-cover" />
              : <span className="text-xl font-bold text-gray-300">{school.name?.slice(0,2).toUpperCase()}</span>
            }
            <button onClick={()=>logoRef.current?.click()} disabled={uploadingLogo}
              className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
              <Upload className="w-4 h-4 text-white" />
            </button>
            <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
          </div>
          <div>
            <p className="font-bold text-gray-900">{school.name}</p>
            <p className="text-xs text-gray-500">Click logo to change • Recommended: square PNG</p>
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Photo Gallery</h2>
          <button onClick={()=>photoRef.current?.click()} disabled={uploadingPhoto} className="btn-outline text-sm py-1.5">
            <Upload className="w-3.5 h-3.5" />{uploadingPhoto ? 'Uploading…' : 'Add Photos'}
          </button>
          <input ref={photoRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
        </div>
        {school.photos?.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {school.photos.map((url: string) => (
              <div key={url} className="relative group rounded-xl overflow-hidden h-28">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button onClick={()=>removePhoto(url)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No photos yet. Add photos to make your profile stand out.</p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Basic Info</h2>
          <div><label className="label">School Name</label><input value={school.name||''} onChange={update('name')} className="input" /></div>
          <div><label className="label">Description</label><textarea value={school.description||''} onChange={update('description')} className="input h-28 resize-none" placeholder="Tell parents about your school — history, values, achievements…" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Established</label><input value={school.established||''} onChange={update('established')} type="number" className="input" /></div>
            <div><label className="label">Medium</label>
              <select value={school.medium||'ENGLISH'} onChange={update('medium')} className="input">
                {['ENGLISH','HINDI','BILINGUAL','REGIONAL'].map(m=><option key={m}>{m}</option>)}
              </select>
            </div>
            <div><label className="label">Grades From</label><input value={school.gradesFrom||''} onChange={update('gradesFrom')} className="input" placeholder="KG / 1" /></div>
            <div><label className="label">Grades To</label><input value={school.gradesTo||''} onChange={update('gradesTo')} className="input" placeholder="10 / 12" /></div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Contact Details</h2>
          <p className="text-xs text-gray-500">These will be visible to parents on your school profile.</p>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Phone</label><input value={school.phone||''} onChange={update('phone')} className="input" /></div>
            <div><label className="label">Email</label><input value={school.email||''} onChange={update('email')} type="email" className="input" /></div>
            <div className="col-span-2"><label className="label">Website</label><input value={school.website||''} onChange={update('website')} className="input" /></div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Annual Fees (₹)</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Minimum</label><input value={school.feeMin||''} onChange={update('feeMin')} type="number" className="input" /></div>
            <div><label className="label">Maximum</label><input value={school.feeMax||''} onChange={update('feeMax')} type="number" className="input" /></div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-4">Facilities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FAC.map(([k,l])=>(
              <label key={k} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                <input type="checkbox" checked={school[k]||false} onChange={()=>toggle(k)} className="w-4 h-4 accent-brand" />{l}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

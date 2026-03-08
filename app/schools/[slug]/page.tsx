export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { notFound } from 'next/navigation'
import { db } from '@/lib/prisma'
import { MapPin, Phone, Globe, Mail, CheckCircle2, Building2 } from 'lucide-react'
import { EnquiryForm } from './enquiry-form'
import { rupees } from '@/lib/utils'

const FACILITIES = [
  ['hasLibrary','Library'],['hasScienceLab','Science Lab'],['hasComputerLab','Computer Lab'],
  ['hasSports','Sports Ground'],['hasTransport','Transport'],['hasHostel','Hostel'],
  ['hasCanteen','Canteen'],['hasMedical','Medical Room'],['hasCCTV','CCTV'],['hasSmartClass','Smart Class'],
]

export default async function SchoolPage({ params }: { params: { slug: string } }) {
  const school = await db.school.findUnique({ where: { slug: params.slug } })
  if (!school || !school.isActive) notFound()

  const yes = FACILITIES.filter(([k]) => (school as any)[k])
  const no  = FACILITIES.filter(([k]) => !(school as any)[k])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {!school.isClaimed && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-sm font-semibold text-amber-900">Are you the owner or admin of {school.name}?</p>
            <p className="text-xs text-amber-700 mt-0.5">Claim this profile to add photos, update details, and receive enquiries directly.</p>
          </div>
          <a href={`/claim?school=${school.id}&name=${encodeURIComponent(school.name)}`}
            className="btn bg-amber-600 text-white hover:bg-amber-700 px-4 py-2 text-sm whitespace-nowrap shrink-0">Claim Profile →</a>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="card overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-brand-pale to-blue-50 relative">
              {school.coverUrl && <img src={school.coverUrl} alt="" className="w-full h-full object-cover" />}
              <div className="absolute bottom-0 left-6 translate-y-1/2">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center font-bold text-brand text-xl overflow-hidden">
                  {school.logoUrl ? <img src={school.logoUrl} alt="" className="w-full h-full object-cover" /> : school.name.slice(0,2).toUpperCase()}
                </div>
              </div>
            </div>
            <div className="p-6 pt-10">
              {school.isVerified && <span className="verified-tag mb-2 w-fit"><CheckCircle2 className="w-3 h-3" /> Verified</span>}
              <h1 className="text-2xl font-extrabold text-gray-900">{school.name}</h1>
              <p className="flex items-center gap-1.5 text-gray-500 mt-1 text-sm">
                <MapPin className="w-4 h-4 shrink-0" />
                {[school.locality, school.city, school.state].filter(Boolean).join(', ')} — {school.pincode}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="badge-blue">{school.type.replace('_',' ')}</span>
                {school.boards.map(b=><span key={b} className="badge-gray">{b.replace('_',' ')}</span>)}
                {school.established && <span className="badge-gray">Est. {school.established}</span>}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
                {[
                  ['Grades',   school.gradesFrom && school.gradesTo ? `${school.gradesFrom}–${school.gradesTo}` : 'N/A'],
                  ['Annual Fees', school.feeMin || school.feeMax ? `${school.feeMin?rupees(school.feeMin):''}${school.feeMin&&school.feeMax?'–':''}${school.feeMax?rupees(school.feeMax):''}` : 'Contact'],
                  ['Medium',   school.medium],
                  ['Gender',   school.gender.replace('_',' ')],
                ].map(([k,v])=>(
                  <div key={k}><div className="text-xs text-gray-500 mb-0.5">{k}</div><div className="text-sm font-bold text-gray-900">{v}</div></div>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          {school.description && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{school.description}</p>
            </div>
          )}

          {/* Facilities */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Facilities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {yes.map(([,l])=>(
                <div key={l} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-teal shrink-0" />{l}
                </div>
              ))}
              {no.map(([,l])=>(
                <div key={l} className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-4 h-4 rounded-full border border-gray-200 shrink-0" />{l}
                </div>
              ))}
            </div>
            {!school.isClaimed && <p className="text-xs text-gray-400 mt-4 border-t border-gray-100 pt-3">Facilities may be incomplete. <a href="/claim" className="underline text-brand">Claim profile</a> to update.</p>}
          </div>

          {/* Photos */}
          {school.photos.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Photos</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {school.photos.map((url,i)=><img key={i} src={url} alt="" className="rounded-xl object-cover w-full h-36" />)}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          {/* Contact */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-4">Contact</h3>
            <div className="space-y-3">
              {school.phone && <a href={`tel:${school.phone}`} className="flex items-center gap-3 text-sm text-gray-700 hover:text-brand"><div className="w-8 h-8 rounded-lg bg-brand-pale flex items-center justify-center"><Phone className="w-4 h-4 text-brand" /></div>{school.phone}</a>}
              {school.email && <a href={`mailto:${school.email}`} className="flex items-center gap-3 text-sm text-gray-700 hover:text-brand"><div className="w-8 h-8 rounded-lg bg-brand-pale flex items-center justify-center"><Mail className="w-4 h-4 text-brand" /></div>{school.email}</a>}
              {school.website && <a href={school.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-700 hover:text-brand"><div className="w-8 h-8 rounded-lg bg-brand-pale flex items-center justify-center"><Globe className="w-4 h-4 text-brand" /></div>Website ↗</a>}
              {!school.phone && !school.email && !school.website && <p className="text-sm text-gray-400">No contact details yet. <a href="/claim" className="underline text-brand">Claim profile</a> to add them.</p>}
            </div>
          </div>
          <EnquiryForm schoolId={school.id} schoolName={school.name} />
        </div>
      </div>
    </div>
  )
}

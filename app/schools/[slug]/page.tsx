export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { db } from '@/lib/prisma'
import { MapPin, Phone, Globe, Mail, CheckCircle2, Building2, Users, BookOpen } from 'lucide-react'
import { EnquiryForm } from './enquiry-form'
import { ClaimBanner } from './claim-banner'
import { rupees } from '@/lib/utils'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const s = await db.school.findUnique({ where: { slug: params.slug }, select: { name: true, city: true, state: true } })
  if (!s) return {}
  return { title: `${s.name} — ${s.city}, ${s.state}`, description: `Admission details, facilities, and contact info for ${s.name} in ${s.city}.` }
}

const FACILITY = [
  ['hasLibrary','Library'], ['hasScienceLab','Science Lab'], ['hasComputerLab','Computer Lab'],
  ['hasSports','Sports Ground'], ['hasTransport','Transport'], ['hasHostel','Hostel'],
  ['hasCanteen','Canteen'], ['hasMedical','Medical Room'], ['hasCCTV','CCTV'],
  ['hasSmartClass','Smart Classrooms'],
]

export default async function SchoolProfile({ params }: { params: { slug: string } }) {
  const school = await db.school.findUnique({ where: { slug: params.slug } })
  if (!school || !school.isActive) notFound()

  const availFacilities = FACILITY.filter(([key]) => (school as any)[key])
  const missingFacilities = FACILITY.filter(([key]) => !(school as any)[key])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* Claim banner for unclaimed schools */}
      {!school.isClaimed && <ClaimBanner schoolId={school.id} schoolName={school.name} slug={school.slug} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Header card */}
          <div className="card overflow-hidden">
            {/* Cover */}
            <div className="h-48 bg-gradient-to-br from-brand-pale to-blue-50 relative">
              {school.coverUrl && <img src={school.coverUrl} alt="" className="w-full h-full object-cover" />}
              <div className="absolute bottom-0 left-6 translate-y-1/2">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center font-bold text-brand text-xl overflow-hidden">
                  {school.logoUrl ? <img src={school.logoUrl} alt="" className="w-full h-full object-cover" /> : school.name.slice(0,2).toUpperCase()}
                </div>
              </div>
            </div>

            <div className="p-6 pt-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  {school.isVerified && (
                    <span className="verified-tag mb-2 w-fit">
                      <CheckCircle2 className="w-3 h-3" /> Verified Profile
                    </span>
                  )}
                  <h1 className="text-2xl font-extrabold text-gray-900">{school.name}</h1>
                  <p className="flex items-center gap-1.5 text-gray-500 mt-1">
                    <MapPin className="w-4 h-4 shrink-0" />
                    {[school.locality, school.city, school.district, school.state].filter(Boolean).join(', ')} — {school.pincode}
                  </p>
                </div>
              </div>

              {/* Tags row */}
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="badge-blue">{school.type.replace('_',' ')}</span>
                {school.boards.map(b=><span key={b} className="badge-gray">{b.replace('_',' ')}</span>)}
                <span className="badge-gray">{school.gender.replace('_',' ')}</span>
                <span className="badge-gray">{school.medium}</span>
                {school.established && <span className="badge-gray">Est. {school.established}</span>}
              </div>

              {/* Key numbers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
                {[
                  ['Grades', school.gradesFrom && school.gradesTo ? `${school.gradesFrom} – ${school.gradesTo}` : 'N/A'],
                  ['Annual Fees', school.feeMin || school.feeMax ? `${school.feeMin ? rupees(school.feeMin) : ''}${school.feeMin && school.feeMax ? ' – ' : ''}${school.feeMax ? rupees(school.feeMax) : ''}` : 'Contact School'],
                  ['Medium', school.medium],
                  ['Type', school.isClaimed ? 'Claimed' : 'Auto-listed'],
                ].map(([k,v])=>(
                  <div key={k}>
                    <div className="text-xs text-gray-500 mb-0.5">{k}</div>
                    <div className="text-sm font-bold text-gray-900">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* About */}
          {school.description && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">About {school.name}</h2>
              <p className="text-gray-600 leading-relaxed text-sm">{school.description}</p>
            </div>
          )}

          {/* Facilities */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Facilities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {availFacilities.map(([,label])=>(
                <div key={label} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-teal shrink-0" />{label}
                </div>
              ))}
              {missingFacilities.map(([,label])=>(
                <div key={label} className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-4 h-4 rounded-full border border-gray-200 shrink-0" />{label}
                </div>
              ))}
            </div>
            {!school.isClaimed && (
              <p className="text-xs text-gray-400 mt-4 border-t border-gray-100 pt-3">
                ✏️ Facilities may be incomplete. <a href={`/claim`} className="underline text-brand">Claim this profile</a> to update.
              </p>
            )}
          </div>

          {/* Photos grid */}
          {school.photos.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Photos</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {school.photos.map((url,i)=>(
                  <img key={i} src={url} alt="" className="rounded-xl object-cover w-full h-36" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="space-y-5">

          {/* Contact card */}
          <div className="card p-5">
            <h3 className="font-bold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              {school.phone && (
                <a href={`tel:${school.phone}`} className="flex items-center gap-3 text-sm text-gray-700 hover:text-brand transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-brand-pale flex items-center justify-center">
                    <Phone className="w-4 h-4 text-brand" />
                  </div>
                  {school.phone}
                </a>
              )}
              {school.email && (
                <a href={`mailto:${school.email}`} className="flex items-center gap-3 text-sm text-gray-700 hover:text-brand transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-brand-pale flex items-center justify-center">
                    <Mail className="w-4 h-4 text-brand" />
                  </div>
                  {school.email}
                </a>
              )}
              {school.website && (
                <a href={school.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-700 hover:text-brand transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-brand-pale flex items-center justify-center">
                    <Globe className="w-4 h-4 text-brand" />
                  </div>
                  Visit Website ↗
                </a>
              )}
              {!school.phone && !school.email && !school.website && (
                <p className="text-sm text-gray-400">
                  Contact details not yet added.
                  {!school.isClaimed && <><br /><a href="/claim" className="underline text-brand">Claim this profile</a> to add them.</>}
                </p>
              )}
            </div>
          </div>

          {/* Enquiry form */}
          <EnquiryForm schoolId={school.id} schoolName={school.name} />
        </div>

      </div>
    </div>
  )
}

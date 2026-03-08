import Link from 'next/link'
import { Building2, ArrowRight } from 'lucide-react'

export function ClaimBanner({ schoolId, schoolName, slug }: { schoolId: string; schoolName: string; slug: string }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <Building2 className="w-5 h-5 text-amber-600 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-amber-900">Are you the owner or admin of {schoolName}?</p>
          <p className="text-xs text-amber-700 mt-0.5">Claim this profile to add photos, update details, and receive enquiries directly.</p>
        </div>
      </div>
      <Link href={`/claim?school=${schoolId}&name=${encodeURIComponent(schoolName)}`}
        className="btn bg-amber-600 text-white hover:bg-amber-700 px-4 py-2 text-sm whitespace-nowrap shrink-0">
        Claim Profile <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  )
}

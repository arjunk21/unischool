import Link from 'next/link'
import { MapPin, CheckCircle2, Building2 } from 'lucide-react'
import { rupees } from '@/lib/utils'

const BOARD_LABEL: Record<string,string> = { CBSE:'CBSE', ICSE:'ICSE', IB:'IB', CAMBRIDGE:'Cambridge', STATE_BOARD:'State Board' }
const TYPE_LABEL:  Record<string,string> = { K12:'K–12', PRIMARY:'Primary', SECONDARY:'Secondary', SENIOR_SECONDARY:'Sr. Secondary', COLLEGE:'College', COACHING:'Coaching' }

type S = {
  slug: string; name: string; city: string; state: string
  type: string; boards: string[]; isClaimed: boolean; isVerified: boolean
  feeMin: number|null; feeMax: number|null; logoUrl: string|null; coverUrl: string|null
  hasHostel: boolean; hasTransport: boolean
}

export function SchoolCard({ s }: { s: S }) {
  return (
    <Link href={`/schools/${s.slug}`}
      className="card flex flex-col overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="h-32 bg-gradient-to-br from-brand-pale to-blue-50 relative overflow-hidden">
        {s.coverUrl
          ? <img src={s.coverUrl} alt="" className="w-full h-full object-cover" />
          : <Building2 className="absolute inset-0 m-auto w-10 h-10 text-brand/20" />
        }
        <div className="absolute bottom-0 left-3 translate-y-1/2">
          <div className="w-12 h-12 rounded-xl bg-white shadow border border-gray-100 flex items-center justify-center font-bold text-brand text-sm overflow-hidden">
            {s.logoUrl ? <img src={s.logoUrl} alt="" className="w-full h-full object-cover" /> : s.name.slice(0,2).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="p-4 pt-8 flex flex-col flex-1">
        {s.isVerified && <span className="verified-tag mb-2 w-fit"><CheckCircle2 className="w-3 h-3" /> Verified</span>}
        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-1">{s.name}</h3>
        <p className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <MapPin className="w-3 h-3 shrink-0" />{s.city}, {s.state}
        </p>
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="badge-blue">{TYPE_LABEL[s.type] ?? s.type}</span>
          {s.boards.slice(0,2).map(b => <span key={b} className="badge-gray">{BOARD_LABEL[b] ?? b}</span>)}
          {s.hasHostel    && <span className="badge-orange">Hostel</span>}
          {s.hasTransport && <span className="badge-gray">Transport</span>}
        </div>
        <div className="mt-auto pt-2 border-t border-gray-100 text-xs text-gray-500">
          {s.feeMin || s.feeMax
            ? <>Fees: <span className="font-semibold text-gray-700">{s.feeMin ? rupees(s.feeMin) : ''}{s.feeMin && s.feeMax ? '–' : ''}{s.feeMax ? rupees(s.feeMax) : ''}/yr</span></>
            : 'Fees: Contact school'}
        </div>
      </div>
    </Link>
  )
}

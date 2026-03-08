'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, MapPin, BookOpen, Building2, Users, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react'
import { STATES, BOARDS, TYPES } from '@/lib/utils'

const CITIES = ['Mumbai','Delhi','Bangalore','Hyderabad','Chennai','Kolkata','Pune','Jaipur','Lucknow','Ahmedabad','Surat','Chandigarh']

export default function HomePage() {
  const router = useRouter()
  const [q,     setQ]     = useState('')
  const [city,  setCity]  = useState('')
  const [board, setBoard] = useState('')

  const search = (e: React.FormEvent) => {
    e.preventDefault()
    const p = new URLSearchParams()
    if (q)     p.set('q', q)
    if (city)  p.set('city', city)
    if (board) p.set('board', board)
    router.push(`/schools?${p}`)
  }

  return (
    <div>
      {/* ── HERO ── */}
      <section className="bg-brand relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-light animate-pulse" />
              1.5 Million+ Schools & Colleges across India
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
              Find the Right School<br />
              <span className="text-accent-light">Anywhere in India</span>
            </h1>
            <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
              Search by location, board, type, or facilities. Send direct admission enquiries to any school.
            </p>

            {/* Search box */}
            <form onSubmit={search} className="bg-white rounded-2xl shadow-xl p-3 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={q} onChange={e=>setQ(e.target.value)} placeholder="School name, area, keyword…"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand" />
              </div>
              <select value={city} onChange={e=>setCity(e.target.value)}
                className="sm:w-40 px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand">
                <option value="">Any City</option>
                {CITIES.map(c=><option key={c}>{c}</option>)}
              </select>
              <select value={board} onChange={e=>setBoard(e.target.value)}
                className="sm:w-36 px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand">
                <option value="">Any Board</option>
                {BOARDS.map(b=><option key={b}>{b.replace('_',' ')}</option>)}
              </select>
              <button type="submit" className="btn-accent whitespace-nowrap">
                <Search className="w-4 h-4" /> Search
              </button>
            </form>

            {/* Quick cities */}
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {CITIES.slice(0,8).map(c=>(
                <Link key={c} href={`/schools?city=${c}`}
                  className="text-white/60 hover:text-white text-sm underline underline-offset-2 decoration-white/30 transition-colors">
                  {c}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[['1.5M+','Schools Listed'],['28','States Covered'],['All Boards','CBSE, ICSE, IB & more'],['Free','To Search & Enquire']].map(([v,l])=>(
            <div key={l}>
              <div className="text-2xl font-extrabold text-brand">{v}</div>
              <div className="text-sm text-gray-500 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BROWSE BY TYPE ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by School Type</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {TYPES.map(({ value, label }) => (
            <Link key={value} href={`/schools?type=${value}`}
              className="card p-4 text-center hover:shadow-md hover:border-brand transition-all group">
              <Building2 className="w-8 h-8 text-brand/30 group-hover:text-brand mx-auto mb-2 transition-colors" />
              <div className="text-sm font-semibold text-gray-700 group-hover:text-brand transition-colors">{label}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BROWSE BY STATE ── */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by State</h2>
          <div className="flex flex-wrap gap-2">
            {STATES.map(s=>(
              <Link key={s} href={`/schools?state=${s}`}
                className="chip-idle">{s}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR SCHOOLS CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-gradient-to-r from-brand to-brand-light rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Is your school listed?</h2>
            <p className="text-white/70">Claim your profile, add photos, update facilities, and receive admission enquiries directly.</p>
          </div>
          <Link href="/claim" className="btn bg-white text-brand hover:bg-gray-50 px-6 py-3 whitespace-nowrap shrink-0">
            Claim Your School Profile <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

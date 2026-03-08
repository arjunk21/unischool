'use client'
import { Suspense } from 'react'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal } from 'lucide-react'
import { SchoolCard } from '@/components/school/school-card'
import { STATES, BOARDS, TYPES } from '@/lib/utils'

function SchoolsList() {
  const sp = useSearchParams()
  const [schools, setSchools] = useState<any[]>([])
  const [total,   setTotal]   = useState(0)
  const [page,    setPage]    = useState(1)
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const [q,        setQ]        = useState(sp.get('q')     || '')
  const [city,     setCity]     = useState(sp.get('city')  || '')
  const [state,    setState]    = useState(sp.get('state') || '')
  const [board,    setBoard]    = useState(sp.get('board') || '')
  const [type,     setType]     = useState(sp.get('type')  || '')
  const [hostel,   setHostel]   = useState(false)
  const [verified, setVerified] = useState(false)
  const [sort,     setSort]     = useState('name')

  const load = useCallback(async (pg = 1) => {
    setLoading(true)
    const p = new URLSearchParams()
    if (q)        p.set('q', q)
    if (city)     p.set('city', city)
    if (state)    p.set('state', state)
    if (board)    p.set('board', board)
    if (type)     p.set('type', type)
    if (hostel)   p.set('hostel', 'true')
    if (verified) p.set('verified', 'true')
    p.set('sort', sort)
    p.set('page', String(pg))
    const res  = await fetch(`/api/schools?${p}`)
    const data = await res.json()
    setSchools(data.data)
    setTotal(data.total)
    setPage(pg)
    setLoading(false)
  }, [q, city, state, board, type, hostel, verified, sort])

  useEffect(() => { load(1) }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <form onSubmit={e=>{e.preventDefault();load(1)}} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search schools…" className="input pl-9" />
        </div>
        <button type="submit" className="btn-primary">Search</button>
        <button type="button" onClick={()=>setShowFilters(!showFilters)}
          className={`btn border px-4 py-2.5 ${showFilters ? 'border-brand bg-brand-pale text-brand' : 'border-gray-200 bg-white text-gray-600 hover:border-brand hover:text-brand'}`}>
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </form>

      {showFilters && (
        <div className="card p-5 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><label className="label">State</label>
            <select value={state} onChange={e=>setState(e.target.value)} className="input">
              <option value="">All States</option>
              {STATES.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div><label className="label">City</label><input value={city} onChange={e=>setCity(e.target.value)} placeholder="Any city" className="input" /></div>
          <div><label className="label">Board</label>
            <select value={board} onChange={e=>setBoard(e.target.value)} className="input">
              <option value="">All Boards</option>
              {BOARDS.map(b=><option key={b} value={b}>{b.replace('_',' ')}</option>)}
            </select>
          </div>
          <div><label className="label">Type</label>
            <select value={type} onChange={e=>setType(e.target.value)} className="input">
              <option value="">All Types</option>
              {TYPES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={hostel} onChange={e=>setHostel(e.target.checked)} className="w-4 h-4 accent-brand" /> Has Hostel
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={verified} onChange={e=>setVerified(e.target.checked)} className="w-4 h-4 accent-brand" /> Verified Only
          </label>
          <div className="col-span-2 flex gap-2 justify-end mt-2">
            <button type="button" onClick={()=>{setCity('');setState('');setBoard('');setType('');setHostel(false);setVerified(false)}} className="btn-ghost text-sm">Clear</button>
            <button type="button" onClick={()=>load(1)} className="btn-primary text-sm">Apply</button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-600">
          {loading ? 'Searching…' : <><span className="font-bold text-gray-900">{total.toLocaleString()}</span> schools found</>}
        </p>
        <select value={sort} onChange={e=>{setSort(e.target.value);load(1)}} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none">
          <option value="name">A – Z</option>
          <option value="newest">Newest</option>
          <option value="fee_asc">Fees: Low → High</option>
          <option value="fee_desc">Fees: High → Low</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_,i)=><div key={i} className="card h-64 animate-pulse bg-gray-100" />)}
        </div>
      ) : schools.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No schools found. Try different filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {schools.map(s=><SchoolCard key={s.id} s={s} />)}
        </div>
      )}

      {!loading && total > 12 && (
        <div className="flex justify-center gap-2 mt-10">
          <button disabled={page===1} onClick={()=>load(page-1)} className="btn border border-gray-200 bg-white hover:border-brand hover:text-brand px-4 py-2 disabled:opacity-40">← Prev</button>
          <span className="flex items-center px-4 text-sm text-gray-600">Page {page} of {Math.ceil(total/12)}</span>
          <button disabled={page>=Math.ceil(total/12)} onClick={()=>load(page+1)} className="btn border border-gray-200 bg-white hover:border-brand hover:text-brand px-4 py-2 disabled:opacity-40">Next →</button>
        </div>
      )}
    </div>
  )
}

export default function SchoolsPage() {
  return (
    <Suspense>
      <SchoolsList />
    </Suspense>
  )
}

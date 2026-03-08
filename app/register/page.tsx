'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

export default function RegisterPage() {
  const router  = useRouter()
  const [form,    setForm]    = useState({ name:'', email:'', password:'', phone:'' })
  const [err,     setErr]     = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f=>({...f,[k]:e.target.value}))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setLoading(true)
    const res = await fetch('/api/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
    const j   = await res.json()
    setLoading(false)
    if (!res.ok) { setErr(j.error || 'Registration failed'); return }
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand mx-auto flex items-center justify-center mb-3">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Create an account</h1>
        </div>
        <div className="card p-6">
          <form onSubmit={submit} className="space-y-4">
            {([['name','Full Name','text'],['email','Email','email'],['password','Password (min 8)','password'],['phone','Phone (optional)','tel']] as const).map(([k,l,t])=>(
              <div key={k}><label className="label">{l}</label><input value={(form as any)[k]} onChange={set(k)} type={t} className="input" required={k!=='phone'} minLength={k==='password'?8:undefined} /></div>
            ))}
            {err && <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{err}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Creating…' : 'Create Account'}</button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">Have an account? <Link href="/login" className="text-brand font-semibold hover:underline">Sign in</Link></p>
        </div>
      </div>
    </div>
  )
}

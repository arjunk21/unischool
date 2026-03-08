'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [pass,  setPass]  = useState('')
  const [err,   setErr]   = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setLoading(true)
    const res = await signIn('credentials', { email, password: pass, redirect: false })
    setLoading(false)
    if (res?.error) setErr('Invalid email or password')
    else router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand mx-auto flex items-center justify-center mb-3">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Sign in to UniSchools</h1>
          <p className="text-gray-500 text-sm mt-1">School admins, parents &amp; platform team</p>
        </div>

        <div className="card p-6">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required className="input" placeholder="you@email.com" />
            </div>
            <div>
              <label className="label">Password</label>
              <input value={pass} onChange={e=>setPass(e.target.value)} type="password" required className="input" placeholder="••••••••" />
            </div>
            {err && <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{err}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            No account? <Link href="/register" className="text-brand font-semibold hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { GraduationCap, Menu, X } from 'lucide-react'

export function Navbar() {
  const { data: session } = useSession()
  const [open, setOpen]   = useState(false)
  const role = (session?.user as any)?.role

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-brand">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          Uni<span className="text-accent">Schools</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/schools"               className="hover:text-brand transition-colors">Find Schools</Link>
          <Link href="/schools?type=COLLEGE"  className="hover:text-brand transition-colors">Colleges</Link>
          <Link href="/schools?type=COACHING" className="hover:text-brand transition-colors">Coaching</Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              {role === 'SCHOOL_ADMIN'   && <Link href="/school/enquiries" className="btn-ghost text-sm">Dashboard</Link>}
              {role === 'PLATFORM_ADMIN' && <Link href="/admin/schools"    className="btn-ghost text-sm">Admin</Link>}
              <button onClick={() => signOut({ callbackUrl: '/' })} className="btn-outline text-sm py-2 px-4">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/login"    className="btn-ghost   text-sm">Sign In</Link>
              <Link href="/register" className="btn-primary text-sm">Register</Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-3 text-sm font-medium">
          <Link href="/schools"  onClick={() => setOpen(false)}>Find Schools</Link>
          <Link href="/login"    onClick={() => setOpen(false)}>Sign In</Link>
          <Link href="/register" onClick={() => setOpen(false)}>Register</Link>
        </div>
      )}
    </header>
  )
}

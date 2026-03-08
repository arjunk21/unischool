import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-brand text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 font-bold text-xl mb-3">
            <GraduationCap className="w-6 h-6 text-accent-light" /> UniSchools
          </div>
          <p className="text-white/60 text-sm">India's school and college directory across all 28 states.</p>
        </div>
        {[
          { title: 'Find',         links: [['Schools','/schools'],['Colleges','/schools?type=COLLEGE'],['Coaching','/schools?type=COACHING']] },
          { title: 'Institutions', links: [['Claim Profile','/claim'],['School Login','/login']] },
          { title: 'Company',      links: [['About','/about'],['Privacy Policy','/privacy'],['Terms','/terms'],['Contact','/contact']] },
        ].map(({ title, links }) => (
          <div key={title}>
            <h4 className="font-semibold mb-3 text-white/90">{title}</h4>
            <ul className="space-y-2 text-sm text-white/60">
              {links.map(([l, h]) => <li key={l}><Link href={h} className="hover:text-white transition-colors">{l}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row justify-between gap-2 text-xs text-white/40">
          <p>© 2024 UniSchools. Not an official government portal.</p>
          <p>Data sourced from UDISE+ and CBSE public databases.</p>
        </div>
      </div>
    </footer>
  )
}

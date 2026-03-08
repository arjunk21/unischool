import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'
import { Navbar }    from '@/components/navbar'
import { Footer }    from '@/components/footer'

export const metadata: Metadata = {
  title:       { default: 'UniSchools — Find Schools & Colleges Across India', template: '%s | UniSchools' },
  description: 'Search 1.5M+ schools and colleges across India. Filter by city, board, type, facilities. Send direct admission enquiries.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title:       { default: 'UniSchools — Find Schools & Colleges Across India', template: '%s | UniSchools' },
  description: 'Search 1.5M+ schools and colleges across India. Filter by city, board, type, and facilities. Send direct admission enquiries.',
  keywords:    ['schools india', 'cbse schools', 'find school', 'admission enquiry', 'school directory india'],
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

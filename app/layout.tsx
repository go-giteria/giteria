import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { GiteaProvider } from '@/components/providers/GiteaProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Giteria',
    template: '%s | Giteria'
  },
  description: 'The open-source Git platform with AI-powered development tools',
  keywords: ['git', 'code hosting', 'collaboration', 'development', 'ai'],
  authors: [{ name: 'Giteria Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://giteria.com',
    siteName: 'Giteria',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <ThemeProvider>
          <AuthProvider>
            <GiteaProvider>
              <div className="min-h-full bg-background">
                {children}
              </div>
            </GiteaProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
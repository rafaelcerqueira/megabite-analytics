import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MegaBite Analytics',
  description: 'Plataforma de analytics para restaurantes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark"> {/* dark mode */}
      <body className={`${inter.className} dark:bg-bg-primary`}>
        {children}
      </body>
    </html>
  )
}
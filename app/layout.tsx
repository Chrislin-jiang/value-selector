import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '价值选择器',
  description: '每天一个选择，一个微行动——让你活成自己认同的人',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#FAFBFE',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gradient-to-b from-[#FAFBFE] to-[#F0F2F8]">
        <main className="mx-auto max-w-md min-h-screen relative">
          {children}
        </main>
      </body>
    </html>
  )
}

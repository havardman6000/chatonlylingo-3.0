// src/app/chat/spanish/isabella/layout.tsx
'use client'

import { useRouter } from 'next/navigation'

export default function IsabellaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}
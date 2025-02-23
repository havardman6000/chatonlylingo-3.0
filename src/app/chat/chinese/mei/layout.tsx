'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
export default function MeiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();


  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
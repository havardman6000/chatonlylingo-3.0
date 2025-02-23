'use client';

export default function ChineseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen">{children}</div>;
}
// src/app/chat/chinese/layout.tsx  
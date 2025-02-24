// src/app/chat/[language]/[tutor]/layout.tsx
'use client';

import React from 'react';

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen">{children}</div>;
}
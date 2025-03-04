'use client';

import React, { useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';

export default function AyaChatPage() {
  useEffect(() => {
    // Preload assets or perform other initialization if needed
    document.title = 'Chat with Aya | LingoBabe';
  }, []);

  return (
    <ChatInterface characterId="aya" />
  );
}

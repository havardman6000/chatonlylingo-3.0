'use client';

import React, { useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';

export default function MisaChatPage() {
  useEffect(() => {
    // Preload assets or perform other initialization if needed
    document.title = 'Chat with Misa | LingoBabe';
  }, []);

  return (
    <ChatInterface characterId="misa" />
  );
}

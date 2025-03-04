'use client';

import React, { useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';

export default function ValentinaChatPage() {
  useEffect(() => {
    // Preload assets or perform other initialization if needed
    document.title = 'Chat with Valentina | LingoBabe';
  }, []);

  return (
    <ChatInterface characterId="valentina" />
  );
}

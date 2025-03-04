'use client';

import React, { useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';

export default function SofiaChatPage() {
  useEffect(() => {
    // Preload assets or perform other initialization if needed
    document.title = 'Chat with Sofia | LingoBabe';
  }, []);

  return (
    <ChatInterface characterId="sofia" />
  );
}

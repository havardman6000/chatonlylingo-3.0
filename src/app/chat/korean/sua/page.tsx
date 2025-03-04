'use client';

import React, { useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';

export default function SuaChatPage() {
  useEffect(() => {
    // Preload assets or perform other initialization if needed
    document.title = 'Chat with Sua | LingoBabe';
  }, []);

  return (
    <ChatInterface characterId="sua" />
  );
}

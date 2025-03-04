'use client';

import React, { useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';

export default function TingChatPage() {
  useEffect(() => {
    // Preload assets or perform other initialization if needed
    document.title = 'Chat with Ting | LingoBabe';
  }, []);

  return (
    <ChatInterface characterId="ting" />
  );
}

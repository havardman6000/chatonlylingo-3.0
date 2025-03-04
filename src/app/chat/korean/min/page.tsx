'use client';

import React, { useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';

export default function MinChatPage() {
  useEffect(() => {
    // Preload assets or perform other initialization if needed
    document.title = 'Chat with Min | LingoBabe';
  }, []);

  return (
    <ChatInterface characterId="min" />
  );
}

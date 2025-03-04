'use client';

import React, { useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';

export default function XueChatPage() {
  useEffect(() => {
    // Preload assets or perform other initialization if needed
    document.title = 'Chat with Xue | LingoBabe';
  }, []);

  return (
    <ChatInterface characterId="xue" />
  );
}

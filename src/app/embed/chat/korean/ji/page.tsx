// src/app/embed/chat/korean/ji/page.tsx
'use client';

import { useEffect, useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import { useChatStore } from '@/store/chatStore';

export default function JiEmbedPage() {
  const { selectedCharacter, actions } = useChatStore();
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Fixed values for this specific tutor
  const tutorId = 'ji';
  
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Reset and initialize the chat
        if (!selectedCharacter || selectedCharacter !== tutorId) {
          actions.reset();
          actions.selectCharacter(tutorId);
        }
        
        // Notify parent window that chat is ready
        if (window.self !== window.top) {
          window.parent.postMessage({
            type: 'lingobabe-chat-ready',
            tutorId: tutorId,
            language: 'korean'
          }, '*');
        }
      } finally {
        setIsInitializing(false);
      }
    };

    initializeChat();
    
    // Listen for messages from parent
    const handleParentMessage = (event: MessageEvent) => {
      // Handle message events from parent window if needed
      if (event.data?.type === 'lingobabe-send-message') {
        console.log('Received message from parent:', event.data);
      }
    };
    
    window.addEventListener('message', handleParentMessage);
    return () => window.removeEventListener('message', handleParentMessage);
  }, [selectedCharacter, actions]);

  if (isInitializing) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return <ChatInterface characterId={tutorId} embedded={true} />;
}